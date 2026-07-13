import { useEffect, useState } from "react";
import { getPayrollReports } from "../services/api";
import ExportButtons from "./ExportButtons";

const PayrollReports = ({ token, employees }) => {
  const [payroll, setPayroll] = useState([]);
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
    page: 1,
    limit: 5,
    sortBy: "generated_on",
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

      const response = await getPayrollReports(token, filters);

      setPayroll(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load payroll reports",
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
        <h3 className="mb-4">Payroll Reports</h3>

        <div className="mb-4">
          <ExportButtons
            token={token}
            reportType="payroll"
            filters={{
              employeeId: filters.employeeId,
              department: filters.department,
              month: filters.month,
              status: filters.status,
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
            <input
              type="text"
              name="month"
              className="form-control"
              placeholder="Example: July 2026"
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
              <option value="Generated">Generated</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading payroll reports...</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Pay Month</th>
                    <th>Days Worked</th>
                    <th>Leave Deduction</th>
                    <th>Final Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payroll.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No payroll records found
                      </td>
                    </tr>
                  ) : (
                    payroll.map((item) => (
                      <tr key={item.id}>
                        <td>{item.full_name}</td>
                        <td>{item.department}</td>
                        <td>{item.pay_month}</td>
                        <td>{item.days_worked}</td>
                        <td>
                          ₹
                          {Number(item.leave_deductions).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                        <td>
                          ₹
                          {Number(item.final_amount_paid).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                        <td>{item.status}</td>
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

export default PayrollReports;
