const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllEmployees);
router.get("/:id", verifyToken, getEmployeeById);

router.post("/", verifyToken, allowAdminOnly, createEmployee);
router.put("/:id", verifyToken, allowAdminOnly, updateEmployee);
router.delete("/:id", verifyToken, allowAdminOnly, deleteEmployee);

module.exports = router;
