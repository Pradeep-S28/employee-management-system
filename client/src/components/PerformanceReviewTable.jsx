import { useEffect, useState } from "react";
import {
  getPerformanceReviewById,
  updatePerformanceReview,
  deletePerformanceKpi,
} from "../services/api";
import KPIForm from "./KPIForm";

const MIN_KPIS_TO_SUBMIT = 3;

const statusBadgeClass = (status) => {
  if (status === "Draft") return "bg-secondary";
  if (status === "Submitted") return "bg-success";
  return "bg-info text-dark";
};

const PerformanceReviewTable = ({ reviews, role, token, onReviewChanged }) => {
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [overallRating, setOverallRating] = useState("");
  const [overallFeedback, setOverallFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const isReviewer = role === "admin" || role === "manager";

  const fetchReviewDetail = async (reviewId) => {
    try {
      setDetailLoading(true);
      setDetailError("");

      const response = await getPerformanceReviewById(reviewId, token);

      setSelectedReview(response.data);
      setOverallRating(response.data.overall_rating || "");
      setOverallFeedback(response.data.overall_feedback || "");
    } catch (err) {
      setDetailError(
        err.response?.data?.message || "Failed to load review details",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReviewId) {
      fetchReviewDetail(selectedReviewId);
    } else {
      setSelectedReview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReviewId]);

  const handleRowClick = (reviewId) => {
    setSelectedReviewId(reviewId === selectedReviewId ? null : reviewId);
  };

  const handleKpiChange = () => {
    fetchReviewDetail(selectedReviewId);
    if (onReviewChanged) onReviewChanged();
  };

  const handleDeleteKpi = async (kpiId) => {
    try {
      await deletePerformanceKpi(kpiId, token);
      handleKpiChange();
    } catch (err) {
      setDetailError(err.response?.data?.message || "Failed to delete KPI");
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      setDetailError("");

      await updatePerformanceReview(
        selectedReviewId,
        {
          overall_rating: overallRating ? Number(overallRating) : null,
          overall_feedback: overallFeedback || null,
        },
        token,
      );

      handleKpiChange();
    } catch (err) {
      setDetailError(err.response?.data?.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!overallRating) {
      setDetailError("Overall rating is required before submitting");
      return;
    }

    if ((selectedReview?.kpis?.length || 0) < MIN_KPIS_TO_SUBMIT) {
      setDetailError(
        `At least ${MIN_KPIS_TO_SUBMIT} KPIs must be added before submitting a review`,
      );
      return;
    }

    try {
      setSaving(true);
      setDetailError("");

      await updatePerformanceReview(
        selectedReviewId,
        {
          overall_rating: Number(overallRating),
          overall_feedback: overallFeedback || null,
          review_status: "Submitted",
        },
        token,
      );

      handleKpiChange();
    } catch (err) {
      setDetailError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">
          {role === "employee" ? "My Review History" : "Performance Reviews"}
        </h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                {role !== "employee" && <th>Employee</th>}
                {role !== "employee" && <th>Department</th>}
                <th>Review Period</th>
                {role === "admin" && <th>Manager</th>}
                <th>Overall Rating</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No performance reviews found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id}>
                    {role !== "employee" && <td>{review.employee_name}</td>}
                    {role !== "employee" && <td>{review.department}</td>}
                    <td>{review.review_period}</td>
                    {role === "admin" && <td>{review.manager_name || "-"}</td>}
                    <td>{review.overall_rating || "-"}</td>
                    <td>
                      <span
                        className={`badge ${statusBadgeClass(review.review_status)}`}
                      >
                        {review.review_status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleRowClick(review.id)}
                      >
                        {selectedReviewId === review.id ? "Close" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedReviewId && (
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">
                Review Details
                {selectedReview
                  ? ` — ${selectedReview.employee_name} (${selectedReview.review_period})`
                  : ""}
              </h6>
            </div>

            <div className="card-body">
              {detailError && (
                <div className="alert alert-danger">{detailError}</div>
              )}

              {detailLoading || !selectedReview ? (
                <div className="text-center my-3">Loading...</div>
              ) : (
                <>
                  <h6>KPIs ({selectedReview.kpis.length})</h6>

                  <div className="table-responsive mb-3">
                    <table className="table table-sm table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>KPI</th>
                          <th>Score</th>
                          <th>Remarks</th>
                          {isReviewer &&
                            selectedReview.review_status === "Draft" && (
                              <th>Action</th>
                            )}
                        </tr>
                      </thead>

                      <tbody>
                        {selectedReview.kpis.length === 0 ? (
                          <tr>
                            <td
                              colSpan={isReviewer ? 4 : 3}
                              className="text-center"
                            >
                              No KPIs added yet
                            </td>
                          </tr>
                        ) : (
                          selectedReview.kpis.map((kpi) => (
                            <tr key={kpi.id}>
                              <td>{kpi.kpi_name}</td>
                              <td>{kpi.kpi_score}</td>
                              <td>{kpi.remarks || "-"}</td>
                              {isReviewer &&
                                selectedReview.review_status === "Draft" && (
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteKpi(kpi.id)}
                                    >
                                      Remove
                                    </button>
                                  </td>
                                )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {isReviewer && selectedReview.review_status === "Draft" && (
                    <div className="mb-4">
                      <KPIForm
                        reviewId={selectedReviewId}
                        token={token}
                        onKpiAdded={handleKpiChange}
                      />
                      {selectedReview.kpis.length < MIN_KPIS_TO_SUBMIT && (
                        <small className="text-muted d-block mt-2">
                          Add at least {MIN_KPIS_TO_SUBMIT} KPIs before
                          submitting this review.
                        </small>
                      )}
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Overall Rating</label>
                      <select
                        className="form-select"
                        value={overallRating}
                        onChange={(event) =>
                          setOverallRating(event.target.value)
                        }
                        disabled={
                          !isReviewer ||
                          selectedReview.review_status !== "Draft"
                        }
                      >
                        <option value="">Select Rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>

                    <div className="col-md-8 mb-3">
                      <label className="form-label">
                        Overall Feedback (strengths & improvement areas)
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={overallFeedback}
                        onChange={(event) =>
                          setOverallFeedback(event.target.value)
                        }
                        disabled={
                          !isReviewer ||
                          selectedReview.review_status !== "Draft"
                        }
                      ></textarea>
                    </div>
                  </div>

                  {isReviewer && selectedReview.review_status === "Draft" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleSaveDraft}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Draft"}
                      </button>

                      <button
                        className="btn btn-success"
                        onClick={handleSubmitReview}
                        disabled={saving}
                      >
                        {saving ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceReviewTable;
