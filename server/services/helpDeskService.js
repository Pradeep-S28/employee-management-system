const db = require("../config/db");

// Fetch a single service request row by id (no joins)
const getRequestById = (requestId, callback) => {
  const sql = `SELECT * FROM service_requests WHERE id = ?`;

  db.query(sql, [requestId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

// True if this user is allowed to view/comment on the given request:
// employees -> only their own, managers -> their team, admins -> all
const canAccessRequest = (request, user, callback) => {
  if (user.role === "admin") {
    return callback(null, true);
  }

  if (user.role === "employee") {
    return callback(null, request.employee_id === user.employee_id);
  }

  if (user.role === "manager") {
    const sql = `SELECT id FROM employees WHERE id = ? AND manager_id = ?`;

    db.query(sql, [request.employee_id, user.employee_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });

    return;
  }

  callback(null, false);
};

// True if the same employee already has an open (not Resolved/Closed)
// request with the same subject
const hasDuplicateOpenRequest = (employeeId, subject, callback) => {
  const sql = `
    SELECT id FROM service_requests
    WHERE employee_id = ? AND subject = ? AND status NOT IN ('Resolved', 'Closed')
    LIMIT 1
  `;

  db.query(sql, [employeeId, subject], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

module.exports = {
  getRequestById,
  canAccessRequest,
  hasDuplicateOpenRequest,
};
