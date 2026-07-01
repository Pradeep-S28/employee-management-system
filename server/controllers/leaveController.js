const db = require("../config/db");

const createLeaveRequest = (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;
  const employeeId = req.user.employee_id;

  if (!employeeId) {
    return res.status(400).json({
      message: "Employee account is not linked with an employee record",
    });
  }

  if (!leave_type || !start_date || !end_date || !reason) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({
      message: "End date must be greater than or equal to start date",
    });
  }

  const sql = `
    INSERT INTO leave_requests
    (employee_id, leave_type, start_date, end_date, reason)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [employeeId, leave_type, start_date, end_date, reason],
    (error, result) => {
      if (error) {
        // console.log("Leave insert error:", error);

        // return res.status(500).json({
        //   message: "Failed to submit leave request",
        //   error: error.message,
        // });

        return res.status(500).json({
          message: "Failed to submit leave request",
        });
      }

      res.status(201).json({
        message: "Leave request submitted successfully",
        leaveId: result.insertId,
      });
    },
  );
};

const getLeaveRequests = (req, res) => {
  let sql = `
    SELECT 
      lr.id,
      lr.employee_id,
      e.full_name,
      e.department,
      lr.leave_type,
      lr.start_date,
      lr.end_date,
      lr.reason,
      lr.status,
      lr.requested_on
    FROM leave_requests lr
    JOIN employees e ON lr.employee_id = e.id
  `;

  const values = [];

  if (req.user.role !== "admin") {
    sql += " WHERE lr.employee_id = ?";
    values.push(req.user.employee_id);
  }

  sql += " ORDER BY lr.requested_on DESC";

  db.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch leave requests",
      });
    }

    res.status(200).json(result);
  });
};

const updateLeaveStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      message: "Status must be Approved or Rejected",
    });
  }

  const sql = `
    UPDATE leave_requests
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to update leave status",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      message: `Leave request ${status.toLowerCase()} successfully`,
    });
  });
};

const getLeaveSummary = (req, res) => {
  const statusSql = `
    SELECT status, COUNT(*) AS count
    FROM leave_requests
    GROUP BY status
  `;

  const typeSql = `
    SELECT leave_type, COUNT(*) AS count
    FROM leave_requests
    GROUP BY leave_type
  `;

  db.query(statusSql, (statusError, statusResult) => {
    if (statusError) {
      return res.status(500).json({
        message: "Failed to fetch leave status summary",
      });
    }

    db.query(typeSql, (typeError, typeResult) => {
      if (typeError) {
        return res.status(500).json({
          message: "Failed to fetch leave type summary",
        });
      }

      res.status(200).json({
        byStatus: statusResult,
        byType: typeResult,
      });
    });
  });
};

module.exports = {
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveStatus,
  getLeaveSummary,
};
