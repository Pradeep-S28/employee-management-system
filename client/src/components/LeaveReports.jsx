import { useEffect, useState } from "react";
import { getLeaveReports } from "../services/api";
import ExportButtons from "./ExportButtons";

const LeaveReports = ({ token, employees }) => {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const [filters, setFilters] = useState({
    employeeId: "",
    department: "",
    leaveType: "",
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 5,
    sortBy: "requested_on",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const departments = [
    ...new Set(employees.map((employee) => employee.department)),
  ];

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeaveReports(token, filters);

      setLeaves(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load leave reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
      page: 1,
    }));
  };

  const changePage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h3 className="mb-4">Leave Reports</h3>

        <div className="mb-4">
          <ExportButtons
            token={token}
            reportType="leaves"
            filters={{
              employeeId: filters.employeeId,
              department: filters.department,
              leaveType: filters.leaveType,
              status: filters.status,
              startDate: filters.startDate,
              endDate: filters.endDate,
              sortBy: filters.sortBy,
              order: filters.order,
            }}
          />
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <select
              name="employeeId"
              className="form-select"
              value={filters.employeeId}
              onChange={handleChange}
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              name="department"
              className="form-select"
              value={filters.department}
              onChange={handleChange}
            >
              <option value="">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              name="leaveType"
              className="form-select"
              value={filters.leaveType}
              onChange={handleChange}
            >
              <option value="">All Leave Types</option>
              <option value="Sick">Sick</option>
              <option value="Casual">Casual</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              name="status"
              className="form-select"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="col-md-3">
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="date"
              name="endDate"
              className="form-control"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading leave reports...</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Days</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No leave records found
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.full_name}</td>
                        <td>{leave.department}</td>
                        <td>{leave.leave_type}</td>
                        <td>
                          {new Date(leave.start_date).toLocaleDateString()}
                        </td>
                        <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                        <td>{leave.total_days}</td>
                        <td>{leave.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span>Total: {pagination.totalRecords}</span>

              <div className="btn-group">
                <button
                  className="btn btn-outline-primary"
                  disabled={pagination.currentPage === 1}
                  onClick={() => changePage(pagination.currentPage - 1)}
                >
                  Previous
                </button>

                <button className="btn btn-primary" disabled>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </button>

                <button
                  className="btn btn-outline-primary"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => changePage(pagination.currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveReports;
