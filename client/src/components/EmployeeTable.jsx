const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Date of Joining</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} onClick={() => onView(employee)}>
                  <td>{employee.id}</td>
                  <td>{employee.full_name}</td>
                  <td>{employee.department}</td>
                  <td>{employee.designation}</td>
                  <td>
                    <span className="badge bg-primary">{employee.status}</span>
                  </td>
                  <td>{employee.date_of_joining?.slice(0, 10)}</td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => onEdit(employee)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default EmployeeTable;
