const express = require("express");

const {
  setSalaryStructure,
  getSalaryStructure,
  generatePayslip,
  getPayslips,
  getPayslipById,
  getPayrollSummary,
} = require("../controllers/payrollController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin sets salary structure
router.post("/salary", verifyToken, allowAdminOnly, setSalaryStructure);

// Admin can view any employee salary, employee can view only own salary
router.get("/salary/:employeeId", verifyToken, getSalaryStructure);

// Admin generates payslip
router.post("/generate", verifyToken, allowAdminOnly, generatePayslip);

// Admin views all payslips, employee views own payslips
router.get("/payslips", verifyToken, getPayslips);

// View single payslip details
router.get("/payslips/:id", verifyToken, getPayslipById);

// Payroll dashboard summary
router.get("/summary", verifyToken, allowAdminOnly, getPayrollSummary);

module.exports = router;
