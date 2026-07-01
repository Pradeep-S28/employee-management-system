import { useState } from "react";
import { submitLeaveRequest } from "../services/api";

const LeaveForm = ({ token, onLeaveSubmitted }) => {
  const [formData, setFormData] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.leave_type ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.reason
    ) {
      setError("Please fill all fields");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      setError("End date must be greater than or equal to start date");
      return;
    }

    try {
      setLoading(true);
      await submitLeaveRequest(formData, token);

      setMessage("Leave request submitted successfully");
      setFormData({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
      });

      onLeaveSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Submit Leave Request</h5>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Leave Type</label>
              <select
                className="form-select"
                name="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Reason</label>
              <textarea
                className="form-control"
                name="reason"
                rows="3"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for leave"
              ></textarea>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Leave Request"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
