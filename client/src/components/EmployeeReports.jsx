import { useEffect, useState } from "react";
import { getEmployeeReports } from "../services/api";
import ExportButtons from "./ExportButtons";

const EmployeeReports = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
    page: 1,
    limit: 5,
    sortBy: "id",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployeeReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEmployeeReports(token, filters);

      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Failed to fetch employee reports:", err);

      setError(
        err.response?.data?.message || "Failed to load employee reports",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeReports();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
      page: 1,
    }));
  };

  const handleSort = (field) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      sortBy: field,
      order:
        previousFilters.sortBy === field && previousFilters.order === "asc"
          ? "desc"
          : "asc",
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    setFilters((previousFilters) => ({
      ...previousFilters,
      page,
    }));
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-4">Employee Reports</h3>

          <div className="mb-4">
            <ExportButtons
              token={token}
              reportType="employees"
              filters={{
                search: filters.search,
                department: filters.department,
                status: filters.status,
                sortBy: filters.sortBy,
                order: filters.order,
              }}
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <input
                type="text"
                name="search"
                className="form-control"
                placeholder="Search by name, department or designation"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <select
                name="department"
                className="form-select"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <p>Loading employee reports...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th role="button" onClick={() => handleSort("id")}>
                        ID
                      </th>

                      <th role="button" onClick={() => handleSort("full_name")}>
                        Full Name
                      </th>

                      <th>Email</th>

                      <th
                        role="button"
                        onClick={() => handleSort("department")}
                      >
                        Department
                      </th>

                      <th
                        role="button"
                        onClick={() => handleSort("designation")}
                      >
                        Designation
                      </th>

                      <th
                        role="button"
                        onClick={() => handleSort("date_of_joining")}
                      >
                        Date of Joining
                      </th>

                      <th role="button" onClick={() => handleSort("status")}>
                        Status
                      </th>
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
                        <tr key={employee.id}>
                          <td>{employee.id}</td>
                          <td>{employee.full_name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.department}</td>
                          <td>{employee.designation}</td>
                          <td>
                            {new Date(
                              employee.date_of_joining,
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                employee.status === "Active"
                                  ? "bg-success"
                                  : employee.status === "Inactive"
                                    ? "bg-secondary"
                                    : "bg-warning text-dark"
                              }`}
                            >
                              {employee.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
                <p className="mb-0">Total records: {pagination.totalRecords}</p>

                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Previous
                  </button>

                  <button className="btn btn-primary" disabled>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </button>

                  <button
                    className="btn btn-outline-primary"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeReports;
