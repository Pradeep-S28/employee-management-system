const db = require("../config/db");
const {
  isEmployeeInManagerTeam,
  assignmentExists,
  getLatestAssessment,
  certificationExists,
  generateCertificateNumber,
} = require("../services/trainingService");

// Minimum score out of 100 required to pass an assessment
const PASS_MARK = 40;

// ---------- Training Programs (Admin manages, everyone can view) ----------

const createProgram = (req, res) => {
  const {
    training_title,
    description,
    category,
    duration_hours,
    trainer_name,
    start_date,
    end_date,
    status,
  } = req.body;

  if (
    !training_title ||
    !category ||
    !duration_hours ||
    !trainer_name ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({
      message:
        "Training title, category, duration, trainer, start date, and end date are required",
    });
  }

  if (Number(duration_hours) <= 0) {
    return res.status(400).json({
      message: "Duration must be greater than 0 hours",
    });
  }

  if (new Date(end_date) <= new Date(start_date)) {
    return res.status(400).json({
      message: "End date must be later than the start date",
    });
  }

  const sql = `
    INSERT INTO training_programs
    (training_title, description, category, duration_hours, trainer_name, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      training_title,
      description || null,
      category,
      duration_hours,
      trainer_name,
      start_date,
      end_date,
      status || "Upcoming",
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating training program:", err);
        return res.status(500).json({
          message: "Failed to create training program",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Training program created successfully",
        trainingId: result.insertId,
      });
    },
  );
};

const getPrograms = (req, res) => {
  const { search, status, category } = req.query;

  let sql = `SELECT * FROM training_programs WHERE 1 = 1`;
  const values = [];

  if (search) {
    sql += ` AND training_title LIKE ?`;
    values.push(`%${search}%`);
  }

  if (status) {
    sql += ` AND status = ?`;
    values.push(status);
  }

  if (category) {
    sql += ` AND category = ?`;
    values.push(category);
  }

  sql += ` ORDER BY start_date DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching training programs:", err);
      return res.status(500).json({
        message: "Failed to fetch training programs",
      });
    }

    res.status(200).json(results);
  });
};

const updateProgram = (req, res) => {
  const { id } = req.params;
  const {
    training_title,
    description,
    category,
    duration_hours,
    trainer_name,
    start_date,
    end_date,
    status,
  } = req.body;

  if (duration_hours !== undefined && Number(duration_hours) <= 0) {
    return res.status(400).json({
      message: "Duration must be greater than 0 hours",
    });
  }

  const sql = `SELECT * FROM training_programs WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching training program:", err);
      return res.status(500).json({
        message: "Failed to update training program",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Training program not found",
      });
    }

    const program = results[0];
    const nextStart = start_date || program.start_date;
    const nextEnd = end_date || program.end_date;

    if (new Date(nextEnd) <= new Date(nextStart)) {
      return res.status(400).json({
        message: "End date must be later than the start date",
      });
    }

    const updateSql = `
      UPDATE training_programs
      SET
        training_title = COALESCE(?, training_title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        duration_hours = COALESCE(?, duration_hours),
        trainer_name = COALESCE(?, trainer_name),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    db.query(
      updateSql,
      [
        training_title,
        description,
        category,
        duration_hours,
        trainer_name,
        start_date,
        end_date,
        status,
        id,
      ],
      (updateErr) => {
        if (updateErr) {
          console.error("Error updating training program:", updateErr);
          return res.status(500).json({
            message: "Failed to update training program",
          });
        }

        res.status(200).json({
          message: "Training program updated successfully",
        });
      },
    );
  });
};

const deleteProgram = (req, res) => {
  const { id } = req.params;

  // ON DELETE CASCADE also removes related assignments, assessments,
  // and certifications for this training program.
  db.query(
    `DELETE FROM training_programs WHERE id = ?`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting training program:", err);
        return res.status(500).json({
          message: "Failed to delete training program",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Training program not found",
        });
      }

      res.status(200).json({
        message: "Training program deleted successfully",
      });
    },
  );
};

// ---------- Training Assignment ----------

const assignTraining = (req, res) => {
  const { employee_id, training_id } = req.body;

  if (!employee_id || !training_id) {
    return res.status(400).json({
      message: "Employee and training program are required",
    });
  }

  assignmentExists(employee_id, training_id, (err, exists) => {
    if (err) {
      console.error("Error checking existing training assignment:", err);
      return res.status(500).json({
        message: "Failed to assign training",
      });
    }

    if (exists) {
      return res.status(400).json({
        message: "This employee is already assigned to this training program",
      });
    }

    const sql = `
      INSERT INTO employee_training (employee_id, training_id)
      VALUES (?, ?)
    `;

    db.query(sql, [employee_id, training_id], (insertErr, result) => {
      if (insertErr) {
        console.error("Error assigning training:", insertErr);
        return res.status(500).json({
          message: "Failed to assign training",
          error: insertErr.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Training assigned successfully",
        assignmentId: result.insertId,
      });
    });
  });
};

const getAssignments = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;

  let sql = `
    SELECT
      et.id,
      et.employee_id,
      e.full_name AS employee_name,
      e.department,
      et.training_id,
      tp.training_title,
      tp.category,
      et.progress_percentage,
      et.completion_status,
      et.completion_date,
      et.created_at
    FROM employee_training et
    JOIN employees e ON et.employee_id = e.id
    JOIN training_programs tp ON et.training_id = tp.id
  `;

  const values = [];

  if (role === "manager") {
    sql += ` WHERE e.manager_id = ?`;
    values.push(userEmployeeId);
  } else if (role === "employee") {
    sql += ` WHERE et.employee_id = ?`;
    values.push(userEmployeeId);
  }

  sql += ` ORDER BY et.created_at DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching training assignments:", err);
      return res.status(500).json({
        message: "Failed to fetch training assignments",
      });
    }

    res.status(200).json(results);
  });
};

// ---------- Progress Tracking ----------

const updateProgress = (req, res) => {
  const { id } = req.params;
  const { progress_percentage } = req.body;
  const { role, employee_id: userEmployeeId } = req.user;

  if (progress_percentage === undefined || progress_percentage === null) {
    return res.status(400).json({
      message: "Progress percentage is required",
    });
  }

  if (progress_percentage < 0 || progress_percentage > 100) {
    return res.status(400).json({
      message: "Progress percentage must be between 0 and 100",
    });
  }

  const sql = `SELECT * FROM employee_training WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching training assignment:", err);
      return res.status(500).json({
        message: "Failed to update training progress",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Training assignment not found",
      });
    }

    const assignment = results[0];

    if (role === "employee" && assignment.employee_id !== userEmployeeId) {
      return res.status(403).json({
        message: "You can only update your own training progress",
      });
    }

    let completionStatus = "In Progress";
    let completionDate = null;

    if (Number(progress_percentage) === 0) {
      completionStatus = "Not Started";
    } else if (Number(progress_percentage) === 100) {
      completionStatus = "Completed";
      completionDate = new Date().toISOString().slice(0, 10);
    }

    const updateSql = `
      UPDATE employee_training
      SET progress_percentage = ?, completion_status = ?, completion_date = ?
      WHERE id = ?
    `;

    db.query(
      updateSql,
      [progress_percentage, completionStatus, completionDate, id],
      (updateErr) => {
        if (updateErr) {
          console.error("Error updating training progress:", updateErr);
          return res.status(500).json({
            message: "Failed to update training progress",
          });
        }

        res.status(200).json({
          message: "Training progress updated successfully",
        });
      },
    );
  });
};

// ---------- Assessments ----------

const recordAssessment = (req, res) => {
  const { employee_id, training_id, score } = req.body;

  if (!employee_id || !training_id || score === undefined || score === null) {
    return res.status(400).json({
      message: "Employee, training program, and score are required",
    });
  }

  if (score < 0 || score > 100) {
    return res.status(400).json({
      message: "Score must be between 0 and 100",
    });
  }

  const result = score >= PASS_MARK ? "Pass" : "Fail";

  const sql = `
    INSERT INTO assessments (training_id, employee_id, score, result)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [training_id, employee_id, score, result],
    (err, insertResult) => {
      if (err) {
        console.error("Error recording assessment:", err);
        return res.status(500).json({
          message: "Failed to record assessment result",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: `Assessment recorded successfully (${result})`,
        assessmentId: insertResult.insertId,
      });
    },
  );
};

const getAssessmentsByEmployee = (req, res) => {
  const { employeeId } = req.params;
  const { role, employee_id: userEmployeeId } = req.user;

  const proceed = () => {
    const sql = `
      SELECT
        a.id,
        a.employee_id,
        e.full_name AS employee_name,
        a.training_id,
        tp.training_title,
        a.score,
        a.result,
        a.attempt_date
      FROM assessments a
      JOIN employees e ON a.employee_id = e.id
      JOIN training_programs tp ON a.training_id = tp.id
      WHERE a.employee_id = ?
      ORDER BY a.attempt_date DESC
    `;

    db.query(sql, [employeeId], (err, results) => {
      if (err) {
        console.error("Error fetching assessment results:", err);
        return res.status(500).json({
          message: "Failed to fetch assessment results",
        });
      }

      res.status(200).json(results);
    });
  };

  if (role === "employee") {
    if (Number(employeeId) !== Number(userEmployeeId)) {
      return res.status(403).json({
        message: "You can only view your own assessment results",
      });
    }
    return proceed();
  }

  if (role === "manager") {
    return isEmployeeInManagerTeam(
      userEmployeeId,
      employeeId,
      (err, inTeam) => {
        if (err) {
          console.error("Error verifying manager team:", err);
          return res.status(500).json({
            message: "Failed to fetch assessment results",
          });
        }

        if (!inTeam) {
          return res.status(403).json({
            message: "You can only view assessment results for your own team",
          });
        }

        proceed();
      },
    );
  }

  proceed();
};

// ---------- Certifications ----------

const createCertification = (req, res) => {
  const { employee_id, training_id, expiry_date } = req.body;

  if (!employee_id || !training_id) {
    return res.status(400).json({
      message: "Employee and training program are required",
    });
  }

  certificationExists(employee_id, training_id, (existsErr, exists) => {
    if (existsErr) {
      console.error("Error checking existing certification:", existsErr);
      return res.status(500).json({
        message: "Failed to generate certification",
      });
    }

    if (exists) {
      return res.status(400).json({
        message: "A certification has already been issued for this training",
      });
    }

    getLatestAssessment(employee_id, training_id, (assessErr, assessment) => {
      if (assessErr) {
        console.error("Error fetching assessment result:", assessErr);
        return res.status(500).json({
          message: "Failed to generate certification",
        });
      }

      if (!assessment || assessment.result !== "Pass") {
        return res.status(400).json({
          message:
            "Certification can only be generated after the employee passes the assessment",
        });
      }

      const certificateNumber = generateCertificateNumber(
        training_id,
        employee_id,
      );
      const issuedDate = new Date().toISOString().slice(0, 10);

      const sql = `
        INSERT INTO certifications
        (employee_id, training_id, certificate_number, issued_date, expiry_date)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          employee_id,
          training_id,
          certificateNumber,
          issuedDate,
          expiry_date || null,
        ],
        (insertErr, result) => {
          if (insertErr) {
            console.error("Error generating certification:", insertErr);
            return res.status(500).json({
              message: "Failed to generate certification",
              error: insertErr.sqlMessage,
            });
          }

          res.status(201).json({
            message: "Certification generated successfully",
            certificationId: result.insertId,
            certificateNumber,
          });
        },
      );
    });
  });
};

const getCertifications = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;

  let sql = `
    SELECT
      c.id,
      c.employee_id,
      e.full_name AS employee_name,
      e.department,
      c.training_id,
      tp.training_title,
      c.certificate_number,
      c.issued_date,
      c.expiry_date
    FROM certifications c
    JOIN employees e ON c.employee_id = e.id
    JOIN training_programs tp ON c.training_id = tp.id
  `;

  const values = [];

  if (role === "manager") {
    sql += ` WHERE e.manager_id = ?`;
    values.push(userEmployeeId);
  } else if (role === "employee") {
    sql += ` WHERE c.employee_id = ?`;
    values.push(userEmployeeId);
  }

  sql += ` ORDER BY c.issued_date DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching certifications:", err);
      return res.status(500).json({
        message: "Failed to fetch certifications",
      });
    }

    res.status(200).json(results);
  });
};

// ---------- Dashboard ----------

const getDashboard = (req, res) => {
  const cardsSql = `
    SELECT
      (SELECT COUNT(*) FROM training_programs) AS totalPrograms,
      (SELECT COUNT(*) FROM training_programs WHERE status = 'Ongoing') AS activeTrainings,
      (SELECT COUNT(*) FROM training_programs WHERE status = 'Completed') AS completedTrainings,
      (SELECT COUNT(DISTINCT employee_id) FROM certifications) AS employeesCertified,
      (SELECT COUNT(*) FROM employee_training et
        WHERE et.completion_status = 'Completed'
        AND NOT EXISTS (
          SELECT 1 FROM assessments a
          WHERE a.employee_id = et.employee_id AND a.training_id = et.training_id
        )
      ) AS pendingAssessments
  `;

  const completionByDepartmentSql = `
    SELECT
      e.department,
      ROUND(
        100 * SUM(CASE WHEN et.completion_status = 'Completed' THEN 1 ELSE 0 END) / COUNT(*),
        2
      ) AS completion_rate
    FROM employee_training et
    JOIN employees e ON et.employee_id = e.id
    GROUP BY e.department
  `;

  const monthlyCertificationSql = `
    SELECT DATE_FORMAT(issued_date, '%Y-%m') AS month, COUNT(*) AS count
    FROM certifications
    GROUP BY month
    ORDER BY month
  `;

  const categoryDistributionSql = `
    SELECT category, COUNT(*) AS count
    FROM training_programs
    GROUP BY category
  `;

  const progressOverviewSql = `
    SELECT tp.training_title, ROUND(AVG(et.progress_percentage), 2) AS avg_progress
    FROM employee_training et
    JOIN training_programs tp ON et.training_id = tp.id
    GROUP BY tp.training_title
  `;

  db.query(cardsSql, (err, cardResults) => {
    if (err) {
      console.error("Error fetching training dashboard cards:", err);
      return res.status(500).json({
        message: "Failed to fetch training dashboard",
      });
    }

    db.query(completionByDepartmentSql, (deptErr, completionByDepartment) => {
      if (deptErr) {
        console.error("Error fetching department completion:", deptErr);
        return res.status(500).json({
          message: "Failed to fetch training dashboard",
        });
      }

      db.query(monthlyCertificationSql, (certErr, monthlyCertifications) => {
        if (certErr) {
          console.error("Error fetching monthly certifications:", certErr);
          return res.status(500).json({
            message: "Failed to fetch training dashboard",
          });
        }

        db.query(categoryDistributionSql, (catErr, categoryDistribution) => {
          if (catErr) {
            console.error("Error fetching category distribution:", catErr);
            return res.status(500).json({
              message: "Failed to fetch training dashboard",
            });
          }

          db.query(progressOverviewSql, (progErr, employeeProgressOverview) => {
            if (progErr) {
              console.error("Error fetching progress overview:", progErr);
              return res.status(500).json({
                message: "Failed to fetch training dashboard",
              });
            }

            res.status(200).json({
              cards: cardResults[0],
              completionByDepartment,
              monthlyCertifications,
              categoryDistribution,
              employeeProgressOverview,
            });
          });
        });
      });
    });
  });
};

module.exports = {
  createProgram,
  getPrograms,
  updateProgram,
  deleteProgram,
  assignTraining,
  getAssignments,
  updateProgress,
  recordAssessment,
  getAssessmentsByEmployee,
  createCertification,
  getCertifications,
  getDashboard,
};
