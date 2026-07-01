const LeaveTable = ({ leaves, loading }) => {
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") return "badge bg-success";
    if (status === "Rejected") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  if (loading) {
    return <p>Loading leave requests...</p>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">My Leave Requests</h5>

        {leaves.length === 0 ? (
          <p className="text-muted mb-0">No leave requests found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Requested On</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
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
