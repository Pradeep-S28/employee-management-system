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

const getEmployeeById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM employees WHERE id = ?";

  db.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch employee",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(result[0]);
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
};
