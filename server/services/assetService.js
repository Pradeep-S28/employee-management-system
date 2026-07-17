const db = require("../config/db");

// Fetch a single asset row by id
const getAssetById = (assetId, callback) => {
  const sql = `SELECT * FROM assets WHERE id = ?`;

  db.query(sql, [assetId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

// True if th asset currently has an active "Assigned" assignment
const hasActiveAssignment = (assetId, callback) => {
  const sql = `
    SELECT id FROM asset_assignments
    WHERE asset_id = ? AND assignment_status = 'Assigned'
    LIMIT 1
  `;

  db.query(sql, [assetId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

// Fetch a single assignment row,, joined with its asset for status checks
const getAssignmentWithAsset = (assignmentId, callback) => {
  const sql = `
    SELECT aa.*, a.asset_status
    FROM asset_assignments aa
    JOIN assets a ON aa.asset_id = a.id
    WHERE aa.id = ?
  `;

  db.query(sql, [assignmentId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

// Restricts an employee's own view to assets currently/previously assigned to them
const isAssignmentVisibleToEmployee = (assignment, employeeId) => {
  return assignment.employee_id === employeeId;
};

module.exports = {
  getAssetById,
  hasActiveAssignment,
  getAssignmentWithAsset,
  isAssignmentVisibleToEmployee,
};
