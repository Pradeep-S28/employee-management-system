const db = require("../config/db");
const {
  getRequestById,
  canAccessRequest,
  hasDuplicateOpenRequest,
} = require("../services/helpDeskService");

const VALID_CATEGORIES = ["HR", "IT", "Payroll", "Administration"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];
const VALID_STATUSES = ["Open", "Assigned", "In Progress", "Resolved", "Closed"];

// ---------------------------------------------------------------------
// POST /helpdesk/request
// Any logged-in user with a linked employee record can raise a request
// for themselves (Employee, Manager, or Admin).
// ---------------------------------------------------------------------
const createRequest = (req, res) => {
  const employeeId = req.user.employee_id;
  const { category, subject, description, priority } = req.body;

  if (!employeeId) {
    return res.status(400).json({
      message: "This account is not linked with an employee record",
    });
  }

  if (!subject || !subject.trim() || !description || !description.trim()) {
    return res.status(400).json({
      message: "Subject and description are required",
    });
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  const finalPriority = priority || "Medium";

  if (!VALID_PRIORITIES.includes(finalPriority)) {
    return res.status(400).json({
      message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
  }

  hasDuplicateOpenRequest(employeeId, subject.trim(), (dupErr, isDuplicate) => {
    if (dupErr) {
      console.error("Error checking duplicate request:", dupErr);
      return res.status(500).json({
        message: "Failed to submit service request",
      });
    }

    if (isDuplicate) {
      return res.status(400).json({
        message:
          "You already have an open request with the same subject. Please check your existing requests.",
      });
    }

    const sql = `
      INSERT INTO service_requests
      (employee_id, category, subject, description, priority, status)
      VALUES (?, ?, ?, ?, ?, 'Open')
    `;

    db.query(
      sql,
      [employeeId, category, subject.trim(), description.trim(), finalPriority],
      (err, result) => {
        if (err) {
          console.error("Error creating service request:", err);
          return res.status(500).json({
            message: "Failed to submit service request",
          });
        }

        res.status(201).json({
          message: "Service request submitted successfully",
          requestId: result.insertId,
        });
      },
    );
  });
};

// ---------------------------------------------------------------------
// GET /helpdesk/requests (role-based)
// Admin: all requests, filterable by category, priority, status, employee
// Manager: requests raised by their team
// Employee: only their own requests
// ---------------------------------------------------------------------
const getRequests = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;
  const { category, priority, status, employee_id } = req.query;

  let sql = `
    SELECT
      sr.id,
      sr.employee_id,
      e.full_name AS employee_name,
      e.department,
      sr.category,
      sr.subject,
      sr.description,
      sr.priority,
      sr.status,
      sr.assigned_to,
      sr.created_at,
      sr.updated_at,
      sr.resolved_at
    FROM service_requests sr
    JOIN employees e ON sr.employee_id = e.id
    WHERE 1 = 1
  `;

  const values = [];

  if (role === "employee") {
    sql += ` AND sr.employee_id = ?`;
    values.push(userEmployeeId);
  } else if (role === "manager") {
    sql += ` AND e.manager_id = ?`;
    values.push(userEmployeeId);
  } else if (role === "admin" && employee_id) {
    sql += ` AND sr.employee_id = ?`;
    values.push(employee_id);
  }

  if (category) {
    sql += ` AND sr.category = ?`;
    values.push(category);
  }

  if (priority) {
    sql += ` AND sr.priority = ?`;
    values.push(priority);
  }

  if (status) {
    sql += ` AND sr.status = ?`;
    values.push(status);
  }

  sql += ` ORDER BY sr.created_at DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching service requests:", err);
      return res.status(500).json({
        message: "Failed to fetch service requests",
      });
    }

    res.status(200).json(results);
  });
};

// ---------------------------------------------------------------------
// GET /helpdesk/request/:id (role-based access check)
// ---------------------------------------------------------------------
const getRequestByIdHandler = (req, res) => {
  const { id } = req.params;

  getRequestById(id, (err, request) => {
    if (err) {
      console.error("Error fetching service request:", err);
      return res.status(500).json({
        message: "Failed to fetch service request",
      });
    }

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    canAccessRequest(request, req.user, (accessErr, allowed) => {
      if (accessErr) {
        console.error("Error checking request access:", accessErr);
        return res.status(500).json({
          message: "Failed to fetch service request",
        });
      }

      if (!allowed) {
        return res.status(403).json({
          message: "Access denied. You cannot view this request.",
        });
      }

      db.query(
        `
        SELECT rc.id, rc.request_id, rc.user_id, u.username, u.role, rc.comment, rc.commented_on
        FROM request_comments rc
        JOIN users u ON rc.user_id = u.id
        WHERE rc.request_id = ?
        ORDER BY rc.commented_on ASC
        `,
        [id],
        (commentErr, comments) => {
          if (commentErr) {
            console.error("Error fetching comments:", commentErr);
            return res.status(500).json({
              message: "Failed to fetch service request",
            });
          }

          res.status(200).json({
            ...request,
            comments,
          });
        },
      );
    });
  });
};

// ---------------------------------------------------------------------
// PUT /helpdesk/request/:id (Admin only)
// Updates ticket details: category, subject, description, priority.
// Closed tickets cannot be edited.
// ---------------------------------------------------------------------
const updateRequest = (req, res) => {
  const { id } = req.params;
  const { category, subject, description, priority } = req.body;

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
    });
  }

  if (subject !== undefined && !subject.trim()) {
    return res.status(400).json({
      message: "Subject cannot be empty",
    });
  }

  if (description !== undefined && !description.trim()) {
    return res.status(400).json({
      message: "Description cannot be empty",
    });
  }

  getRequestById(id, (err, request) => {
    if (err) {
      console.error("Error fetching service request:", err);
      return res.status(500).json({
        message: "Failed to update service request",
      });
    }

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    if (request.status === "Closed") {
      return res.status(400).json({
        message: "Closed tickets cannot be edited",
      });
    }

    const sql = `
      UPDATE service_requests
      SET
        category = COALESCE(?, category),
        subject = COALESCE(?, subject),
        description = COALESCE(?, description),
        priority = COALESCE(?, priority)
      WHERE id = ?
    `;

    db.query(
      sql,
      [category, subject, description, priority, id],
      (updateErr) => {
        if (updateErr) {
          console.error("Error updating service request:", updateErr);
          return res.status(500).json({
            message: "Failed to update service request",
          });
        }

        res.status(200).json({
          message: "Service request updated successfully",
        });
      },
    );
  });
};

// ---------------------------------------------------------------------
// POST /helpdesk/request/:id/comment (role-based access check)
// ---------------------------------------------------------------------
const addComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({
      message: "Comment text is required",
    });
  }

  getRequestById(id, (err, request) => {
    if (err) {
      console.error("Error fetching service request:", err);
      return res.status(500).json({
        message: "Failed to add comment",
      });
    }

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    canAccessRequest(request, req.user, (accessErr, allowed) => {
      if (accessErr) {
        console.error("Error checking request access:", accessErr);
        return res.status(500).json({
          message: "Failed to add comment",
        });
      }

      if (!allowed) {
        return res.status(403).json({
          message: "Access denied. You cannot comment on this request.",
        });
      }

      const sql = `
        INSERT INTO request_comments (request_id, user_id, comment)
        VALUES (?, ?, ?)
      `;

      db.query(sql, [id, req.user.id, comment.trim()], (insertErr, result) => {
        if (insertErr) {
          console.error("Error adding comment:", insertErr);
          return res.status(500).json({
            message: "Failed to add comment",
          });
        }

        res.status(201).json({
          message: "Comment added successfully",
          commentId: result.insertId,
        });
      });
    });
  });
};

// ---------------------------------------------------------------------
// PUT /helpdesk/request/:id/status (Admin only)
// Updates status and/or assignee. Closed tickets cannot be edited further.
// ---------------------------------------------------------------------
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  getRequestById(id, (err, request) => {
    if (err) {
      console.error("Error fetching service request:", err);
      return res.status(500).json({
        message: "Failed to update ticket status",
      });
    }

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    if (request.status === "Closed") {
      return res.status(400).json({
        message: "Closed tickets cannot be edited",
      });
    }

    const finalStatus = status || request.status;
    const resolvedAt =
      finalStatus === "Resolved" || finalStatus === "Closed"
        ? new Date()
        : null;

    const sql = `
      UPDATE service_requests
      SET
        status = ?,
        assigned_to = COALESCE(?, assigned_to),
        resolved_at = COALESCE(?, resolved_at)
      WHERE id = ?
    `;

    db.query(sql, [finalStatus, assigned_to, resolvedAt, id], (updateErr) => {
      if (updateErr) {
        console.error("Error updating ticket status:", updateErr);
        return res.status(500).json({
          message: "Failed to update ticket status",
        });
      }

      res.status(200).json({
        message: "Ticket status updated successfully",
      });
    });
  });
};

// ---------------------------------------------------------------------
// GET /helpdesk/dashboard (Admin only)
// ---------------------------------------------------------------------
const getDashboard = (req, res) => {
  const cardsSql = `
    SELECT
      COUNT(*) AS totalRequests,
      SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS openRequests,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS inProgressRequests,
      SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolvedRequests,
      SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closedRequests
    FROM service_requests
  `;

  const categorySql = `
    SELECT category, COUNT(*) AS count
    FROM service_requests
    GROUP BY category
    ORDER BY count DESC
  `;

  const prioritySql = `
    SELECT priority, COUNT(*) AS count
    FROM service_requests
    GROUP BY priority
  `;

  const monthlyTrendSql = `
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
    FROM service_requests
    GROUP BY month
    ORDER BY month
  `;

  const avgResolutionSql = `
    SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) AS avgResolutionHours
    FROM service_requests
    WHERE resolved_at IS NOT NULL
  `;

  db.query(cardsSql, (err, cardResults) => {
    if (err) {
      console.error("Error fetching helpdesk dashboard cards:", err);
      return res.status(500).json({
        message: "Failed to fetch helpdesk dashboard",
      });
    }

    db.query(categorySql, (catErr, categoryDistribution) => {
      if (catErr) {
        console.error("Error fetching category distribution:", catErr);
        return res.status(500).json({
          message: "Failed to fetch helpdesk dashboard",
        });
      }

      db.query(prioritySql, (prioErr, priorityDistribution) => {
        if (prioErr) {
          console.error("Error fetching priority distribution:", prioErr);
          return res.status(500).json({
            message: "Failed to fetch helpdesk dashboard",
          });
        }

        db.query(monthlyTrendSql, (monthErr, monthlyTrend) => {
          if (monthErr) {
            console.error("Error fetching monthly trend:", monthErr);
            return res.status(500).json({
              message: "Failed to fetch helpdesk dashboard",
            });
          }

          db.query(avgResolutionSql, (avgErr, avgResults) => {
            if (avgErr) {
              console.error("Error fetching average resolution time:", avgErr);
              return res.status(500).json({
                message: "Failed to fetch helpdesk dashboard",
              });
            }

            const avgHours = avgResults[0].avgResolutionHours;

            res.status(200).json({
              cards: {
                ...cardResults[0],
                avgResolutionHours: avgHours ? Number(avgHours).toFixed(1) : 0,
              },
              categoryDistribution,
              priorityDistribution,
              monthlyTrend,
            });
          });
        });
      });
    });
  });
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById: getRequestByIdHandler,
  updateRequest,
  addComment,
  updateStatus,
  getDashboard,
};
