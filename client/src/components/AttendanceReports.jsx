import { useEffect, useState } from "react";
import { getAttendanceReports } from "../services/api";
import ExportButtons from "./ExportButtons";

const AttendanceReports = ({ token, employees }) => {
  const [attendance, setAttendance] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const [filters, setFilters] = useState({
    employeeId: "",
    department: "",
    month: "",
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 5,
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

      const response = await getAttendanceReports(token, filters);

      setAttendance(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load attendance reports",
      );
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
        <h3 className="mb-4">Attendance Reports</h3>

        <div className="mb-4">
          <ExportButtons
            token={token}
            reportType="attendance"
            filters={{
              employeeId: filters.employeeId,
              department: filters.department,
              month: filters.month,
              status: filters.status,
              startDate: filters.startDate,
              endDate: filters.endDate,
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
            <input
              type="month"
              name="month"
              className="form-control"
              value={filters.month}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              name="status"
              className="form-select"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Half Day">Half Day</option>
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
          <p>Loading attendance reports...</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((item) => (
                      <tr key={item.id}>
                        <td>{item.full_name}</td>
                        <td>{item.department}</td>
                        <td>
                          {new Date(item.attendance_date).toLocaleDateString()}
                        </td>
                        <td>{item.status}</td>
                        <td>{item.check_in || "-"}</td>
                        <td>{item.check_out || "-"}</td>
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

export default AttendanceReports;
