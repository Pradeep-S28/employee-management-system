const db = require("../config/db");
const {
  getJobById,
  getCandidateById,
  convertCandidateToEmployee,
} = require("../services/recruitmentService");

const VALID_EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
];

const VALID_JOB_STATUSES = ["Open", "Closed"];

const VALID_CANDIDATE_STATUSES = [
  "Applied",
  "Shortlisted",
  "Interviewed",
  "Selected",
  "Rejected",
  "Hired",
];

const VALID_TASK_STATUSES = ["Pending", "Completed"];

const emailPattern = /\S+@\S+\.\S+/;

// ---------------------------------------------------------------------
// Job Openings: CRUD (Admin only)
// ---------------------------------------------------------------------

// POST /recruitment/jobs
const createJob = (req, res) => {
  const {
    job_title,
    department,
    location,
    employment_type,
    number_of_openings,
    status,
  } = req.body;

  if (!job_title || !department || !location) {
    return res.status(400).json({
      message: "Job title, department, and location are required",
    });
  }

  if (employment_type && !VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    return res.status(400).json({ message: "Invalid employment type" });
  }

  if (status && !VALID_JOB_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid job status" });
  }

  if (number_of_openings !== undefined && Number(number_of_openings) <= 0) {
    return res.status(400).json({
      message: "Number of openings must be at least 1",
    });
  }

  const sql = `
    INSERT INTO job_openings
    (job_title, department, location, employment_type, number_of_openings, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      job_title,
      department,
      location,
      employment_type || "Full-Time",
      number_of_openings || 1,
      status || "Open",
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating job opening:", err);
        return res.status(500).json({
          message: "Failed to create job opening",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Job opening created successfully",
        jobId: result.insertId,
      });
    },
  );
};

// GET /recruitment/jobs
const getJobs = (req, res) => {
  const { status, department, search } = req.query;

  let sql = `SELECT * FROM job_openings WHERE 1 = 1`;
  const values = [];

  if (status) {
    sql += ` AND status = ?`;
    values.push(status);
  }

  if (department) {
    sql += ` AND department = ?`;
    values.push(department);
  }

  if (search) {
    sql += ` AND (job_title LIKE ? OR location LIKE ?)`;
    const term = `%${search}%`;
    values.push(term, term);
  }

  sql += ` ORDER BY created_at DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching job openings:", err);
      return res.status(500).json({ message: "Failed to fetch job openings" });
    }

    res.status(200).json(results);
  });
};

// PUT /recruitment/jobs/:id
const updateJob = (req, res) => {
  const { id } = req.params;
  const {
    job_title,
    department,
    location,
    employment_type,
    number_of_openings,
    status,
  } = req.body;

  if (employment_type && !VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    return res.status(400).json({ message: "Invalid employment type" });
  }

  if (status && !VALID_JOB_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid job status" });
  }

  if (number_of_openings !== undefined && Number(number_of_openings) <= 0) {
    return res.status(400).json({
      message: "Number of openings must be at least 1",
    });
  }

  getJobById(id, (err, job) => {
    if (err) {
      console.error("Error fetching job opening:", err);
      return res.status(500).json({ message: "Failed to update job opening" });
    }

    if (!job) {
      return res.status(404).json({ message: "Job opening not found" });
    }

    const sql = `
      UPDATE job_openings
      SET
        job_title = COALESCE(?, job_title),
        department = COALESCE(?, department),
        location = COALESCE(?, location),
        employment_type = COALESCE(?, employment_type),
        number_of_openings = COALESCE(?, number_of_openings),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        job_title,
        department,
        location,
        employment_type,
        number_of_openings,
        status,
        id,
      ],
      (updateErr) => {
        if (updateErr) {
          console.error("Error updating job opening:", updateErr);
          return res.status(500).json({
            message: "Failed to update job opening",
          });
        }

        res.status(200).json({ message: "Job opening updated successfully" });
      },
    );
  });
};

// DELETE /recruitment/jobs/:id
const deleteJob = (req, res) => {
  const { id } = req.params;

  getJobById(id, (err, job) => {
    if (err) {
      console.error("Error fetching job opening:", err);
      return res.status(500).json({ message: "Failed to delete job opening" });
    }

    if (!job) {
      return res.status(404).json({ message: "Job opening not found" });
    }

    db.query(`DELETE FROM job_openings WHERE id = ?`, [id], (deleteErr) => {
      if (deleteErr) {
        if (deleteErr.code === "ER_ROW_IS_REFERENCED_2") {
          return res.status(400).json({
            message:
              "Cannot delete a job opening that already has candidate applications",
          });
        }

        console.error("Error deleting job opening:", deleteErr);
        return res.status(500).json({
          message: "Failed to delete job opening",
        });
      }

      res.status(200).json({ message: "Job opening deleted successfully" });
    });
  });
};

// ---------------------------------------------------------------------
// Candidates: CRUD (Admin only)
// ---------------------------------------------------------------------

// POST /recruitment/candidates
const createCandidate = (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    job_id,
    resume_path,
    application_status,
  } = req.body;

  if (!full_name || !email || !phone_number || !job_id) {
    return res.status(400).json({
      message: "Full name, email, phone number, and job are required",
    });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (
    application_status &&
    !VALID_CANDIDATE_STATUSES.includes(application_status)
  ) {
    return res.status(400).json({ message: "Invalid application status" });
  }

  getJobById(job_id, (err, job) => {
    if (err) {
      console.error("Error fetching job opening:", err);
      return res.status(500).json({ message: "Failed to create candidate" });
    }

    if (!job) {
      return res.status(404).json({ message: "Job opening not found" });
    }

    if (job.status === "Closed") {
      return res.status(400).json({
        message: "This job opening is closed and not accepting new applications",
      });
    }

    const sql = `
      INSERT INTO candidates
      (full_name, email, phone_number, job_id, resume_path, application_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        full_name,
        email,
        phone_number,
        job_id,
        resume_path || null,
        application_status || "Applied",
      ],
      (insertErr, result) => {
        if (insertErr) {
          if (insertErr.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "A candidate with this email has already applied",
            });
          }

          console.error("Error creating candidate:", insertErr);
          return res.status(500).json({
            message: "Failed to create candidate",
            error: insertErr.sqlMessage,
          });
        }

        res.status(201).json({
          message: "Candidate application created successfully",
          candidateId: result.insertId,
        });
      },
    );
  });
};

// GET /recruitment/candidates
const getCandidates = (req, res) => {
  const { status, job_id, search } = req.query;

  let sql = `
    SELECT c.*, j.job_title, j.department
    FROM candidates c
    JOIN job_openings j ON c.job_id = j.id
    WHERE 1 = 1
  `;
  const values = [];

  if (status) {
    sql += ` AND c.application_status = ?`;
    values.push(status);
  }

  if (job_id) {
    sql += ` AND c.job_id = ?`;
    values.push(job_id);
  }

  if (search) {
    sql += ` AND (c.full_name LIKE ? OR c.email LIKE ?)`;
    const term = `%${search}%`;
    values.push(term, term);
  }

  sql += ` ORDER BY c.applied_date DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching candidates:", err);
      return res.status(500).json({ message: "Failed to fetch candidates" });
    }

    res.status(200).json(results);
  });
};

// GET /recruitment/candidates/:id
const getCandidateByIdHandler = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT c.*, j.job_title, j.department
    FROM candidates c
    JOIN job_openings j ON c.job_id = j.id
    WHERE c.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching candidate:", err);
      return res.status(500).json({ message: "Failed to fetch candidate" });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(results[0]);
  });
};

// PUT /recruitment/candidates/:id
const updateCandidate = (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    email,
    phone_number,
    job_id,
    resume_path,
    application_status,
  } = req.body;

  if (email && !emailPattern.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (
    application_status &&
    !VALID_CANDIDATE_STATUSES.includes(application_status)
  ) {
    return res.status(400).json({ message: "Invalid application status" });
  }

  getCandidateById(id, (err, candidate) => {
    if (err) {
      console.error("Error fetching candidate:", err);
      return res.status(500).json({ message: "Failed to update candidate" });
    }

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const applyUpdate = () => {
      const sql = `
        UPDATE candidates
        SET
          full_name = COALESCE(?, full_name),
          email = COALESCE(?, email),
          phone_number = COALESCE(?, phone_number),
          job_id = COALESCE(?, job_id),
          resume_path = COALESCE(?, resume_path),
          application_status = COALESCE(?, application_status)
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          full_name,
          email,
          phone_number,
          job_id,
          resume_path,
          application_status,
          id,
        ],
        (updateErr) => {
          if (updateErr) {
            if (updateErr.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                message: "A candidate with this email already exists",
              });
            }

            console.error("Error updating candidate:", updateErr);
            return res.status(500).json({
              message: "Failed to update candidate",
            });
          }

          res.status(200).json({ message: "Candidate updated successfully" });
        },
      );
    };

    // Only convert to an employee the first time status becomes "Hired" —
    // resubmitting "Hired" on an already-hired candidate is a no-op here.
    if (
      application_status === "Hired" &&
      candidate.application_status !== "Hired"
    ) {
      getJobById(candidate.job_id, (jobErr, job) => {
        if (jobErr || !job) {
          console.error("Error fetching job for hiring:", jobErr);
          return res.status(500).json({
            message: "Failed to fetch job details for hiring",
          });
        }

        convertCandidateToEmployee(candidate, job, (convertErr) => {
          if (convertErr) {
            console.error("Error converting candidate to employee:", convertErr);
            return res.status(500).json({
              message: "Failed to create employee record for hired candidate",
            });
          }

          applyUpdate();
        });
      });
    } else {
      applyUpdate();
    }
  });
};

// ---------------------------------------------------------------------
// Onboarding Tasks
// ---------------------------------------------------------------------

// POST /onboarding/tasks (Admin only)
const createOnboardingTask = (req, res) => {
  const { employee_id, task_name, assigned_by, due_date } = req.body;

  if (!employee_id || !task_name || !due_date) {
    return res.status(400).json({
      message: "Employee, task name, and due date are required",
    });
  }

  const sql = `
    INSERT INTO onboarding_tasks
    (employee_id, task_name, assigned_by, due_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employee_id, task_name, assigned_by || req.user.username, due_date],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "This onboarding task has already been assigned to this employee",
          });
        }

        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(404).json({ message: "Employee not found" });
        }

        console.error("Error assigning onboarding task:", err);
        return res.status(500).json({
          message: "Failed to assign onboarding task",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Onboarding task assigned successfully",
        taskId: result.insertId,
      });
    },
  );
};

// GET /onboarding/tasks (Admin: all, optionally filtered; Employee/Manager: own tasks only)
const getOnboardingTasks = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;
  const { employee_id, status } = req.query;

  let sql = `
    SELECT ot.*, e.full_name AS employee_name, e.department
    FROM onboarding_tasks ot
    JOIN employees e ON ot.employee_id = e.id
    WHERE 1 = 1
  `;
  const values = [];

  if (role === "admin") {
    if (employee_id) {
      sql += ` AND ot.employee_id = ?`;
      values.push(employee_id);
    }
  } else {
    if (!userEmployeeId) {
      return res.status(403).json({
        message: "No linked employee record found for this account",
      });
    }

    sql += ` AND ot.employee_id = ?`;
    values.push(userEmployeeId);
  }

  if (status) {
    sql += ` AND ot.status = ?`;
    values.push(status);
  }

  sql += ` ORDER BY ot.due_date ASC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching onboarding tasks:", err);
      return res.status(500).json({
        message: "Failed to fetch onboarding tasks",
      });
    }

    res.status(200).json(results);
  });
};

// PUT /onboarding/tasks/:id (Admin: full edit; Employee: mark own task as Completed)
const updateOnboardingTask = (req, res) => {
  const { id } = req.params;
  const { role, employee_id: userEmployeeId } = req.user;
  const { task_name, assigned_by, due_date, status } = req.body;

  if (status && !VALID_TASK_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid task status" });
  }

  db.query(`SELECT * FROM onboarding_tasks WHERE id = ?`, [id], (err, results) => {
    if (err) {
      console.error("Error fetching onboarding task:", err);
      return res.status(500).json({
        message: "Failed to update onboarding task",
      });
    }

    if (!results.length) {
      return res.status(404).json({ message: "Onboarding task not found" });
    }

    const task = results[0];

    if (role !== "admin") {
      if (task.employee_id !== userEmployeeId) {
        return res.status(403).json({
          message: "You can only update your own onboarding tasks",
        });
      }

      // Non-admins may only toggle the completion status of their own task
      return db.query(
        `UPDATE onboarding_tasks SET status = ? WHERE id = ?`,
        [status || task.status, id],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating onboarding task:", updateErr);
            return res.status(500).json({
              message: "Failed to update onboarding task",
            });
          }

          res.status(200).json({
            message: "Onboarding task updated successfully",
          });
        },
      );
    }

    const sql = `
      UPDATE onboarding_tasks
      SET
        task_name = COALESCE(?, task_name),
        assigned_by = COALESCE(?, assigned_by),
        due_date = COALESCE(?, due_date),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    db.query(
      sql,
      [task_name, assigned_by, due_date, status, id],
      (updateErr) => {
        if (updateErr) {
          if (updateErr.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "This onboarding task has already been assigned to this employee",
            });
          }

          console.error("Error updating onboarding task:", updateErr);
          return res.status(500).json({
            message: "Failed to update onboarding task",
          });
        }

        res.status(200).json({
          message: "Onboarding task updated successfully",
        });
      },
    );
  });
};

// ---------------------------------------------------------------------
// Dashboard (Admin only)
// ---------------------------------------------------------------------

// GET /recruitment/dashboard
const getDashboard = (req, res) => {
  const cardsSql = `
    SELECT
      (SELECT COUNT(*) FROM job_openings) AS totalJobOpenings,
      (SELECT COUNT(*) FROM candidates) AS totalCandidates,
      (SELECT COUNT(*) FROM candidates WHERE application_status = 'Shortlisted') AS candidatesShortlisted,
      (SELECT COUNT(*) FROM candidates WHERE application_status = 'Hired') AS candidatesHired,
      (SELECT COUNT(*) FROM onboarding_tasks WHERE status = 'Pending') AS pendingOnboardingTasks
  `;

  const applicationsByDepartmentSql = `
    SELECT j.department AS department, COUNT(*) AS count
    FROM candidates c
    JOIN job_openings j ON c.job_id = j.id
    GROUP BY j.department
    ORDER BY count DESC
  `;

  const statusDistributionSql = `
    SELECT application_status AS status, COUNT(*) AS count
    FROM candidates
    GROUP BY application_status
  `;

  const monthlyHiringTrendSql = `
    SELECT DATE_FORMAT(hired_at, '%Y-%m') AS month, COUNT(*) AS count
    FROM candidates
    WHERE application_status = 'Hired' AND hired_at IS NOT NULL
    GROUP BY month
    ORDER BY month
  `;

  const onboardingCompletionSql = `
    SELECT
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending
    FROM onboarding_tasks
  `;

  db.query(cardsSql, (err, cardResults) => {
    if (err) {
      console.error("Error fetching recruitment dashboard cards:", err);
      return res.status(500).json({
        message: "Failed to fetch recruitment dashboard",
      });
    }

    db.query(applicationsByDepartmentSql, (deptErr, applicationsByDepartment) => {
      if (deptErr) {
        console.error("Error fetching applications by department:", deptErr);
        return res.status(500).json({
          message: "Failed to fetch recruitment dashboard",
        });
      }

      db.query(statusDistributionSql, (statusErr, candidateStatusDistribution) => {
        if (statusErr) {
          console.error("Error fetching status distribution:", statusErr);
          return res.status(500).json({
            message: "Failed to fetch recruitment dashboard",
          });
        }

        db.query(monthlyHiringTrendSql, (monthErr, monthlyHiringTrend) => {
          if (monthErr) {
            console.error("Error fetching monthly hiring trend:", monthErr);
            return res.status(500).json({
              message: "Failed to fetch recruitment dashboard",
            });
          }

          db.query(onboardingCompletionSql, (onboardErr, onboardResults) => {
            if (onboardErr) {
              console.error("Error fetching onboarding completion:", onboardErr);
              return res.status(500).json({
                message: "Failed to fetch recruitment dashboard",
              });
            }

            const completed = Number(onboardResults[0]?.completed || 0);
            const pending = Number(onboardResults[0]?.pending || 0);
            const total = completed + pending;

            res.status(200).json({
              cards: {
                ...cardResults[0],
                onboardingCompletionPercentage:
                  total > 0 ? Math.round((completed / total) * 100) : 0,
              },
              applicationsByDepartment,
              candidateStatusDistribution,
              monthlyHiringTrend,
              onboardingCompletion: [
                { status: "Completed", count: completed },
                { status: "Pending", count: pending },
              ],
            });
          });
        });
      });
    });
  });
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  createCandidate,
  getCandidates,
  getCandidateById: getCandidateByIdHandler,
  updateCandidate,
  createOnboardingTask,
  getOnboardingTasks,
  updateOnboardingTask,
  getDashboard,
};
