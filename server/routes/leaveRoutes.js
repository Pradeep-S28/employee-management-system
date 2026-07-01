const express = require("express");
const router = express.Router();

const {
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveStatus,
  getLeaveSummary,
} = require("../controllers/leaveController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createLeaveRequest);

router.get("/", verifyToken, getLeaveRequests);

router.put("/:id/status", verifyToken, allowAdminOnly, updateLeaveStatus);

router.get("/summary", verifyToken, getLeaveSummary);

module.exports = router;
