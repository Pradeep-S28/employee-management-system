const express = require("express");
const router = express.Router();

const { getEmployeeReports } = require("../controllers/reportController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

router.get("/employees", verifyToken, allowAdminOnly, getEmployeeReports);

module.exports = router;
