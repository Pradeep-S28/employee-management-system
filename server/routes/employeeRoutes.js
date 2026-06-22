const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
} = require("../controllers/employeeController");

router.get("/", getAllEmployees);
router.post("/", createEmployee);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);

module.exports = router;
