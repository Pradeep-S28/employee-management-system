const express = require("express");
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  addComment,
  updateStatus,
  getDashboard,
} = require("../controllers/helpDeskController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Task 11: Employee Help Desk & Service Request Module

// Dashboard cards + charts (Admin only)
router.get("/dashboard", verifyToken, allowAdminOnly, getDashboard);

// Create a request (any logged-in user, for themselves)
router.post("/request", verifyToken, createRequest);

// List requests (role-based scope + filters for admin)
router.get("/requests", verifyToken, getRequests);

// Single request with comments (role-based access check)
router.get("/request/:id", verifyToken, getRequestById);

// Update ticket details (Admin only)
router.put("/request/:id", verifyToken, allowAdminOnly, updateRequest);

// Add a comment (role-based access check)
router.post("/request/:id/comment", verifyToken, addComment);

// Update status / assignment (Admin only)
router.put("/request/:id/status", verifyToken, allowAdminOnly, updateStatus);

module.exports = router;
