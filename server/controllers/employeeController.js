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

const createEmployee = (req, res) => {
  const { full_name, email, department, designation, date_of_joining, status } =
    req.body;

  if (
    !full_name ||
    !email ||
    !department ||
    !designation ||
    !date_of_joining ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const emailPattern = /\S+@\S+\.\S+/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  const today = new Date();
  const joiningDate = new Date(date_of_joining);

  if (joiningDate > today) {
    return res.status(400).json({
      message: "Date of joining cannot be a future date",
    });
  }

  const sql = `
    INSERT INTO employees
    (full_name, email, department, designation, date_of_joining, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [full_name, email, department, designation, date_of_joining, status],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to create employee",
        });
      }

      res.status(201).json({
        message: "Employee created successfully",
        employeeId: result.insertId,
      });
    },
  );
};

const updateEmployee = (req, res) => {
  const { id } = req.params;

  const { full_name, email, department, designation, date_of_joining, status } =
    req.body;

  if (
    !full_name ||
    !email ||
    !department ||
    !designation ||
    !date_of_joining ||
    !status
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const emailPattern = /\S+@\S+\.\S+/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  const today = new Date();
  const joiningDate = new Date(date_of_joining);

  if (joiningDate > today) {
    return res.status(400).json({
      message: "Date of joining cannot be a future date",
    });
  }

  const sql = `
    UPDATE employees
    SET full_name = ?, email = ?, department = ?, designation = ?, date_of_joining = ?, status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [full_name, email, department, designation, date_of_joining, status, id],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to update employee",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }

      res.status(200).json({
        message: "Employee updated successfully",
      });
    },
  );
};

const deleteEmployee = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM employees WHERE id = ?";

  db.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to delete employee",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
