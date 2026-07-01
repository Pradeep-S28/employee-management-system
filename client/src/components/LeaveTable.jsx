const LeaveTable = ({
  leaves,
  loading,
  isAdmin = false,
  onStatusUpdate,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) => {
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") return "badge bg-success";
    if (status === "Rejected") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  const handleStatusClick = (leaveId, status) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this leave request?`,
    );

    if (!confirmUpdate) return;

    onStatusUpdate(leaveId, status);
  };

  if (loading) {
    return <p>Loading leave requests...</p>;
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">
          {isAdmin ? "All Leave Requests" : "My Leave Requests"}
        </h5>

        {isAdmin && (
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Leave Types</option>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
        )}

        {leaves.length === 0 ? (
          <p className="text-muted mb-0">No leave requests found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  {isAdmin && <th>Employee</th>}
                  {isAdmin && <th>Department</th>}
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Requested On</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    {isAdmin && <td>{leave.full_name}</td>}
                    {isAdmin && <td>{leave.department}</td>}
                    <td>{leave.leave_type}</td>
                    <td>{formatDate(leave.start_date)}</td>
                    <td>{formatDate(leave.end_date)}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={getStatusBadge(leave.status)}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{formatDate(leave.requested_on)}</td>
                    {isAdmin && (
                      <td>
                        {leave.status === "Pending" ? (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                handleStatusClick(leave.id, "Approved")
                              }
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleStatusClick(leave.id, "Rejected")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">Completed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveTable;
