const db = require("../config/db");

// True if `employeeId` reports to `managerEmployeeId` (i.e. is in that
// manager's team). Used to scope managers to their own team's training data.
const isEmployeeInManagerTeam = (managerEmployeeId, employeeId, callback) => {
  const sql = `
    SELECT id FROM employees
    WHERE id = ? AND manager_id = ?
  `;

  db.query(sql, [employeeId, managerEmployeeId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

// Blocks duplicate training assignments for the same employee + program.
const assignmentExists = (employeeId, trainingId, callback) => {
  const sql = `
    SELECT id FROM employee_training
    WHERE employee_id = ? AND training_id = ?
  `;

  db.query(sql, [employeeId, trainingId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

// Latest assessment attempt for an employee + training program, used to
// decide whether a certification can be issued.
const getLatestAssessment = (employeeId, trainingId, callback) => {
  const sql = `
    SELECT * FROM assessments
    WHERE employee_id = ? AND training_id = ?
    ORDER BY attempt_date DESC
    LIMIT 1
  `;

  db.query(sql, [employeeId, trainingId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

const certificationExists = (employeeId, trainingId, callback) => {
  const sql = `
    SELECT id FROM certifications
    WHERE employee_id = ? AND training_id = ?
  `;

  db.query(sql, [employeeId, trainingId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

// Simple, human-readable certificate number: unique enough for this
// application's scale and easy to trace back to the training + employee.
const generateCertificateNumber = (trainingId, employeeId) => {
  return `CERT-TRN${trainingId}-EMP${employeeId}-${Date.now()}`;
};

module.exports = {
  isEmployeeInManagerTeam,
  assignmentExists,
  getLatestAssessment,
  certificationExists,
  generateCertificateNumber,
};
