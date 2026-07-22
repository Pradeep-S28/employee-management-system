import { useState } from "react";
import CommentSection from "./CommentSection";
import { addRequestComment, updateRequestStatus } from "../services/api";

const statuses = ["Open", "Assigned", "In Progress", "Resolved", "Closed"];

const RequestDetails = ({ request, isAdmin, token, onClose, onChanged }) => {
  const [status, setStatus] = useState(request.status);
  const [assignedTo, setAssignedTo] = useState(request.assigned_to || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isClosed = request.status === "Closed";

  const handleStatusSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateRequestStatus(
        request.id,
        { status, assigned_to: assignedTo || null },
        token,
      );

      setMessage("Ticket updated successfully.");
      onChanged();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update ticket status.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (commentText) => {
    try {
      setError("");
      await addRequestComment(request.id, commentText, token);
      onChanged();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment.");
      return false;
    }
  };

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Request #{request.id}</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
          Close
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-3">
        <div className="col-md-4">
          <strong>Employee</strong>
          <div>{request.employee_name || "-"}</div>
        </div>

        <div className="col-md-4">
          <strong>Category</strong>
          <div>{request.category}</div>
        </div>

        <div className="col-md-4">
          <strong>Priority</strong>
          <div>{request.priority}</div>
        </div>

        <div className="col-12">
          <strong>Subject</strong>
          <div>{request.subject}</div>
        </div>

        <div className="col-12">
          <strong>Description</strong>
          <div>{request.description}</div>
        </div>

        <div className="col-md-4">
          <strong>Created On</strong>
          <div>{request.created_at?.slice(0, 16).replace("T", " ")}</div>
        </div>

        <div className="col-md-4">
          <strong>Last Updated</strong>
          <div>{request.updated_at?.slice(0, 16).replace("T", " ")}</div>
        </div>

        <div className="col-md-4">
          <strong>Status</strong>
          <div>{request.status}</div>
        </div>
      </div>

      {isAdmin && (
        <div className="card p-3 mt-3 bg-light">
          <h6>Update Ticket</h6>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                disabled={isClosed}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statuses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Assigned To</label>
              <input
                type="text"
                className="form-control"
                placeholder="Support person name"
                value={assignedTo}
                disabled={isClosed}
                onChange={(event) => setAssignedTo(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-primary"
              disabled={isClosed || saving}
              onClick={handleStatusSave}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {isClosed && (
              <span className="ms-3 text-muted small">
                Closed tickets cannot be edited.
              </span>
            )}
          </div>
        </div>
      )}

      <CommentSection
        comments={request.comments || []}
        onAddComment={handleAddComment}
        disabled={isClosed}
      />
    </div>
  );
};

export default RequestDetails;
