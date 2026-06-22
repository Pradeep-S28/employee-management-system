const db = require("../config/db");

const getAllEmployees = (req, res) => {
  const sql = "SELECT * FROM employees ORDER BY id DESC";

  db.query(sql, (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch employees",
      });
    }

    res.status(200).json(result);
  });
};

module.exports = {
  getAllEmployees,
};
