const express = require("express");
const {
  submitPerformanceReview,
  getPerformanceReviews,
  updatePerformanceReview,
  getPerformanceSummary,
} = require("../controllers/performanceController");

const {
  verifyToken,
  allowAdminOnly,
  allowEmployeeOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Employee submits self-appraisal
router.post("/", verifyToken, allowEmployeeOnly, submitPerformanceReview);

// Employee sees own reviews, admin sees all reviews
router.get("/", verifyToken, getPerformanceReviews);

// Dashboard chart summary
router.get("/summary", verifyToken, allowAdminOnly, getPerformanceSummary);

// Admin reviews employee appraisal
router.put("/:id", verifyToken, allowAdminOnly, updatePerformanceReview);

module.exports = router;
