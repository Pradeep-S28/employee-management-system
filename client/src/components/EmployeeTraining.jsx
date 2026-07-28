import { useState } from "react";

// Admin-only form to assign a training program to an employee.
export const AssignTrainingForm = ({
  employees,
  programs,
  onSubmit,
  onCancel,
}) => {
  const [employeeId, setEmployeeId] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!employeeId || !trainingId) {
      setError("Please select both an employee and a training program");
      return;
    }

    setError("");
    onSubmit({ employee_id: employeeId, training_id: trainingId });
    setEmployeeId("");
    setTrainingId("");
  };

  return (
    <div className="card p-3 mb-4">
      <h5>Assign Training to Employee</h5>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-5">
            <label className="form-label">Employee</label>
            <select
              className="form-select"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name} ({employee.department})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-5">
            <label className="form-label">Training Program</label>
            <select
              className="form-select"
              value={trainingId}
              onChange={(event) => setTrainingId(event.target.value)}
            >
              <option value="">Select Training</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.training_title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" type="submit">
              Assign
            </button>
          </div>
        </div>

        {error && <div className="text-danger mt-2">{error}</div>}

        {onCancel && (
          <button
            className="btn btn-sm btn-link mt-2"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

const statusBadgeClass = {
  "Not Started": "bg-secondary",
  "In Progress": "bg-warning text-dark",
  Completed: "bg-success",
};

// Assignment list + progress tracker, shared by admin (all), manager (team),
// and employee (own) views.
const EmployeeTraining = ({
  assignments,
  isAdmin,
  isEmployee,
  onProgressUpdate,
}) => {
  const [progressDraft, setProgressDraft] = useState({});

  const handleProgressChange = (id, value) => {
    setProgressDraft({ ...progressDraft, [id]: value });
  };

  const handleProgressSave = (id) => {
    const value = progressDraft[id];
    if (value === undefined) return;
    onProgressUpdate(id, Number(value));
  };

  return (
    <div className="card p-3 mb-4">
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              {!isEmployee && <th>Employee</th>}
              <th>Training</th>
              <th>Category</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Completion Date</th>
              {isEmployee && <th>Update Progress</th>}
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={isEmployee ? 6 : 6} className="text-center">
                  No training assignments found
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment.id}>
                  {!isEmployee && (
                    <td>
                      {assignment.employee_name} ({assignment.department})
                    </td>
                  )}
                  <td>{assignment.training_title}</td>
                  <td>{assignment.category}</td>
                  <td style={{ minWidth: "140px" }}>
                    <div className="progress" style={{ height: "18px" }}>
                      <div
                        className="progress-bar bg-info"
                        style={{ width: `${assignment.progress_percentage}%` }}
                      >
                        {assignment.progress_percentage}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        statusBadgeClass[assignment.completion_status] ||
                        "bg-secondary"
                      }`}
                    >
                      {assignment.completion_status}
                    </span>
                  </td>
                  <td>{assignment.completion_date?.slice(0, 10) || "-"}</td>

                  {isEmployee && (
                    <td>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="form-control form-control-sm"
                          style={{ width: "80px" }}
                          placeholder={`${assignment.progress_percentage}`}
                          value={progressDraft[assignment.id] ?? ""}
                          onChange={(event) =>
                            handleProgressChange(
                              assignment.id,
                              event.target.value,
                            )
                          }
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleProgressSave(assignment.id)}
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTraining;
