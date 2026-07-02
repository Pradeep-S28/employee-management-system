const db = require("../config/db");

// Employee submits self-appraisal
const submitPerformanceReview = (req, res) => {
  const { review_period, self_rating, self_comments } = req.body;
  const employee_id = req.user.employee_id;

  if (!employee_id) {
    return res.status(400).json({
      message: "Employee account is not linked with an employee record",
    });
  }

  if (!review_period || !self_rating || !self_comments) {
    return res.status(400).json({
      message: "Review period, self rating, and self comments are required",
    });
  }

  if (self_rating < 1 || self_rating > 5) {
    return res.status(400).json({
      message: "Self rating must be between 1 and 5",
    });
  }

  const sql = `
    INSERT INTO performance_reviews
    (employee_id, review_period, self_rating, self_comments, status)
    VALUES (?, ?, ?, ?, 'Submitted')
  `;

  db.query(
    sql,
    [employee_id, review_period, self_rating, self_comments],
    (err, result) => {
      if (err) {
        console.error(
          "Error submitting performance review:",
          err.sqlMessage || err,
        );
        return res.status(500).json({
          message: "Failed to submit performance review",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Self-appraisal submitted successfully",
        reviewId: result.insertId,
      });
    },
  );
};

// Employee views own reviews, Admin views all reviews
const getPerformanceReviews = (req, res) => {
  let sql = `
    SELECT 
      pr.id,
      pr.employee_id,
      e.full_name,
      e.department,
      e.designation,
      pr.review_period,
      pr.self_rating,
      pr.self_comments,
      pr.manager_rating,
      pr.manager_feedback,
      pr.status,
      pr.reviewed_on,
      pr.created_at
    FROM performance_reviews pr
    JOIN employees e ON pr.employee_id = e.id
  `;

  const values = [];

  if (req.user.role !== "admin") {
    sql += ` WHERE pr.employee_id = ?`;
    values.push(req.user.employee_id);
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

// Admin reviews and rates employee performance
const updatePerformanceReview = (req, res) => {
  const { id } = req.params;
  const { manager_rating, manager_feedback } = req.body;

  if (!manager_rating || !manager_feedback) {
    return res.status(400).json({
      message: "Manager rating and feedback are required",
    });
  }

  if (manager_rating < 1 || manager_rating > 5) {
    return res.status(400).json({
      message: "Manager rating must be between 1 and 5",
    });
  }

  const sql = `
    UPDATE performance_reviews
    SET 
      manager_rating = ?,
      manager_feedback = ?,
      status = 'Reviewed',
      reviewed_on = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(sql, [manager_rating, manager_feedback, id], (err, result) => {
    if (err) {
      console.error("Error updating performance review:", err);
      return res.status(500).json({
        message: "Failed to update performance review",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Performance review not found",
      });
    }

    res.status(200).json({
      message: "Performance review updated successfully",
    });
  });
};

// Dashboard summary for charts
const getPerformanceSummary = (req, res) => {
  const avgRatingByDepartmentSql = `
    SELECT 
      e.department,
      ROUND(AVG(pr.manager_rating), 2) AS avg_rating
    FROM performance_reviews pr
    JOIN employees e ON pr.employee_id = e.id
    WHERE pr.manager_rating IS NOT NULL
    GROUP BY e.department
  `;

  const ratingDistributionSql = `
    SELECT 
      manager_rating AS rating,
      COUNT(*) AS count
    FROM performance_reviews
    WHERE manager_rating IS NOT NULL
    GROUP BY manager_rating
    ORDER BY manager_rating
  `;

  const reviewTrendSql = `
    SELECT 
      review_period,
      ROUND(AVG(manager_rating), 2) AS avg_rating
    FROM performance_reviews
    WHERE manager_rating IS NOT NULL
    GROUP BY review_period
    ORDER BY review_period
  `;

  db.query(avgRatingByDepartmentSql, (err, avgRatingByDepartment) => {
    if (err) {
      console.error("Error fetching department rating summary:", err);
      return res.status(500).json({
        message: "Failed to fetch performance summary",
      });
    }

    db.query(ratingDistributionSql, (err, ratingDistribution) => {
      if (err) {
        console.error("Error fetching rating distribution:", err);
        return res.status(500).json({
          message: "Failed to fetch performance summary",
        });
      }

      db.query(reviewTrendSql, (err, reviewTrend) => {
        if (err) {
          console.error("Error fetching review trend:", err);
          return res.status(500).json({
            message: "Failed to fetch performance summary",
          });
        }

        res.status(200).json({
          avgRatingByDepartment,
          ratingDistribution,
          reviewTrend,
        });
      });
    });
  });
};

module.exports = {
  submitPerformanceReview,
  getPerformanceReviews,
  updatePerformanceReview,
  getPerformanceSummary,
};
