import { useState } from "react";

const CommentSection = ({ comments = [], onAddComment, disabled }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setError("");
    const success = await onAddComment(commentText.trim());

    if (success) {
      setCommentText("");
    }
  };

  return (
    <div className="mt-3">
      <h6>Comments</h6>

      {comments.length === 0 ? (
        <p className="text-muted">No comments yet.</p>
      ) : (
        <ul className="list-group mb-3">
          {comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>
                  {comment.username}{" "}
                  <span className="text-muted small">({comment.role})</span>
                </strong>
                <span className="text-muted small">
                  {comment.commented_on?.slice(0, 16).replace("T", " ")}
                </span>
              </div>
              <div>{comment.comment}</div>
            </li>
          ))}
        </ul>
      )}

      {!disabled && (
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="2"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            ></textarea>
            {error && <small className="text-danger">{error}</small>}
          </div>

          <button className="btn btn-sm btn-primary" type="submit">
            Add Comment
          </button>
        </form>
      )}

      {disabled && (
        <div className="alert alert-secondary py-2">
          This ticket is closed. No further comments can be added.
        </div>
      )}
    </div>
  );
};

export default CommentSection;
