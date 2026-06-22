const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
} = require("../controllers/employeeController");

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);

module.exports = router;
