// Supporting table for the Recruitment module's job openings list.
// Mirrors the AssetTable/ServiceRequestTable pattern used elsewhere.
const statusBadgeClass = {
  Open: "bg-success",
  Closed: "bg-secondary",
};

const JobTable = ({
  jobs,
  onEdit,
  onDelete,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="card p-3 mb-4">
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search job title or location"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Job Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Type</th>
              <th>Openings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No job openings found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.job_title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>{job.employment_type}</td>
                  <td>{job.number_of_openings}</td>
                  <td>
                    <span
                      className={`badge ${
                        statusBadgeClass[job.status] || "bg-secondary"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => onEdit(job)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(job.id)}
                      >
                        Delete
                      </button>
                    </div>
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

export default JobTable;
