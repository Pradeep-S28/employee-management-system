import { useEffect, useMemo, useState } from "react";

// task 5
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";

// task 6
import PerformanceForm from "../components/PerformanceForm";
import PerformanceTable from "../components/PerformanceTable";
import PerformanceCharts from "../components/PerformanceCharts";

// task 7 payroll
import SalaryForm from "../components/SalaryForm";
import PayslipGenerator from "../components/PayslipGenerator";
import PayslipTable from "../components/PayslipTable";
import PayrollCharts from "../components/PayrollCharts";

// task 8
import EmployeeReports from "../components/EmployeeReports";

import {
  getLeaveRequests,
  updateLeaveStatus,
  getLeaveSummary,
  getPerformanceReviews,
  getPerformanceSummary,
} from "../services/api";

import DashboardCards from "../components/DashboardCards";
import { useAuth } from "../context/AuthContext";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeDetails from "../components/EmployeeDetails";
import ReportCharts from "../components/ReportCharts";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSalaryStructure,
  getSalaryStructure,
  generatePayslip,
  getPayslips,
  getPayslipById,
  getPayrollSummary,
} from "../services/api";

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeSection, setActiveSection] = useState("overview");

  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // task 5 leave
  const [leaves, setLeaves] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  const [leaveStatusFilter, setLeaveStatusFilter] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");

  const [leaveSummary, setLeaveSummary] = useState({
    byStatus: [],
    byType: [],
  });
  const [reportLoading, setReportLoading] = useState(false);

  // task 6 performance
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState({
    avgRatingByDepartment: [],
    ratingDistribution: [],
    reviewTrend: [],
  });
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [performanceError, setPerformanceError] = useState("");

  // task 7 payroll
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [payrollMessage, setPayrollMessage] = useState("");
  const [payrollError, setPayrollError] = useState("");
  const [selectedPayrollSalary, setSelectedPayrollSalary] = useState(null);
  const [payslipLoading, setPayslipLoading] = useState(false);
  const [payslips, setPayslips] = useState([]);
  const [payslipsLoading, setPayslipsLoading] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [employeeSalary, setEmployeeSalary] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [payrollSummaryLoading, setPayrollSummaryLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees(token);
      setEmployees(response.data);
      setError("");
    } catch (error) {
      setError("Unable to fetch employees. Please check backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      setLeaveLoading(true);
      const response = await getLeaveRequests(token);
      setLeaves(response.data);
      setLeaveError("");
    } catch (error) {
      setLeaveError("Unable to fetch leave requests.");
    } finally {
      setLeaveLoading(false);
    }
  };

  const fetchLeaveSummary = async () => {
    try {
      setReportLoading(true);
      const response = await getLeaveSummary(token);
      setLeaveSummary(response.data);
    } catch (error) {
      setLeaveSummary({
        byStatus: [],
        byType: [],
      });
    } finally {
      setReportLoading(false);
    }
  };

  const fetchPerformanceReviews = async () => {
    try {
      setPerformanceLoading(true);
      const response = await getPerformanceReviews(token);
      setPerformanceReviews(response.data);
      setPerformanceError("");
    } catch (error) {
      setPerformanceError("Unable to fetch performance reviews.");
    } finally {
      setPerformanceLoading(false);
    }
  };

  const fetchPerformanceSummary = async () => {
    if (!isAdmin) return;

    try {
      const response = await getPerformanceSummary(token);
      setPerformanceSummary(response.data);
    } catch (error) {
      setPerformanceSummary({
        avgRatingByDepartment: [],
        ratingDistribution: [],
        reviewTrend: [],
      });
    }
  };

  const handleLeaveStatusUpdate = async (leaveId, status) => {
    try {
      await updateLeaveStatus(leaveId, status, token);
      fetchLeaves();
      fetchLeaveSummary();
    } catch (error) {
      setLeaveError("Failed to update leave status.");
    }
  };

  const handlePerformanceRefresh = () => {
    fetchPerformanceReviews();
    fetchPerformanceSummary();
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchLeaveSummary();
    fetchPerformanceReviews();

    if (user?.role === "admin") {
      fetchPerformanceSummary();
    }
  }, [token, user?.role]);

  const handleSalarySubmit = async (salaryData) => {
    try {
      setSalaryLoading(true);
      setPayrollMessage("");
      setPayrollError("");

      const response = await setSalaryStructure(salaryData, token);

      setPayrollMessage(response.data.message);
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to save salary structure. Please try again.";

      setPayrollError(message);
      return false;
    } finally {
      setSalaryLoading(false);
    }
  };

  const handlePayrollEmployeeChange = async (employeeId) => {
    setSelectedPayrollSalary(null);
    setPayrollError("");

    if (!employeeId) return;

    try {
      const response = await getSalaryStructure(employeeId, token);
      setSelectedPayrollSalary(response.data);
    } catch (error) {
      setPayrollError(
        error.response?.data?.message ||
          "Salary structure not found for this employee.",
      );
    }
  };

  const handlePayslipSubmit = async (payslipData) => {
    try {
      setPayslipLoading(true);
      setPayrollMessage("");
      setPayrollError("");

      const formattedData = {
        ...payslipData,
        pay_month: new Date(`${payslipData.pay_month}-01`).toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric",
          },
        ),
      };

      const response = await generatePayslip(formattedData, token);

      setPayrollMessage(response.data.message);
      await fetchPayslips();
      await fetchPayrollSummary();
      setSelectedPayrollSalary(null);

      return true;
    } catch (error) {
      setPayrollError(
        error.response?.data?.message || "Failed to generate payslip.",
      );

      return false;
    } finally {
      setPayslipLoading(false);
    }
  };

  const fetchPayslips = async () => {
    try {
      setPayslipsLoading(true);
      setPayrollError("");

      const response = await getPayslips(token);
      setPayslips(response.data);
    } catch (error) {
      setPayrollError(
        error.response?.data?.message || "Failed to fetch payslips.",
      );
    } finally {
      setPayslipsLoading(false);
    }
  };

  const fetchEmployeeSalary = async () => {
    if (isAdmin || !user?.employee_id) return;

    try {
      setPayrollError("");

      const response = await getSalaryStructure(user.employee_id, token);

      setEmployeeSalary(response.data);
    } catch (error) {
      setEmployeeSalary(null);

      if (error.response?.status !== 404) {
        setPayrollError(
          error.response?.data?.message || "Failed to fetch salary structure.",
        );
      }
    }
  };

  const fetchPayrollSummary = async () => {
    if (!isAdmin) return;

    try {
      setPayrollSummaryLoading(true);
      setPayrollError("");

      const response = await getPayrollSummary(token);
      setPayrollSummary(response.data);
    } catch (error) {
      setPayrollError(
        error.response?.data?.message || "Failed to fetch payroll summary.",
      );
    } finally {
      setPayrollSummaryLoading(false);
    }
  };

  const handlePayslipRowClick = async (payslipId) => {
    try {
      setPayrollError("");

      const response = await getPayslipById(payslipId, token);
      setSelectedPayslip(response.data);
    } catch (error) {
      setPayrollError(
        error.response?.data?.message || "Failed to fetch payslip details.",
      );
    }
  };

  const handleSubmit = async (employeeData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData, token);
        setEditingEmployee(null);
      } else {
        await addEmployee(employeeData, token);
      }

      fetchEmployees();
      setShowForm(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id, token);
      fetchEmployees();
    } catch (error) {
      setError("Failed to delete employee.");
    }
  };

  const departments = useMemo(() => {
    return [...new Set(employees.map((employee) => employee.department))];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    let data = [...employees];

    if (searchText) {
      data = data.filter(
        (employee) =>
          employee.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (statusFilter) {
      data = data.filter((employee) => employee.status === statusFilter);
    }

    if (departmentFilter) {
      data = data.filter(
        (employee) => employee.department === departmentFilter,
      );
    }

    data.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date_of_joining) - new Date(a.date_of_joining);
      }

      return new Date(a.date_of_joining) - new Date(b.date_of_joining);
    });

    return data;
  }, [employees, searchText, statusFilter, departmentFilter, sortOrder]);

  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  const filteredLeaves = useMemo(() => {
    let data = [...leaves];

    if (leaveStatusFilter) {
      data = data.filter((leave) => leave.status === leaveStatusFilter);
    }

    if (leaveTypeFilter) {
      data = data.filter((leave) => leave.leave_type === leaveTypeFilter);
    }

    return data;
  }, [leaves, leaveStatusFilter, leaveTypeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, departmentFilter, sortOrder]);

  return (
    <div className="app-bg">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Employee Management System</h2>
            <p className="mb-0 text-muted">
              Logged in as: <strong>{user?.username}</strong> ({user?.role})
            </p>
          </div>

          <button className="btn btn-outline-danger" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn ${
                  activeSection === "overview"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveSection("overview")}
              >
                Overview
              </button>

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "employees"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveSection("employees")}
                >
                  Employees
                </button>
              )}

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "employeeReports"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveSection("employeeReports")}
                >
                  Employee Reports
                </button>
              )}

              <button
                className={`btn ${
                  activeSection === "leaves"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveSection("leaves")}
              >
                Leave Management
              </button>

              <button
                className={`btn ${
                  activeSection === "performance"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setActiveSection("performance")}
              >
                Performance
              </button>

              <button
                className={`btn ${
                  activeSection === "payroll"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveSection("payroll");
                  setPayrollMessage("");
                  setPayrollError("");
                  setSelectedPayslip(null);
                  fetchPayslips();
                  fetchEmployeeSalary();
                  fetchPayrollSummary();
                }}
              >
                Payroll
              </button>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {activeSection === "overview" && (
          <>
            <DashboardCards employees={employees} />

            {isAdmin && (
              <ReportCharts
                employees={employees}
                leaveSummary={leaveSummary}
                loading={reportLoading}
              />
            )}

            {!isAdmin && (
              <div className="alert alert-info">
                Use the Leave Management and Performance sections to submit and
                view your requests.
              </div>
            )}
          </>
        )}

        {activeSection === "employeeReports" && isAdmin && (
          <EmployeeReports token={token} />
        )}

        {activeSection === "leaves" && (
          <>
            {!isAdmin && (
              <div className="mb-4">
                {leaveError && (
                  <div className="alert alert-danger">{leaveError}</div>
                )}

                <LeaveForm token={token} onLeaveSubmitted={fetchLeaves} />

                <LeaveTable leaves={leaves} loading={leaveLoading} />
              </div>
            )}

            {isAdmin && (
              <div className="mb-4">
                {leaveError && (
                  <div className="alert alert-danger">{leaveError}</div>
                )}

                <LeaveTable
                  leaves={filteredLeaves}
                  loading={leaveLoading}
                  isAdmin={true}
                  onStatusUpdate={handleLeaveStatusUpdate}
                  statusFilter={leaveStatusFilter}
                  setStatusFilter={setLeaveStatusFilter}
                  typeFilter={leaveTypeFilter}
                  setTypeFilter={setLeaveTypeFilter}
                />
              </div>
            )}
          </>
        )}

        {activeSection === "performance" && (
          <div className="mb-4">
            {performanceError && (
              <div className="alert alert-danger">{performanceError}</div>
            )}

            {isAdmin && <PerformanceCharts summary={performanceSummary} />}

            {!isAdmin && (
              <PerformanceForm
                token={token}
                onReviewSubmitted={handlePerformanceRefresh}
              />
            )}

            {performanceLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading performance reviews...</p>
              </div>
            ) : (
              <PerformanceTable
                reviews={performanceReviews}
                role={user?.role}
                token={token}
                onReviewUpdated={handlePerformanceRefresh}
              />
            )}
          </div>
        )}

        {activeSection === "payroll" && (
          <div className="mb-4">
            {payrollMessage && (
              <div className="alert alert-success">{payrollMessage}</div>
            )}

            {payrollError && (
              <div className="alert alert-danger">{payrollError}</div>
            )}

            {isAdmin ? (
              <>
                {payrollSummaryLoading ? (
                  <div className="text-center my-4">
                    Loading payroll analytics...
                  </div>
                ) : (
                  payrollSummary && <PayrollCharts summary={payrollSummary} />
                )}

                <SalaryForm
                  employees={employees}
                  onSubmit={handleSalarySubmit}
                  loading={salaryLoading}
                />

                <PayslipGenerator
                  employees={employees}
                  selectedSalary={selectedPayrollSalary}
                  onEmployeeChange={handlePayrollEmployeeChange}
                  onSubmit={handlePayslipSubmit}
                  loading={payslipLoading}
                />
              </>
            ) : (
              <div className="alert alert-info">
                Your salary structure and payslip history will appear here.
              </div>
            )}
          </div>
        )}

        {payslipsLoading ? (
          <div className="text-center my-4">Loading payslips...</div>
        ) : (
          <PayslipTable
            payslips={payslips}
            onRowClick={handlePayslipRowClick}
            isAdmin={isAdmin}
          />
        )}

        {selectedPayslip && (
          <div className="card p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Payslip Details</h5>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedPayslip(null)}
              >
                Close
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <strong>Employee</strong>
                <div>{selectedPayslip.full_name}</div>
              </div>

              <div className="col-md-4">
                <strong>Department</strong>
                <div>{selectedPayslip.department}</div>
              </div>

              <div className="col-md-4">
                <strong>Pay Month</strong>
                <div>{selectedPayslip.pay_month}</div>
              </div>

              <div className="col-md-4">
                <strong>Basic Salary</strong>
                <div>
                  ₹
                  {Number(selectedPayslip.basic_salary).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="col-md-4">
                <strong>HRA</strong>
                <div>
                  ₹{Number(selectedPayslip.hra).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="col-md-4">
                <strong>Allowances</strong>
                <div>
                  ₹{Number(selectedPayslip.allowances).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="col-md-4">
                <strong>Deductions</strong>
                <div>
                  ₹{Number(selectedPayslip.deductions).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="col-md-4">
                <strong>Leave Deductions</strong>
                <div>
                  ₹
                  {Number(selectedPayslip.leave_deductions).toLocaleString(
                    "en-IN",
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <strong>Final Amount</strong>
                <div>
                  ₹
                  {Number(selectedPayslip.final_amount_paid).toLocaleString(
                    "en-IN",
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "employees" && isAdmin && (
          <>
            <div className="mb-3">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowForm(true);
                  setEditingEmployee(null);
                }}
              >
                Add Employee
              </button>
            </div>

            {showForm && (
              <EmployeeForm
                onSubmit={handleSubmit}
                editingEmployee={editingEmployee}
                onCancel={() => {
                  setShowForm(false);
                  setEditingEmployee(null);
                }}
              />
            )}

            <div className="card p-3 mb-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search name or department"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={departmentFilter}
                    onChange={(event) =>
                      setDepartmentFilter(event.target.value)
                    }
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
                    className="form-select"
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                  >
                    <option value="newest">Newest Joining First</option>
                    <option value="oldest">Oldest Joining First</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading employees...</p>
              </div>
            ) : (
              <EmployeeTable
                employees={paginatedEmployees}
                onEdit={(employee) => {
                  setEditingEmployee(employee);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onView={setSelectedEmployee}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                isAdmin={isAdmin}
              />
            )}

            <EmployeeDetails
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
