const express = require("express");
const router = express.Router();

const {
  getEmployeeReports,
  getLeaveReports,
  getPayrollReports,
  getDashboardReports,
  exportCSV,
  exportExcel,
  exportPDF,
  getAttendanceReports,
} = require("../controllers/reportController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

router.get("/employees", verifyToken, allowAdminOnly, getEmployeeReports);
router.get("/leaves", verifyToken, allowAdminOnly, getLeaveReports);
router.get("/payroll", verifyToken, allowAdminOnly, getPayrollReports);
router.get("/dashboard", verifyToken, allowAdminOnly, getDashboardReports);
router.get("/export/csv", verifyToken, allowAdminOnly, exportCSV);

router.get("/export/excel", verifyToken, allowAdminOnly, exportExcel);

router.get("/export/pdf", verifyToken, allowAdminOnly, exportPDF);

router.get("/attendance", verifyToken, allowAdminOnly, getAttendanceReports);

module.exports = router;
