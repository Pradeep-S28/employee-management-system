const db = require("../config/db");

// True if `employeeId` reports to `managerEmployeeId` (i.e. is in that
// manager's team). Used to scope managers to their own team.
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

// Blocks duplicate reviews for the same employee + review period.
const reviewExistsForPeriod = (employeeId, reviewPeriod, callback) => {
  const sql = `
    SELECT id FROM performance_reviews
    WHERE employee_id = ? AND review_period = ?
  `;

  db.query(sql, [employeeId, reviewPeriod], (err, results) => {
    if (err) return callback(err);
    callback(null, results.length > 0);
  });
};

const countKpisForReview = (reviewId, callback) => {
  const sql = `SELECT COUNT(*) AS kpiCount FROM performance_kpis WHERE review_id = ?`;

  db.query(sql, [reviewId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0].kpiCount);
  });
};

const getReviewWithKpis = (reviewId, callback) => {
  const reviewSql = `
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
    WHERE pr.id = ?
  `;

  db.query(reviewSql, [reviewId], (err, reviewResults) => {
    if (err) return callback(err);

    if (reviewResults.length === 0) {
      return callback(null, null);
    }

    const kpiSql = `
      SELECT id, review_id, kpi_name, kpi_score, remarks, created_at
      FROM performance_kpis
      WHERE review_id = ?
      ORDER BY id ASC
    `;

    db.query(kpiSql, [reviewId], (kpiErr, kpiResults) => {
      if (kpiErr) return callback(kpiErr);

      callback(null, {
        ...reviewResults[0],
        kpis: kpiResults,
      });
    });
  });
};

module.exports = {
  isEmployeeInManagerTeam,
  reviewExistsForPeriod,
  countKpisForReview,
  getReviewWithKpis,
};
