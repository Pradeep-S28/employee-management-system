import { useEffect, useMemo, useState } from "react";
//task 5
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import { getLeaveRequests } from "../services/api";
//task 5 end
import DashboardCards from "../components/DashboardCards";
import { useAuth } from "../context/AuthContext";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeDetails from "../components/EmployeeDetails";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/api";

const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

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

  //task 5
  const [leaves, setLeaves] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  //task 5 end

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

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, [token]);

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

        {error && <div className="alert alert-danger">{error}</div>}

        <DashboardCards employees={employees} />

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
        )}

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
                onChange={(event) => setDepartmentFilter(event.target.value)}
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
      </div>
    </div>
  );
};

export default Dashboard;
