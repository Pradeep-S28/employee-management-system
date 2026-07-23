const db = require("../config/db");

// Fetch a single job opening by id
const getJobById = (jobId, callback) => {
  const sql = `SELECT * FROM job_openings WHERE id = ?`;

  db.query(sql, [jobId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

// Fetch a single candidate by id
const getCandidateById = (candidateId, callback) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;

  db.query(sql, [candidateId], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length ? results[0] : null);
  });
};

// Converts a hired candidate into an employee record (Task 12 requirement)
// and links the new employee back to the candidate row, so re-submitting
// "Hired" never creates a second employee for the same candidate.
const convertCandidateToEmployee = (candidate, job, callback) => {
  const insertSql = `
    INSERT INTO employees
    (full_name, email, department, designation, date_of_joining, status)
    VALUES (?, ?, ?, ?, CURDATE(), 'Active')
  `;

  db.query(
    insertSql,
    [candidate.full_name, candidate.email, job.department, job.job_title],
    (err, result) => {
      if (err) return callback(err);

      const linkSql = `
        UPDATE candidates
        SET employee_id = ?, hired_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.query(linkSql, [result.insertId, candidate.id], (linkErr) => {
        if (linkErr) return callback(linkErr);
        callback(null, result.insertId);
      });
    },
  );
};

module.exports = {
  getJobById,
  getCandidateById,
  convertCandidateToEmployee,
};
