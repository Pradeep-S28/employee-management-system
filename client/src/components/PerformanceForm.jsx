import { useState } from "react";
import { submitPerformanceReview } from "../services/api";

const PerformanceForm = ({ token, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    review_period: "",
    self_rating: "",
    self_comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
    setMessage("");
  };

  const validateForm = () => {
    if (!formData.review_period.trim()) {
      setError("Review period is required");
      return false;
    }

    if (!formData.self_rating) {
      setError("Self rating is required");
      return false;
    }

    if (Number(formData.self_rating) < 1 || Number(formData.self_rating) > 5) {
      setError("Self rating must be between 1 and 5");
      return false;
    }

    if (!formData.self_comments.trim()) {
      setError("Self comments are required");
      return false;
    }

    if (formData.self_comments.trim().length < 10) {
      setError("Self comments must be at least 10 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await submitPerformanceReview(
        {
          review_period: formData.review_period,
          self_rating: Number(formData.self_rating),
          self_comments: formData.self_comments,
        },
        token,
      );

      setMessage("Self-appraisal submitted successfully");

      setFormData({
        review_period: "",
        self_rating: "",
        self_comments: "",
      });

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit self-appraisal",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Submit Self-Appraisal</h5>
      </div>

      <div className="card-body">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
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

            <div className="col-md-6 mb-3">
              <label className="form-label">Self Rating</label>
              <select
                name="self_rating"
                className="form-select"
                value={formData.self_rating}
                onChange={handleChange}
              >
                <option value="">Select Rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Self Comments</label>
            <textarea
              name="self_comments"
              className="form-control"
              rows="4"
              placeholder="Write your achievements, improvements, and contributions..."
              value={formData.self_comments}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Appraisal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PerformanceForm;
