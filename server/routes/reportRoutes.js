const express = require("express");
const router = express.Router();

const {
  getEmployeeReports,
  getLeaveReports,
} = require("../controllers/reportController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

router.get("/employees", verifyToken, allowAdminOnly, getEmployeeReports);
router.get("/leaves", verifyToken, allowAdminOnly, getLeaveReports);

module.exports = router;
