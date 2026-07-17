const express = require("express");
const {
  createAsset,
  updateAsset,
  deleteAsset,
  getAssets,
  getAssetById,
  assignAsset,
  returnAsset,
  getAssignments,
  getDashboard,
} = require("../controllers/assetController");

const { verifyToken, allowAdminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Task 10: Employee Asset Management Module

// Dashboard cards + charts (Admin only)
router.get("/dashboard", verifyToken, allowAdminOnly, getDashboard);

// Assignment history (role-based: admin all, manager team, employee own)
router.get("/assignments", verifyToken, getAssignments);

// Assign / return an asset (Admin only)
router.post("/assign", verifyToken, allowAdminOnly, assignAsset);
router.post("/return", verifyToken, allowAdminOnly, returnAsset);

// Asset CRUD
router.post("/", verifyToken, allowAdminOnly, createAsset);
router.get("/", verifyToken, getAssets);
router.get("/:id", verifyToken, allowAdminOnly, getAssetById);
router.put("/:id", verifyToken, allowAdminOnly, updateAsset);
router.delete("/:id", verifyToken, allowAdminOnly, deleteAsset);

module.exports = router;
