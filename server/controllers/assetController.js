const db = require("../config/db");
const {
  getAssetById,
  hasActiveAssignment,
  getAssignmentWithAsset,
} = require("../services/assetService");

const VALID_ASSET_STATUSES = [
  "Available",
  "Assigned",
  "Under Maintenance",
  "Retired",
];

// ---------------------------------------------------------------------
// Assets: CRUD
//

// POST /assets (Admin only)
const createAsset = (req, res) => {
  const {
    asset_name,
    asset_category,
    asset_code,
    brand,
    model,
    purchase_date,
    purchase_cost,
    warranty_expiry_date,
    asset_status,
  } = req.body;

  if (!asset_name || !asset_category || !asset_code || !purchase_date) {
    return res.status(400).json({
      message:
        "Asset name, category, asset code, and purchase date are required",
    });
  }

  if (asset_status && !VALID_ASSET_STATUSES.includes(asset_status)) {
    return res.status(400).json({
      message: "Invalid asset status",
    });
  }

  const sql = `
    INSERT INTO assets
    (asset_name, asset_category, asset_code, brand, model, purchase_date, purchase_cost, warranty_expiry_date, asset_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      asset_name,
      asset_category,
      asset_code,
      brand || null,
      model || null,
      purchase_date,
      purchase_cost || 0,
      warranty_expiry_date || null,
      asset_status || "Available",
    ],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Asset code must be unique",
          });
        }

        console.error("Error creating asset:", err);
        return res.status(500).json({
          message: "Failed to create asset",
          error: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Asset created successfully",
        assetId: result.insertId,
      });
    },
  );
};

// PUT /assets/:id (Admin only)
const updateAsset = (req, res) => {
  const { id } = req.params;
  const {
    asset_name,
    asset_category,
    asset_code,
    brand,
    model,
    purchase_date,
    purchase_cost,
    warranty_expiry_date,
    asset_status,
  } = req.body;

  if (asset_status && !VALID_ASSET_STATUSES.includes(asset_status)) {
    return res.status(400).json({
      message: "Invalid asset status",
    });
  }

  getAssetById(id, (err, asset) => {
    if (err) {
      console.error("Error fetching asset:", err);
      return res.status(500).json({
        message: "Failed to update asset",
      });
    }

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    const applyUpdate = () => {
      const sql = `
        UPDATE assets
        SET
          asset_name = COALESCE(?, asset_name),
          asset_category = COALESCE(?, asset_category),
          asset_code = COALESCE(?, asset_code),
          brand = COALESCE(?, brand),
          model = COALESCE(?, model),
          purchase_date = COALESCE(?, purchase_date),
          purchase_cost = COALESCE(?, purchase_cost),
          warranty_expiry_date = COALESCE(?, warranty_expiry_date),
          asset_status = COALESCE(?, asset_status)
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          asset_name,
          asset_category,
          asset_code,
          brand,
          model,
          purchase_date,
          purchase_cost,
          warranty_expiry_date,
          asset_status,
          id,
        ],
        (updateErr) => {
          if (updateErr) {
            if (updateErr.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                message: "Asset code must be unique",
              });
            }

            console.error("Error updating asset:", updateErr);
            return res.status(500).json({
              message: "Failed to update asset",
            });
          }

          res.status(200).json({
            message: "Asset updated successfully",
          });
        },
      );
    };

    // Prevent manually setting an assigned asset back to Available while it
    // still has an active assignment (the return flow handles that instead).
    if (asset_status && asset_status !== asset.asset_status) {
      hasActiveAssignment(id, (activeErr, isActive) => {
        if (activeErr) {
          console.error("Error checking active assignment:", activeErr);
          return res.status(500).json({
            message: "Failed to update asset",
          });
        }

        if (isActive && asset_status !== "Assigned") {
          return res.status(400).json({
            message:
              "This asset is currently assigned. Return it before changing its status.",
          });
        }

        applyUpdate();
      });
    } else {
      applyUpdate();
    }
  });
};

// DELETE /assets/:id (Admin only,  if not assigned)
const deleteAsset = (req, res) => {
  const { id } = req.params;

  getAssetById(id, (err, asset) => {
    if (err) {
      console.error("Error fetching asset:", err);
      return res.status(500).json({
        message: "Failed to delete asset",
      });
    }

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    if (asset.asset_status === "Assigned") {
      return res.status(400).json({
        message: "Cannot delete an asset that is currently assigned",
      });
    }

    db.query(`DELETE FROM assets WHERE id = ?`, [id], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting asset:", deleteErr);
        return res.status(500).json({
          message: "Failed to delete asset",
        });
      }

      res.status(200).json({
        message: "Asset deleted successfully",
      });
    });
  });
};

// GET /assets (Admin: all, with search/filter; Manager: assets assigned to their team)
const getAssets = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;
  const { search, category, status } = req.query;

  let sql = `SELECT * FROM assets WHERE 1 = 1`;
  const values = [];

  if (role === "manager") {
    sql = `
      SELECT DISTINCT a.*
      FROM assets a
      JOIN asset_assignments aa ON aa.asset_id = a.id
      JOIN employees e ON aa.employee_id = e.id
      WHERE e.manager_id = ?
    `;
    values.push(userEmployeeId);
  } else if (role === "employee") {
    return res.status(403).json({
      message: "Access denied. Employees can only view their own assets.",
    });
  }

  if (search) {
    sql += ` AND (asset_name LIKE ? OR asset_code LIKE ? OR brand LIKE ?)`;
    const term = `%${search}%`;
    values.push(term, term, term);
  }

  if (category) {
    sql += ` AND asset_category = ?`;
    values.push(category);
  }

  if (status) {
    sql += ` AND asset_status = ?`;
    values.push(status);
  }

  sql += ` ORDER BY created_at DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching assets:", err);
      return res.status(500).json({
        message: "Failed to fetch assets",
      });
    }

    res.status(200).json(results);
  });
};

// GET /assets/:id
const getAssetByIdHandler = (req, res) => {
  const { id } = req.params;

  getAssetById(id, (err, asset) => {
    if (err) {
      console.error("Error fetching asset:", err);
      return res.status(500).json({
        message: "Failed to fetch asset",
      });
    }

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json(asset);
  });
};

// ---------------------------------------------------------------------
// Assignments
// ----------------------------------------------------------------

// POST /assets/assign (Admin only)
const assignAsset = (req, res) => {
  const {
    asset_id,
    employee_id,
    assigned_date,
    expected_return_date,
    remarks,
  } = req.body;

  if (!asset_id || !employee_id || !assigned_date) {
    return res.status(400).json({
      message: "Asset, employee, and assigned date are required",
    });
  }

  if (
    expected_return_date &&
    new Date(expected_return_date) < new Date(assigned_date)
  ) {
    return res.status(400).json({
      message: "Expected return date cannot be earlier than the assigned date",
    });
  }

  getAssetById(asset_id, (err, asset) => {
    if (err) {
      console.error("Error fetching asset:", err);
      return res.status(500).json({
        message: "Failed to assign asset",
      });
    }

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    if (asset.asset_status !== "Available") {
      return res.status(400).json({
        message: `Asset cannot be assigned because it is currently '${asset.asset_status}'`,
      });
    }

    const insertSql = `
      INSERT INTO asset_assignments
      (asset_id, employee_id, assigned_date, expected_return_date, assignment_status, remarks)
      VALUES (?, ?, ?, ?, 'Assigned', ?)
    `;

    db.query(
      insertSql,
      [
        asset_id,
        employee_id,
        assigned_date,
        expected_return_date || null,
        remarks || null,
      ],
      (insertErr, result) => {
        if (insertErr) {
          if (insertErr.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "This asset already has an active assignment",
            });
          }

          console.error("Error assigning asset:", insertErr);
          return res.status(500).json({
            message: "Failed to assign asset",
            error: insertErr.sqlMessage,
          });
        }

        db.query(
          `UPDATE assets SET asset_status = 'Assigned' WHERE id = ?`,
          [asset_id],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating asset status:", updateErr);
              return res.status(500).json({
                message: "Asset assigned, but failed to update asset status",
              });
            }

            res.status(201).json({
              message: "Asset assigned successfully",
              assignmentId: result.insertId,
            });
          },
        );
      },
    );
  });
};

// POST /assets/return (Admin only)
const returnAsset = (req, res) => {
  const { assignment_id, actual_return_date, assignment_status, remarks } =
    req.body;

  if (!assignment_id) {
    return res.status(400).json({
      message: "Assignment id is required",
    });
  }

  const finalStatus = assignment_status === "Lost" ? "Lost" : "Returned";

  getAssignmentWithAsset(assignment_id, (err, assignment) => {
    if (err) {
      console.error("Error fetching assignment:", err);
      return res.status(500).json({
        message: "Failed to process return",
      });
    }

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    if (assignment.assignment_status !== "Assigned") {
      return res.status(400).json({
        message: "This assignment has already been closed",
      });
    }

    const updateAssignmentSql = `
      UPDATE asset_assignments
      SET
        actual_return_date = ?,
        assignment_status = ?,
        remarks = COALESCE(?, remarks)
      WHERE id = ?
    `;

    db.query(
      updateAssignmentSql,
      [
        actual_return_date || new Date().toISOString().slice(0, 10),
        finalStatus,
        remarks,
        assignment_id,
      ],
      (updateErr) => {
        if (updateErr) {
          console.error("Error updating assignment:", updateErr);
          return res.status(500).json({
            message: "Failed to process return",
          });
        }

        // Returned asserts automatically become available again
        // Lost assets will not returned to the available pool,
        const newAssetStatus =
          finalStatus === "Returned" ? "Available" : "Retired";

        db.query(
          `UPDATE assets SET asset_status = ? WHERE id = ?`,
          [newAssetStatus, assignment.asset_id],
          (assetErr) => {
            if (assetErr) {
              console.error("Error updating asset status:", assetErr);
              return res.status(500).json({
                message: "Return recorded, but failed to update asset status",
              });
            }

            res.status(200).json({
              message:
                finalStatus === "Returned"
                  ? "Asset returned successfully"
                  : "Asset marked as lost",
            });
          },
        );
      },
    );
  });
};

// GET /assets/assignments (role-based)
const getAssignments = (req, res) => {
  const { role, employee_id: userEmployeeId } = req.user;

  let sql = `
    SELECT
      aa.id,
      aa.asset_id,
      a.asset_name,
      a.asset_code,
      a.asset_category,
      aa.employee_id,
      e.full_name AS employee_name,
      e.department,
      aa.assigned_date,
      aa.expected_return_date,
      aa.actual_return_date,
      aa.assignment_status,
      aa.remarks,
      aa.created_at
    FROM asset_assignments aa
    JOIN assets a ON aa.asset_id = a.id
    JOIN employees e ON aa.employee_id = e.id
  `;

  const values = [];

  if (role === "employee") {
    sql += ` WHERE aa.employee_id = ?`;
    values.push(userEmployeeId);
  } else if (role === "manager") {
    sql += ` WHERE e.manager_id = ?`;
    values.push(userEmployeeId);
  }

  sql += ` ORDER BY aa.created_at DESC`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching assignments:", err);
      return res.status(500).json({
        message: "Failed to fetch assignments",
      });
    }

    res.status(200).json(results);
  });
};

// ---------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------

// GET /assets/dashboard (Admin only
const getDashboard = (req, res) => {
  const cardsSql = `
    SELECT
      COUNT(*) AS totalAssets,
      SUM(CASE WHEN asset_status = 'Available' THEN 1 ELSE 0 END) AS availableAssets,
      SUM(CASE WHEN asset_status = 'Assigned' THEN 1 ELSE 0 END) AS assignedAssets,
      SUM(CASE WHEN asset_status = 'Under Maintenance' THEN 1 ELSE 0 END) AS underMaintenanceAssets
    FROM assets
  `;

  const dueForReturnSql = `
    SELECT COUNT(*) AS assetsDueForReturn
    FROM asset_assignments
    WHERE assignment_status = 'Assigned'
      AND expected_return_date IS NOT NULL
      AND expected_return_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  `;

  const categorySql = `
    SELECT asset_category AS category, COUNT(*) AS count
    FROM assets
    GROUP BY asset_category
    ORDER BY count DESC
  `;

  const statusSql = `
    SELECT asset_status AS status, COUNT(*) AS count
    FROM assets
    GROUP BY asset_status
  `;

  const monthlyAssignmentsSql = `
    SELECT DATE_FORMAT(assigned_date, '%Y-%m') AS month, COUNT(*) AS count
    FROM asset_assignments
    GROUP BY month
    ORDER BY month
  `;

  const departmentAllocationSql = `
    SELECT e.department, COUNT(*) AS count
    FROM asset_assignments aa
    JOIN employees e ON aa.employee_id = e.id
    WHERE aa.assignment_status = 'Assigned'
    GROUP BY e.department
    ORDER BY count DESC
  `;

  db.query(cardsSql, (err, cardResults) => {
    if (err) {
      console.error("Error fetching asset dashboard cards:", err);
      return res.status(500).json({
        message: "Failed to fetch asset dashboard",
      });
    }

    db.query(dueForReturnSql, (dueErr, dueResults) => {
      if (dueErr) {
        console.error("Error fetching due-for-return count:", dueErr);
        return res.status(500).json({
          message: "Failed to fetch asset dashboard",
        });
      }

      db.query(categorySql, (catErr, categoryDistribution) => {
        if (catErr) {
          console.error("Error fetching category distribution:", catErr);
          return res.status(500).json({
            message: "Failed to fetch asset dashboard",
          });
        }

        db.query(statusSql, (statusErr, statusOverview) => {
          if (statusErr) {
            console.error("Error fetching status overview:", statusErr);
            return res.status(500).json({
              message: "Failed to fetch asset dashboard",
            });
          }

          db.query(monthlyAssignmentsSql, (monthErr, monthlyAssignments) => {
            if (monthErr) {
              console.error("Error fetching monthly assignments:", monthErr);
              return res.status(500).json({
                message: "Failed to fetch asset dashboard",
              });
            }

            db.query(
              departmentAllocationSql,
              (deptErr, departmentAllocation) => {
                if (deptErr) {
                  console.error(
                    "Error fetching department allocation:",
                    deptErr,
                  );
                  return res.status(500).json({
                    message: "Failed to fetch asset dashboard",
                  });
                }

                res.status(200).json({
                  cards: {
                    ...cardResults[0],
                    assetsDueForReturn: dueResults[0].assetsDueForReturn,
                  },
                  categoryDistribution,
                  statusOverview,
                  monthlyAssignments,
                  departmentAllocation,
                });
              },
            );
          });
        });
      });
    });
  });
};

module.exports = {
  createAsset,
  updateAsset,
  deleteAsset,
  getAssets,
  getAssetById: getAssetByIdHandler,
  assignAsset,
  returnAsset,
  getAssignments,
  getDashboard,
};
