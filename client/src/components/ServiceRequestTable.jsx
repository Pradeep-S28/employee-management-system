const statusBadgeClass = {
  Open: "bg-secondary",
  Assigned: "bg-info text-dark",
  "In Progress": "bg-primary",
  Resolved: "bg-success",
  Closed: "bg-dark",
};

const priorityBadgeClass = {
  Low: "bg-success",
  Medium: "bg-warning text-dark",
  High: "bg-danger",
};

const ServiceRequestTable = ({
  requests,
  isAdmin,
  onView,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="card p-3 mb-4">
      {isAdmin && (
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">All Categories</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Payroll">Payroll</option>
              <option value="Administration">Administration</option>
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              {isAdmin && <th>Employee</th>}
              <th>Category</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="text-center">
                  No service requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  {isAdmin && (
                    <td>
                      {request.employee_name}
                      <div className="text-muted small">
                        {request.department}
                      </div>
                    </td>
                  )}
                  <td>{request.category}</td>
                  <td>{request.subject}</td>
                  <td>
                    <span
                      className={`badge ${
                        priorityBadgeClass[request.priority] || "bg-secondary"
                      }`}
                    >
                      {request.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        statusBadgeClass[request.status] || "bg-secondary"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{request.assigned_to || "-"}</td>
                  <td>{request.created_at?.slice(0, 10)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onView(request.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRequestTable;
