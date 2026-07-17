import { useEffect, useState } from "react";

// Assign form: shown when admin picks "Assign" on an Available asset
export const AssignAssetForm = ({ asset, employees, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    assigned_date: new Date().toISOString().slice(0, 10),
    expected_return_date: "",
    remarks: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      employee_id: "",
      assigned_date: new Date().toISOString().slice(0, 10),
      expected_return_date: "",
      remarks: "",
    });
    setError("");
  }, [asset]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.employee_id) {
      setError("Please select an employee");
      return;
    }

    if (
      formData.expected_return_date &&
      formData.expected_return_date < formData.assigned_date
    ) {
      setError("Expected return date cannot be earlier than the assigned date");
      return;
    }

    onSubmit({
      asset_id: asset.id,
      ...formData,
    });
  };

  if (!asset) return null;

  return (
    <div className="card p-3 mb-4 border-success">
      <h5>
        Assign Asset: {asset.asset_name} ({asset.asset_code})
      </h5>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Employee</label>
            <select
              name="employee_id"
              className="form-select"
              value={formData.employee_id}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name} ({employee.department})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Assigned Date</label>
            <input
              type="date"
              name="assigned_date"
              className="form-control"
              value={formData.assigned_date}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Expected Return Date</label>
            <input
              type="date"
              name="expected_return_date"
              className="form-control"
              value={formData.expected_return_date}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Remarks</label>
            <input
              type="text"
              name="remarks"
              className="form-control"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-success" type="submit">
            Assign Asset
          </button>

          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const assignmentStatusBadge = {
  Assigned: "bg-primary",
  Returned: "bg-success",
  Lost: "bg-danger",
};

// Assignment history table, shared by admin/manager/employee views.
// Admin gets Return / Mark Lost actions inline.
const AssetAssignment = ({ assignments, isAdmin, onReturn }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Asset</th>
            <th>Employee</th>
            <th>Assigned Date</th>
            <th>Expected Return</th>
            <th>Actual Return</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="text-center">
                No assignment records found
              </td>
            </tr>
          ) : (
            assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>
                  {assignment.asset_name} ({assignment.asset_code})
                </td>
                <td>
                  {assignment.employee_name}
                  {assignment.department ? ` (${assignment.department})` : ""}
                </td>
                <td>{assignment.assigned_date?.slice(0, 10)}</td>
                <td>{assignment.expected_return_date?.slice(0, 10) || "-"}</td>
                <td>{assignment.actual_return_date?.slice(0, 10) || "-"}</td>
                <td>
                  <span
                    className={`badge ${
                      assignmentStatusBadge[assignment.assignment_status] ||
                      "bg-secondary"
                    }`}
                  >
                    {assignment.assignment_status}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    {assignment.assignment_status === "Assigned" && (
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            onReturn(assignment, "Returned")
                          }
                        >
                          Return
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onReturn(assignment, "Lost")}
                        >
                          Mark Lost
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssetAssignment;
