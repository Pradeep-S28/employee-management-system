import { useState } from "react";
import { createPerformanceReview } from "../services/api";

const PerformanceReviewForm = ({ employees, user, token, onReviewCreated }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    review_period: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Managers can only start reviews for employees in their own team.
  // Admins can start a review for anyone.
  const selectableEmployees =
    user?.role === "manager"
      ? employees.filter((employee) => employee.manager_id === user.employee_id)
      : employees;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setError("");
    setMessage("");
  };

  const validate = () => {
    if (!formData.employee_id) {
      setError("Please select an employee");
      return false;
    }

    if (!formData.review_period.trim()) {
      setError("Review period is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await createPerformanceReview(
        {
          employee_id: Number(formData.employee_id),
          review_period: formData.review_period,
        },
        token,
      );

      setMessage("Review created as Draft. Add KPIs below to continue.");
      setFormData({ employee_id: "", review_period: "" });

      if (onReviewCreated) onReviewCreated();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create performance review",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Start a Performance Review</h5>
      </div>

      <div className="card-body">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {selectableEmployees.length === 0 ? (
          <p className="text-muted mb-0">
            No employees are assigned to your team yet. Ask an admin to set you
            as the reporting manager for an employee first.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Employee</label>
                <select
                  name="employee_id"
                  className="form-select"
                  value={formData.employee_id}
                  onChange={handleChange}
                >
                  <option value="">Select Employee</option>
                  {selectableEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name} ({employee.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Review Period</label>
                <input
                  type="text"
                  name="review_period"
                  className="form-control"
                  placeholder="Example: Q2 2026"
                  value={formData.review_period}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Draft Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PerformanceReviewForm;
