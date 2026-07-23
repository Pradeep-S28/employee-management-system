const statusBadgeClass = {
  Applied: "bg-secondary",
  Shortlisted: "bg-info text-dark",
  Interviewed: "bg-primary",
  Selected: "bg-warning text-dark",
  Rejected: "bg-danger",
  Hired: "bg-success",
};

const CandidateTable = ({
  candidates,
  jobs,
  onView,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  jobFilter,
  setJobFilter,
}) => {
  return (
    <div className="card p-3 mb-4">
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search name or email"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
          >
            <option value="">All Job Openings</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_title}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Applied Position</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No candidate applications found
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.full_name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone_number}</td>
                  <td>{candidate.job_title}</td>
                  <td>
                    <span
                      className={`badge ${
                        statusBadgeClass[candidate.application_status] ||
                        "bg-secondary"
                      }`}
                    >
                      {candidate.application_status}
                    </span>
                  </td>
                  <td>{candidate.applied_date?.slice(0, 10)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onView(candidate.id)}
                    >
                      View / Update
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

export default CandidateTable;
