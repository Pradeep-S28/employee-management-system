import { useState } from "react";
import { updatePerformanceReview } from "../services/api";

const PerformanceTable = ({ reviews, role, token, onReviewUpdated }) => {
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [managerRating, setManagerRating] = useState("");
  const [managerFeedback, setManagerFeedback] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReviewClick = (review) => {
    setSelectedReviewId(review.id);
    setManagerRating(review.manager_rating || "");
    setManagerFeedback(review.manager_feedback || "");
    setError("");
    setMessage("");
  };

  const handleCancel = () => {
    setSelectedReviewId(null);
    setManagerRating("");
    setManagerFeedback("");
    setError("");
    setMessage("");
  };

  const handleSubmitReview = async (reviewId) => {
    if (!managerRating) {
      setError("Manager rating is required");
      return;
    }

    if (Number(managerRating) < 1 || Number(managerRating) > 5) {
      setError("Manager rating must be between 1 and 5");
      return;
    }

    if (!managerFeedback.trim()) {
      setError("Manager feedback is required");
      return;
    }

    if (managerFeedback.trim().length < 10) {
      setError("Manager feedback must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);

      await updatePerformanceReview(
        reviewId,
        {
          manager_rating: Number(managerRating),
          manager_feedback: managerFeedback,
        },
        token,
      );

      setMessage("Performance review updated successfully");
      setSelectedReviewId(null);
      setManagerRating("");
      setManagerFeedback("");

      if (onReviewUpdated) {
        onReviewUpdated();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update performance review",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">
          {role === "admin" ? "All Performance Reviews" : "My Review History"}
        </h5>
      </div>

      <div className="card-body">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                {role === "admin" && <th>Employee</th>}
                {role === "admin" && <th>Department</th>}
                <th>Review Period</th>
                <th>Self Rating</th>
                <th>Self Comments</th>
                <th>Manager Rating</th>
                <th>Manager Feedback</th>
                <th>Status</th>
                {role === "admin" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "admin" ? "9" : "6"}
                    className="text-center"
                  >
                    No performance reviews found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id}>
                    {role === "admin" && <td>{review.full_name}</td>}
                    {role === "admin" && <td>{review.department}</td>}
                    <td>{review.review_period}</td>
                    <td>{review.self_rating}</td>
                    <td>{review.self_comments}</td>
                    <td>{review.manager_rating || "-"}</td>
                    <td>{review.manager_feedback || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          review.status === "Reviewed"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {review.status}
                      </span>
                    </td>

                    {role === "admin" && (
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleReviewClick(review)}
                        >
                          Review
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {role === "admin" && selectedReviewId && (
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">Manager Review</h6>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Manager Rating</label>
                <select
                  className="form-select"
                  value={managerRating}
                  onChange={(e) => setManagerRating(e.target.value)}
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Manager Feedback</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={managerFeedback}
                  onChange={(e) => setManagerFeedback(e.target.value)}
                  placeholder="Enter manager feedback..."
                ></textarea>
              </div>

              <button
                className="btn btn-success me-2"
                onClick={() => handleSubmitReview(selectedReviewId)}
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit Review"}
              </button>

              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTable;
