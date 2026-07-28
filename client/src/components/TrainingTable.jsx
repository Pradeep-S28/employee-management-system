// Lists training programs. Mirrors the JobTable/AssetTable pattern used
// elsewhere in the app.
const statusBadgeClass = {
  Upcoming: "bg-info text-dark",
  Ongoing: "bg-primary",
  Completed: "bg-success",
};

const TrainingTable = ({
  programs,
  isAdmin,
  onEdit,
  onDelete,
  onAssign,
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
            placeholder="Search training title"
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
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Duration (Hrs)</th>
              <th>Trainer</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="text-center">
                  No training programs found
                </td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.training_title}</td>
                  <td>{program.category}</td>
                  <td>{program.duration_hours}</td>
                  <td>{program.trainer_name}</td>
                  <td>{program.start_date?.slice(0, 10)}</td>
                  <td>{program.end_date?.slice(0, 10)}</td>
                  <td>
                    <span
                      className={`badge ${
                        statusBadgeClass[program.status] || "bg-secondary"
                      }`}
                    >
                      {program.status}
                    </span>
                  </td>

                  {isAdmin && (
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => onAssign(program)}
                        >
                          Assign
                        </button>

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => onEdit(program)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(program.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingTable;
