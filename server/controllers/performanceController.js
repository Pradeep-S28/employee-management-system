const db = require("../config/db");
const {
  isEmployeeInManagerTeam,
  reviewExistsForPeriod,
  countKpisForReview,
  getReviewWithKpis,
} = require("../services/performanceService");

const MIN_KPIS_TO_SUBMIT = 3;

// Manager/Admin creates a new review (starts in Draft)
const createReview = (req, res) => {
  const { employee_id, review_period } = req.body;
  const { role, employee_id: managerEmployeeId } = req.user;

  if (!employee_id || !review_period) {
    return res.status(400).json({
      message: "Employee and review period are required",
    });
  }

  const proceedWithCreate = () => {
    reviewExistsForPeriod(employee_id, review_period, (err, exists) => {
      if (err) {
        console.error("Error checking existing review:", err);
        return res.status(500).json({
          message: "Failed to create performance review",
        });
      }

      if (exists) {
        return res.status(400).json({
          message:
            "A performance review already exists for this employee and review period",
        });
      }

      const sql = `
        INSERT INTO performance_reviews
        (employee_id, manager_id, review_period, review_status)
        VALUES (?, ?, ?, 'Draft')
      `;

      db.query(
        sql,
        [employee_id, managerEmployeeId || null, review_period],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Error creating performance review:", insertErr);
            return res.status(500).json({
              message: "Failed to create performance review",
              error: insertErr.sqlMessage,
            });
          }

          res.status(201).json({
            message: "Performance review created as Draft",
            reviewId: result.insertId,
          });
        },
      );
    });
  };

  if (role === "manager") {
    isEmployeeInManagerTeam(managerEmployeeId, employee_id, (err, inTeam) => {
      if (err) {
        console.error("Error verifying manager team:", err);
        return res.status(500).json({
          message: "Failed to create performance review",
        });
      }

      if (!inTeam) {
        return res.status(403).json({
          message: "You can only create reviews for employees in your own team",
        });
      }

      proceedWithCreate();
    });
  } else {
    proceedWithCreate();
  }
};

// Manager/Admin updates a review: overall rating/feedback and/or submits it
const updateReview = (req, res) => {
  const { id } = req.params;
  const { overall_rating, overall_feedback, review_status } = req.body;
  const { role, employee_id: managerEmployeeId } = req.user;

  if (
    overall_rating !== undefined &&
    overall_rating !== null &&
    (overall_rating < 1 || overall_rating > 5)
  ) {
    return res.status(400).json({
      message: "Overall rating must be between 1 and 5",
    });
  }

  if (
    review_status &&
    !["Draft", "Submitted", "Completed"].includes(review_status)
  ) {
    return res.status(400).json({
      message: "Invalid review status",
    });
  }

  const sql = `SELECT * FROM performance_reviews WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching performance review:", err);
      return res.status(500).json({
        message: "Failed to update performance review",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Performance review not found",
      });
    }

    const review = results[0];

    if (role === "manager" && review.manager_id !== managerEmployeeId) {
      return res.status(403).json({
        message: "You can only update reviews you created for your own team",
      });
    }

    if (review.review_status !== "Draft") {
      return res.status(400).json({
        message: "Submitted reviews cannot be edited",
      });
    }

    const applyUpdate = () => {
      const updateSql = `
        UPDATE performance_reviews
        SET
          overall_rating = COALESCE(?, overall_rating),
          overall_feedback = COALESCE(?, overall_feedback),
          review_status = ?,
          submitted_on = CASE WHEN ? = 'Submitted' THEN CURRENT_TIMESTAMP ELSE submitted_on END
        WHERE id = ?
      `;

      const nextStatus = review_status || review.review_status;

      db.query(
        updateSql,
        [overall_rating, overall_feedback, nextStatus, nextStatus, id],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating performance review:", updateErr);
            return res.status(500).json({
              message: "Failed to update performance review",
            });
          }

          res.status(200).json({
            message: "Performance review updated successfully",
          });
        },
      );
    };

    if (review_status === "Submitted") {
      countKpisForReview(id, (kpiErr, kpiCount) => {
        if (kpiErr) {
          console.error("Error counting KPIs:", kpiErr);
          return res.status(500).json({
            message: "Failed to update performance review",
          });
        }

        if (kpiCount < MIN_KPIS_TO_SUBMIT) {
          return res.status(400).json({
            message: `At least ${MIN_KPIS_TO_SUBMIT} KPIs must be added before submitting a review`,
          });
        }

        if (!overall_rating && !review.overall_rating) {
          return res.status(400).json({
            message: "Overall rating is required before submitting a review",
          });
        }

        applyUpdate();
      });
    } else {
      applyUpdate();
    }
  });
};

// Role-based list of reviews
const getReviews = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;

  let sql = `
    SELECT
      pr.id,
      pr.employee_id,
      e.full_name AS employee_name,
      e.department,
      e.designation,
      pr.manager_id,
      m.full_name AS manager_name,
      pr.review_period,
      pr.overall_rating,
      pr.overall_feedback,
      pr.review_status,
      pr.submitted_on,
      pr.created_at
    FROM performance_reviews pr
    JOIN employees e ON pr.employee_id = e.id
    LEFT JOIN employees m ON pr.manager_id = m.id
  `;

  const values = [];

  if (role === "manager") {
    sql += ` WHERE pr.manager_id = ?`;
    values.push(userEmployeeId);
  } else if (role === "employee") {
    sql += ` WHERE pr.employee_id = ? AND pr.review_status IN ('Submitted', 'Completed')`;
    values.push(userEmployeeId);
  }

  sql += ` ORDER BY pr.created_at DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching performance reviews:", err);
      return res.status(500).json({
        message: "Failed to fetch performance reviews",
      });
    }

    res.status(200).json(results);
  });
};

// Single review with its KPIs
const getReviewById = (req, res) => {
  const { id } = req.params;
  const { role, employee_id: userEmployeeId } = req.user;

  getReviewWithKpis(id, (err, review) => {
    if (err) {
      console.error("Error fetching performance review:", err);
      return res.status(500).json({
        message: "Failed to fetch performance review",
      });
    }

    if (!review) {
      return res.status(404).json({
        message: "Performance review not found",
      });
    }

    if (role === "employee") {
      const isOwnReview = review.employee_id === userEmployeeId;
      const isVisible = ["Submitted", "Completed"].includes(
        review.review_status,
      );

      if (!isOwnReview || !isVisible) {
        return res.status(403).json({
          message: "Access denied to this performance review",
        });
      }
    }

    if (role === "manager" && review.manager_id !== userEmployeeId) {
      return res.status(403).json({
        message: "Access denied to this performance review",
      });
    }

    res.status(200).json(review);
  });
};

// Adds a KPI line item to a Draft review
const addKpi = (req, res) => {
  const { review_id, kpi_name, kpi_score, remarks } = req.body;
  const { role, employee_id: managerEmployeeId } = req.user;

  if (!review_id || !kpi_name || !kpi_score) {
    return res.status(400).json({
      message: "Review, KPI name, and KPI score are required",
    });
  }

  if (kpi_score < 1 || kpi_score > 5) {
    return res.status(400).json({
      message: "KPI score must be between 1 and 5",
    });
  }

  const sql = `SELECT * FROM performance_reviews WHERE id = ?`;

  db.query(sql, [review_id], (err, results) => {
    if (err) {
      console.error("Error fetching performance review:", err);
      return res.status(500).json({
        message: "Failed to add KPI",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Performance review not found",
      });
    }

    const review = results[0];

    if (role === "manager" && review.manager_id !== managerEmployeeId) {
      return res.status(403).json({
        message: "You can only add KPIs to reviews you created",
      });
    }

    if (review.review_status !== "Draft") {
      return res.status(400).json({
        message: "Submitted reviews cannot be edited",
      });
    }

    const insertSql = `
      INSERT INTO performance_kpis (review_id, kpi_name, kpi_score, remarks)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [review_id, kpi_name, kpi_score, remarks || null],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Error adding KPI:", insertErr);
          return res.status(500).json({
            message: "Failed to add KPI",
            error: insertErr.sqlMessage,
          });
        }

        res.status(201).json({
          message: "KPI added successfully",
          kpiId: result.insertId,
        });
      },
    );
  });
};

// Helper shared by updateKpi/deleteKpi: loads the KPI + its parent review
const loadKpiWithReview = (kpiId, callback) => {
  const sql = `
    SELECT pk.*, pr.review_status, pr.manager_id
    FROM performance_kpis pk
    JOIN performance_reviews pr ON pk.review_id = pr.id
    WHERE pk.id = ?
  `;

  db.query(sql, [kpiId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

const updateKpi = (req, res) => {
  const { id } = req.params;
  const { kpi_name, kpi_score, remarks } = req.body;
  const { role, employee_id: managerEmployeeId } = req.user;

  if (kpi_score !== undefined && (kpi_score < 1 || kpi_score > 5)) {
    return res.status(400).json({
      message: "KPI score must be between 1 and 5",
    });
  }

  loadKpiWithReview(id, (err, kpi) => {
    if (err) {
      console.error("Error fetching KPI:", err);
      return res.status(500).json({
        message: "Failed to update KPI",
      });
    }

    if (!kpi) {
      return res.status(404).json({
        message: "KPI not found",
      });
    }

    if (role === "manager" && kpi.manager_id !== managerEmployeeId) {
      return res.status(403).json({
        message: "You can only edit KPIs on reviews you created",
      });
    }

    if (kpi.review_status !== "Draft") {
      return res.status(400).json({
        message: "Submitted reviews cannot be edited",
      });
    }

    const updateSql = `
      UPDATE performance_kpis
      SET
        kpi_name = COALESCE(?, kpi_name),
        kpi_score = COALESCE(?, kpi_score),
        remarks = COALESCE(?, remarks)
      WHERE id = ?
    `;

    db.query(updateSql, [kpi_name, kpi_score, remarks, id], (updateErr) => {
      if (updateErr) {
        console.error("Error updating KPI:", updateErr);
        return res.status(500).json({
          message: "Failed to update KPI",
        });
      }

      res.status(200).json({
        message: "KPI updated successfully",
      });
    });
  });
};

const deleteKpi = (req, res) => {
  const { id } = req.params;
  const { role, employee_id: managerEmployeeId } = req.user;

  loadKpiWithReview(id, (err, kpi) => {
    if (err) {
      console.error("Error fetching KPI:", err);
      return res.status(500).json({
        message: "Failed to delete KPI",
      });
    }

    if (!kpi) {
      return res.status(404).json({
        message: "KPI not found",
      });
    }

    if (role === "manager" && kpi.manager_id !== managerEmployeeId) {
      return res.status(403).json({
        message: "You can only delete KPIs on reviews you created",
      });
    }

    if (kpi.review_status !== "Draft") {
      return res.status(400).json({
        message: "Submitted reviews cannot be edited",
      });
    }

    db.query(`DELETE FROM performance_kpis WHERE id = ?`, [id], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting KPI:", deleteErr);
        return res.status(500).json({
          message: "Failed to delete KPI",
        });
      }

      res.status(200).json({
        message: "KPI deleted successfully",
      });
    });
  });
};

// Dashboard cards + chart data
const getDashboard = (req, res) => {
  const cardsSql = `
    SELECT
      COUNT(*) AS totalReviews,
      SUM(CASE WHEN review_status = 'Draft' THEN 1 ELSE 0 END) AS pendingReviews,
      SUM(CASE WHEN review_status IN ('Submitted', 'Completed') THEN 1 ELSE 0 END) AS completedReviews,
      ROUND(AVG(CASE WHEN overall_rating IS NOT NULL THEN overall_rating END), 2) AS averageRating
    FROM performance_reviews
  `;

  const departmentAvgSql = `
    SELECT e.department, ROUND(AVG(pr.overall_rating), 2) AS avg_rating
    FROM performance_reviews pr
    JOIN employees e ON pr.employee_id = e.id
    WHERE pr.overall_rating IS NOT NULL
    GROUP BY e.department
    ORDER BY avg_rating DESC
  `;

  const monthlyCompletedSql = `
    SELECT DATE_FORMAT(submitted_on, '%Y-%m') AS month, COUNT(*) AS count
    FROM performance_reviews
    WHERE review_status IN ('Submitted', 'Completed') AND submitted_on IS NOT NULL
    GROUP BY month
    ORDER BY month
  `;

  const ratingDistributionSql = `
    SELECT overall_rating AS rating, COUNT(*) AS count
    FROM performance_reviews
    WHERE overall_rating IS NOT NULL
    GROUP BY overall_rating
    ORDER BY overall_rating
  `;

  db.query(cardsSql, (err, cardResults) => {
    if (err) {
      console.error("Error fetching dashboard cards:", err);
      return res.status(500).json({
        message: "Failed to fetch performance dashboard",
      });
    }

    db.query(departmentAvgSql, (deptErr, departmentWiseAvgRating) => {
      if (deptErr) {
        console.error("Error fetching department averages:", deptErr);
        return res.status(500).json({
          message: "Failed to fetch performance dashboard",
        });
      }

      db.query(monthlyCompletedSql, (monthErr, monthlyCompletedReviews) => {
        if (monthErr) {
          console.error("Error fetching monthly completed reviews:", monthErr);
          return res.status(500).json({
            message: "Failed to fetch performance dashboard",
          });
        }

        db.query(ratingDistributionSql, (ratingErr, ratingDistribution) => {
          if (ratingErr) {
            console.error("Error fetching rating distribution:", ratingErr);
            return res.status(500).json({
              message: "Failed to fetch performance dashboard",
            });
          }

          res.status(200).json({
            cards: cardResults[0],
            departmentWiseAvgRating,
            monthlyCompletedReviews,
            ratingDistribution,
            topPerformingDepartments: departmentWiseAvgRating.slice(0, 5),
          });
        });
      });
    });
  });
};

module.exports = {
  createReview,
  updateReview,
  getReviews,
  getReviewById,
  addKpi,
  updateKpi,
  deleteKpi,
  getDashboard,
};
