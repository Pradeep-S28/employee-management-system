const express = require("express");
const {
  createReview,
  updateReview,
  getReviews,
  getReviewById,
  addKpi,
  updateKpi,
  deleteKpi,
  getDashboard,
} = require("../controllers/performanceController");

const {
  verifyToken,
  allowManagerOrAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// task 9: manager-driven KPI appraisal module

// Manager/Admin creates a review (Draft) for an employee
router.post("/review", verifyToken, allowManagerOrAdmin, createReview);

// Manager/Admin updates a review (add rating/feedback, submit it)
router.put("/review/:id", verifyToken, allowManagerOrAdmin, updateReview);

// Role-based list: admin sees all, manager sees own team, employee sees own
router.get("/reviews", verifyToken, getReviews);

// Single review with its KPIs
router.get("/review/:id", verifyToken, getReviewById);

// KPI management (Manager/Admin only, review must still be Draft)
router.post("/kpi", verifyToken, allowManagerOrAdmin, addKpi);
router.put("/kpi/:id", verifyToken, allowManagerOrAdmin, updateKpi);
router.delete("/kpi/:id", verifyToken, allowManagerOrAdmin, deleteKpi);

// Dashboard cards + charts
router.get("/dashboard", verifyToken, allowManagerOrAdmin, getDashboard);

module.exports = router;
