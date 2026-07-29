const express = require("express");
const {
  createProgram,
  getPrograms,
  updateProgram,
  deleteProgram,
  assignTraining,
  getAssignments,
  updateProgress,
  recordAssessment,
  getAssessmentsByEmployee,
  createCertification,
  getCertifications,
  getDashboard,
} = require("../controllers/trainingController");

const {
  verifyToken,
  allowAdminOnly,
  allowManagerOrAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Task 13: Training & Learning Management Module

// Dashboard: KPI cards + charts (Admin/Manager)
router.get(
  "/training/dashboard",
  verifyToken,
  allowManagerOrAdmin,
  getDashboard,
);

// Training Programs (Admin manages; every logged-in role can view the catalog)
router.post("/training/programs", verifyToken, allowAdminOnly, createProgram);
router.get("/training/programs", verifyToken, getPrograms);
router.put(
  "/training/programs/:id",
  verifyToken,
  allowAdminOnly,
  updateProgram,
);
router.delete(
  "/training/programs/:id",
  verifyToken,
  allowAdminOnly,
  deleteProgram,
);

// Assigning training to employees (Admin only)
router.post("/training/assign", verifyToken, allowAdminOnly, assignTraining);

// Assignments: admin sees all, manager sees own team, employee sees own
router.get("/training/assignments", verifyToken, getAssignments);

// Progress: employee updates their own; admin can update on their behalf
router.put("/training/progress/:id", verifyToken, updateProgress);

// Assessments (Admin records results)
router.post(
  "/training/assessment",
  verifyToken,
  allowAdminOnly,
  recordAssessment,
);
router.get(
  "/training/assessment/:employeeId",
  verifyToken,
  getAssessmentsByEmployee,
);

// Certifications (Admin generates; issued only after a passing assessment)
router.post(
  "/training/certification",
  verifyToken,
  allowAdminOnly,
  createCertification,
);
router.get("/training/certifications", verifyToken, getCertifications);

module.exports = router;
