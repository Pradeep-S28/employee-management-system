const express = require("express");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  createOnboardingTask,
  getOnboardingTasks,
  updateOnboardingTask,
  getDashboard,
} = require("../controllers/recruitmentController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Task 12: Recruitment & Employee Onboarding Module

// Dashboard: KPI cards + charts (Admin only)
router.get("/recruitment/dashboard", verifyToken, allowAdminOnly, getDashboard);

// Job Openings (Admin only)
router.post("/recruitment/jobs", verifyToken, allowAdminOnly, createJob);
router.get("/recruitment/jobs", verifyToken, allowAdminOnly, getJobs);
router.put("/recruitment/jobs/:id", verifyToken, allowAdminOnly, updateJob);
router.delete("/recruitment/jobs/:id", verifyToken, allowAdminOnly, deleteJob);

// Candidates (Admin only)
router.post("/recruitment/candidates", verifyToken, allowAdminOnly, createCandidate);
router.get("/recruitment/candidates", verifyToken, allowAdminOnly, getCandidates);
router.get(
  "/recruitment/candidates/:id",
  verifyToken,
  allowAdminOnly,
  getCandidateById,
);
router.put(
  "/recruitment/candidates/:id",
  verifyToken,
  allowAdminOnly,
  updateCandidate,
);

// Onboarding Tasks (Admin assigns/edits; any logged-in employee views/completes own)
router.post("/onboarding/tasks", verifyToken, allowAdminOnly, createOnboardingTask);
router.get("/onboarding/tasks", verifyToken, getOnboardingTasks);
router.put("/onboarding/tasks/:id", verifyToken, updateOnboardingTask);

module.exports = router;
