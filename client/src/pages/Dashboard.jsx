import { useEffect, useMemo, useState } from "react";

// task 5
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";

// task 9: performance appraisal module (replaces task 6
import PerformanceReviewForm from "../components/PerformanceReviewForm";
import PerformanceReviewTable from "../components/PerformanceReviewTable";
import PerformanceDashboard from "../components/PerformanceDashboard";

// task 7 payroll
import SalaryForm from "../components/SalaryForm";
import PayslipGenerator from "../components/PayslipGenerator";
import PayslipTable from "../components/PayslipTable";
import PayrollCharts from "../components/PayrollCharts";

// task 8
import EmployeeReports from "../components/EmployeeReports";
import DashboardReports from "../components/DashboardReports";
import LeaveReports from "../components/LeaveReports";
import PayrollReports from "../components/PayrollReports";
import AttendanceReports from "../components/AttendanceReports";

// task 10 asset management
import AssetForm from "../components/AssetForm";
import AssetTable from "../components/AssetTable";
import AssetAssignment, {
  AssignAssetForm,
} from "../components/AssetAssignment";
import AssetDashboard from "../components/AssetDashboard";

// task 11 help desk & service requests
import ServiceRequestForm from "../components/ServiceRequestForm";
import ServiceRequestTable from "../components/ServiceRequestTable";
import RequestDetails from "../components/RequestDetails";
import HelpDeskDashboard from "../components/HelpDeskDashboard";

// task 12 recruitment & employee onboarding
import JobOpeningForm from "../components/JobOpeningForm";
import JobTable from "../components/JobTable";
import CandidateTable from "../components/CandidateTable";
import CandidateDetails from "../components/CandidateDetails";
import OnboardingTaskForm from "../components/OnboardingTaskForm";
import OnboardingTaskTable from "../components/OnboardingTaskTable";
import RecruitmentDashboard from "../components/RecruitmentDashboard";

import {
  getLeaveRequests,
  updateLeaveStatus,
  getLeaveSummary,
  getPerformanceReviews,
  getPerformanceDashboard,
  getAssets,
  addAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  returnAsset,
  getAssetAssignments,
  getAssetDashboard,
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  getHelpDeskDashboard,
  getJobs,
  addJob,
  updateJob,
  deleteJob,
  getCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  getRecruitmentDashboard,
  getOnboardingTasks,
  addOnboardingTask,
  updateOnboardingTask,
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
  const isManager = user?.role === "manager";
  const isReviewer = isAdmin || isManager;

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

  // task 9 performance appraisals
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [performanceDashboard, setPerformanceDashboard] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [performanceDashboardLoading, setPerformanceDashboardLoading] =
    useState(false);
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

  // task 10 asset management
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetError, setAssetError] = useState("");
  const [assetMessage, setAssetMessage] = useState("");
  const [editingAsset, setEditingAsset] = useState(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [assetSearchText, setAssetSearchText] = useState("");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("");
  const [assetStatusFilter, setAssetStatusFilter] = useState("");
  const [assetToAssign, setAssetToAssign] = useState(null);

  const [assetAssignments, setAssetAssignments] = useState([]);
  const [assetAssignmentsLoading, setAssetAssignmentsLoading] = useState(false);

  const [assetDashboard, setAssetDashboard] = useState(null);
  const [assetDashboardLoading, setAssetDashboardLoading] = useState(false);

  // task 11 help desk & service requests
  const [helpDeskRequests, setHelpDeskRequests] = useState([]);
  const [helpDeskLoading, setHelpDeskLoading] = useState(false);
  const [helpDeskError, setHelpDeskError] = useState("");
  const [helpDeskMessage, setHelpDeskMessage] = useState("");

  const [hdCategoryFilter, setHdCategoryFilter] = useState("");
  const [hdPriorityFilter, setHdPriorityFilter] = useState("");
  const [hdStatusFilter, setHdStatusFilter] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestLoading, setSelectedRequestLoading] = useState(false);

  const [helpDeskDashboard, setHelpDeskDashboard] = useState(null);
  const [helpDeskDashboardLoading, setHelpDeskDashboardLoading] =
    useState(false);

  // task 12 recruitment & employee onboarding
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobError, setJobError] = useState("");
  const [jobMessage, setJobMessage] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobSearchText, setJobSearchText] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidateError, setCandidateError] = useState("");
  const [candidateMessage, setCandidateMessage] = useState("");
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSearchText, setCandidateSearchText] = useState("");
  const [candidateStatusFilter, setCandidateStatusFilter] = useState("");
  const [candidateJobFilter, setCandidateJobFilter] = useState("");

  const [recruitmentDashboard, setRecruitmentDashboard] = useState(null);
  const [recruitmentDashboardLoading, setRecruitmentDashboardLoading] =
    useState(false);

  const [onboardingTasks, setOnboardingTasks] = useState([]);
  const [onboardingTasksLoading, setOnboardingTasksLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");
  const [onboardingMessage, setOnboardingMessage] = useState("");

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

  const fetchPerformanceDashboard = async () => {
    if (!isReviewer) return;

    try {
      setPerformanceDashboardLoading(true);
      const response = await getPerformanceDashboard(token);
      setPerformanceDashboard(response.data);
    } catch (error) {
      setPerformanceDashboard(null);
    } finally {
      setPerformanceDashboardLoading(false);
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
    fetchPerformanceDashboard();
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchLeaveSummary();
    fetchPerformanceReviews();

    if (user?.role === "admin" || user?.role === "manager") {
      fetchPerformanceDashboard();
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

  // task 10 asset management

  const fetchAssets = async () => {
    try {
      setAssetsLoading(true);
      setAssetError("");

      const params = {};
      if (assetSearchText) params.search = assetSearchText;
      if (assetCategoryFilter) params.category = assetCategoryFilter;
      if (assetStatusFilter) params.status = assetStatusFilter;

      const response = await getAssets(token, params);
      setAssets(response.data);
    } catch (error) {
      setAssetError(error.response?.data?.message || "Unable to fetch assets.");
    } finally {
      setAssetsLoading(false);
    }
  };

  const fetchAssetAssignments = async () => {
    try {
      setAssetAssignmentsLoading(true);
      const response = await getAssetAssignments(token);
      setAssetAssignments(response.data);
    } catch (error) {
      setAssetError(
        error.response?.data?.message || "Unable to fetch assignment history.",
      );
    } finally {
      setAssetAssignmentsLoading(false);
    }
  };

  const fetchAssetDashboard = async () => {
    if (!isAdmin) return;

    try {
      setAssetDashboardLoading(true);
      const response = await getAssetDashboard(token);
      setAssetDashboard(response.data);
    } catch (error) {
      setAssetDashboard(null);
    } finally {
      setAssetDashboardLoading(false);
    }
  };

  const refreshAssetSection = () => {
    if (isAdmin) fetchAssets();
    fetchAssetAssignments();
    fetchAssetDashboard();
  };

  const handleAssetSubmit = async (assetData) => {
    try {
      setAssetError("");
      setAssetMessage("");

      if (editingAsset) {
        await updateAsset(editingAsset.id, assetData, token);
        setAssetMessage("Asset updated successfully.");
        setEditingAsset(null);
      } else {
        await addAsset(assetData, token);
        setAssetMessage("Asset added successfully.");
      }

      setShowAssetForm(false);
      refreshAssetSection();
    } catch (error) {
      setAssetError(error.response?.data?.message || "Failed to save asset.");
    }
  };

  const handleAssetDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this asset?",
    );

    if (!confirmDelete) return;

    try {
      setAssetError("");
      await deleteAsset(id, token);
      setAssetMessage("Asset deleted successfully.");
      refreshAssetSection();
    } catch (error) {
      setAssetError(error.response?.data?.message || "Failed to delete asset.");
    }
  };

  const handleAssetAssign = async (assignmentData) => {
    try {
      setAssetError("");
      await assignAsset(assignmentData, token);
      setAssetMessage("Asset assigned successfully.");
      setAssetToAssign(null);
      refreshAssetSection();
    } catch (error) {
      setAssetError(error.response?.data?.message || "Failed to assign asset.");
    }
  };

  const handleAssetReturn = async (assignment, assignment_status) => {
    const confirmMessage =
      assignment_status === "Lost"
        ? "Mark this asset as lost?"
        : "Confirm this asset has been returned?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setAssetError("");
      await returnAsset(
        {
          assignment_id: assignment.id,
          actual_return_date: new Date().toISOString().slice(0, 10),
          assignment_status,
        },
        token,
      );
      setAssetMessage(
        assignment_status === "Lost"
          ? "Asset marked as lost."
          : "Asset returned successfully.",
      );
      refreshAssetSection();
    } catch (error) {
      setAssetError(
        error.response?.data?.message || "Failed to process return.",
      );
    }
  };

  const assetCategories = useMemo(() => {
    return [...new Set(assets.map((asset) => asset.asset_category))];
  }, [assets]);

  // task 11 help desk & service requests

  const fetchHelpDeskRequests = async () => {
    try {
      setHelpDeskLoading(true);
      setHelpDeskError("");

      const params = {};
      if (isAdmin && hdCategoryFilter) params.category = hdCategoryFilter;
      if (isAdmin && hdPriorityFilter) params.priority = hdPriorityFilter;
      if (isAdmin && hdStatusFilter) params.status = hdStatusFilter;

      const response = await getServiceRequests(token, params);
      setHelpDeskRequests(response.data);
    } catch (error) {
      setHelpDeskError(
        error.response?.data?.message || "Unable to fetch service requests.",
      );
    } finally {
      setHelpDeskLoading(false);
    }
  };

  const fetchHelpDeskDashboard = async () => {
    if (!isAdmin) return;

    try {
      setHelpDeskDashboardLoading(true);
      const response = await getHelpDeskDashboard(token);
      setHelpDeskDashboard(response.data);
    } catch (error) {
      setHelpDeskDashboard(null);
    } finally {
      setHelpDeskDashboardLoading(false);
    }
  };

  const refreshHelpDeskSection = () => {
    fetchHelpDeskRequests();
    fetchHelpDeskDashboard();
  };

  const handleServiceRequestSubmit = async (requestData) => {
    try {
      setHelpDeskError("");
      setHelpDeskMessage("");

      await createServiceRequest(requestData, token);

      setHelpDeskMessage("Service request submitted successfully.");
      refreshHelpDeskSection();
      return true;
    } catch (error) {
      setHelpDeskError(
        error.response?.data?.message || "Failed to submit service request.",
      );
      return false;
    }
  };

  const handleViewRequest = async (id) => {
    try {
      setSelectedRequestLoading(true);
      setHelpDeskError("");

      const response = await getServiceRequestById(id, token);
      setSelectedRequest(response.data);
    } catch (error) {
      setHelpDeskError(
        error.response?.data?.message || "Failed to fetch request details.",
      );
    } finally {
      setSelectedRequestLoading(false);
    }
  };

  const handleRequestChanged = () => {
    handleViewRequest(selectedRequest.id);
    fetchHelpDeskRequests();
    fetchHelpDeskDashboard();
  };

  // task 12 recruitment & employee onboarding

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      setJobError("");

      const params = {};
      if (jobSearchText) params.search = jobSearchText;
      if (jobStatusFilter) params.status = jobStatusFilter;

      const response = await getJobs(token, params);
      setJobs(response.data);
    } catch (error) {
      setJobError(
        error.response?.data?.message || "Unable to fetch job openings.",
      );
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      setCandidatesLoading(true);
      setCandidateError("");

      const params = {};
      if (candidateSearchText) params.search = candidateSearchText;
      if (candidateStatusFilter) params.status = candidateStatusFilter;
      if (candidateJobFilter) params.job_id = candidateJobFilter;

      const response = await getCandidates(token, params);
      setCandidates(response.data);
    } catch (error) {
      setCandidateError(
        error.response?.data?.message || "Unable to fetch candidates.",
      );
    } finally {
      setCandidatesLoading(false);
    }
  };

  const fetchRecruitmentDashboard = async () => {
    if (!isAdmin) return;

    try {
      setRecruitmentDashboardLoading(true);
      const response = await getRecruitmentDashboard(token);
      setRecruitmentDashboard(response.data);
    } catch (error) {
      setRecruitmentDashboard(null);
    } finally {
      setRecruitmentDashboardLoading(false);
    }
  };

  const refreshRecruitmentSection = () => {
    fetchJobs();
    fetchCandidates();
    fetchRecruitmentDashboard();
  };

  const handleJobSubmit = async (jobData) => {
    try {
      setJobError("");
      setJobMessage("");

      if (editingJob) {
        await updateJob(editingJob.id, jobData, token);
        setJobMessage("Job opening updated successfully.");
        setEditingJob(null);
      } else {
        await addJob(jobData, token);
        setJobMessage("Job opening added successfully.");
      }

      setShowJobForm(false);
      refreshRecruitmentSection();
    } catch (error) {
      setJobError(
        error.response?.data?.message || "Failed to save job opening.",
      );
    }
  };

  const handleJobDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job opening?",
    );

    if (!confirmDelete) return;

    try {
      setJobError("");
      await deleteJob(id, token);
      setJobMessage("Job opening deleted successfully.");
      refreshRecruitmentSection();
    } catch (error) {
      setJobError(
        error.response?.data?.message || "Failed to delete job opening.",
      );
    }
  };

  const handleAddCandidate = async (candidateData) => {
    try {
      setCandidateError("");
      setCandidateMessage("");

      await addCandidate(candidateData, token);

      setCandidateMessage("Candidate application added successfully.");
      setShowCandidateForm(false);
      refreshRecruitmentSection();
      return true;
    } catch (error) {
      setCandidateError(
        error.response?.data?.message || "Failed to add candidate.",
      );
      return false;
    }
  };

  const handleViewCandidate = async (id) => {
    try {
      setCandidateError("");
      const response = await getCandidateById(id, token);
      setSelectedCandidate(response.data);
      setShowCandidateForm(false);
    } catch (error) {
      setCandidateError(
        error.response?.data?.message || "Failed to fetch candidate details.",
      );
    }
  };

  const handleUpdateCandidateStatus = async (id, candidateData) => {
    try {
      setCandidateError("");
      setCandidateMessage("");

      await updateCandidate(id, candidateData, token);

      setCandidateMessage(
        candidateData.application_status === "Hired"
          ? "Candidate hired and converted into an employee record."
          : "Candidate updated successfully.",
      );

      await handleViewCandidate(id);
      fetchCandidates();
      fetchRecruitmentDashboard();
      fetchEmployees();
    } catch (error) {
      setCandidateError(
        error.response?.data?.message || "Failed to update candidate.",
      );
    }
  };

  // task 12 onboarding tasks

  const fetchOnboardingTasks = async () => {
    try {
      setOnboardingTasksLoading(true);
      setOnboardingError("");

      const response = await getOnboardingTasks(token);
      setOnboardingTasks(response.data);
    } catch (error) {
      setOnboardingError(
        error.response?.data?.message || "Unable to fetch onboarding tasks.",
      );
    } finally {
      setOnboardingTasksLoading(false);
    }
  };

  const handleAssignTask = async (taskData) => {
    try {
      setOnboardingError("");
      setOnboardingMessage("");

      await addOnboardingTask(taskData, token);

      setOnboardingMessage("Onboarding task assigned successfully.");
      fetchOnboardingTasks();
      fetchRecruitmentDashboard();
      return true;
    } catch (error) {
      setOnboardingError(
        error.response?.data?.message || "Failed to assign onboarding task.",
      );
      return false;
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      setOnboardingError("");
      await updateOnboardingTask(id, { status: "Completed" }, token);
      setOnboardingMessage("Task marked as completed.");
      fetchOnboardingTasks();
      fetchRecruitmentDashboard();
    } catch (error) {
      setOnboardingError(
        error.response?.data?.message || "Failed to update task status.",
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

  useEffect(() => {
    if (isAdmin) {
      fetchAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSearchText, assetCategoryFilter, assetStatusFilter, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchHelpDeskRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hdCategoryFilter, hdPriorityFilter, hdStatusFilter, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobSearchText, jobStatusFilter, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchCandidates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateSearchText, candidateStatusFilter, candidateJobFilter, isAdmin]);

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

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "reportsDashboard"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveSection("reportsDashboard")}
                >
                  Reports Dashboard
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

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "leaveReports"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveSection("leaveReports")}
                >
                  Leave Reports
                </button>
              )}

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "payrollReports"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveSection("payrollReports")}
                >
                  Payroll Reports
                </button>
              )}

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

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "attendanceReports"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveSection("attendanceReports")}
                >
                  Attendance Reports
                </button>
              )}

              <button
                className={`btn ${
                  activeSection === "assets"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveSection("assets");
                  setAssetMessage("");
                  setAssetError("");
                  refreshAssetSection();
                }}
              >
                Assets
              </button>

              <button
                className={`btn ${
                  activeSection === "helpdesk"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveSection("helpdesk");
                  setHelpDeskMessage("");
                  setHelpDeskError("");
                  setSelectedRequest(null);
                  refreshHelpDeskSection();
                }}
              >
                Help Desk
              </button>

              {isAdmin && (
                <button
                  className={`btn ${
                    activeSection === "recruitment"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setActiveSection("recruitment");
                    setJobMessage("");
                    setJobError("");
                    setCandidateMessage("");
                    setCandidateError("");
                    setSelectedCandidate(null);
                    refreshRecruitmentSection();
                  }}
                >
                  Recruitment
                </button>
              )}

              <button
                className={`btn ${
                  activeSection === "onboarding"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveSection("onboarding");
                  setOnboardingMessage("");
                  setOnboardingError("");
                  fetchOnboardingTasks();
                }}
              >
                Onboarding
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

            {isReviewer && (
              <PerformanceDashboard
                dashboard={performanceDashboard}
                loading={performanceDashboardLoading}
              />
            )}

            {isReviewer && (
              <PerformanceReviewForm
                employees={employees}
                user={user}
                token={token}
                onReviewCreated={handlePerformanceRefresh}
              />
            )}

            {!isReviewer && (
              <div className="alert alert-info">
                Your manager will create and submit your performance appraisals
                here. Completed reviews will appear below.
              </div>
            )}

            {performanceLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading performance reviews...</p>
              </div>
            ) : (
              <PerformanceReviewTable
                reviews={performanceReviews}
                role={user?.role}
                token={token}
                onReviewChanged={handlePerformanceRefresh}
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
                employees={employees}
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

        {activeSection === "reportsDashboard" && isAdmin && (
          <DashboardReports token={token} />
        )}

        {activeSection === "leaveReports" && isAdmin && (
          <LeaveReports token={token} employees={employees} />
        )}

        {activeSection === "payrollReports" && isAdmin && (
          <PayrollReports token={token} employees={employees} />
        )}

        {activeSection === "attendanceReports" && isAdmin && (
          <AttendanceReports token={token} employees={employees} />
        )}

        {activeSection === "assets" && (
          <div className="mb-4">
            {assetMessage && (
              <div className="alert alert-success">{assetMessage}</div>
            )}

            {assetError && (
              <div className="alert alert-danger">{assetError}</div>
            )}

            {isAdmin && (
              <AssetDashboard
                dashboard={assetDashboard}
                loading={assetDashboardLoading}
              />
            )}

            {isAdmin && (
              <>
                <div className="mb-3">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowAssetForm(true);
                      setEditingAsset(null);
                    }}
                  >
                    Add Asset
                  </button>
                </div>

                {showAssetForm && (
                  <AssetForm
                    onSubmit={handleAssetSubmit}
                    editingAsset={editingAsset}
                    onCancel={() => {
                      setShowAssetForm(false);
                      setEditingAsset(null);
                    }}
                  />
                )}

                {assetToAssign && (
                  <AssignAssetForm
                    asset={assetToAssign}
                    employees={employees}
                    onSubmit={handleAssetAssign}
                    onCancel={() => setAssetToAssign(null)}
                  />
                )}

                {assetsLoading ? (
                  <div className="text-center my-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Loading assets...</p>
                  </div>
                ) : (
                  <AssetTable
                    assets={assets}
                    isAdmin={isAdmin}
                    onEdit={(asset) => {
                      setEditingAsset(asset);
                      setShowAssetForm(true);
                    }}
                    onDelete={handleAssetDelete}
                    onAssign={(asset) => {
                      setAssetToAssign(asset);
                      setShowAssetForm(false);
                    }}
                    searchText={assetSearchText}
                    setSearchText={setAssetSearchText}
                    categoryFilter={assetCategoryFilter}
                    setCategoryFilter={setAssetCategoryFilter}
                    statusFilter={assetStatusFilter}
                    setStatusFilter={setAssetStatusFilter}
                    categories={assetCategories}
                  />
                )}
              </>
            )}

            {!isAdmin && (
              <div className="alert alert-info">
                Below is the history of company assets assigned to you,
                including expected return dates.
              </div>
            )}

            <h5 className="mt-4 mb-3">
              {isAdmin ? "All Assignment History" : "My Asset History"}
            </h5>

            {assetAssignmentsLoading ? (
              <div className="text-center my-4">
                Loading assignment history...
              </div>
            ) : (
              <AssetAssignment
                assignments={assetAssignments}
                isAdmin={isAdmin}
                onReturn={handleAssetReturn}
              />
            )}
          </div>
        )}

        {activeSection === "helpdesk" && (
          <div className="mb-4">
            {helpDeskMessage && (
              <div className="alert alert-success">{helpDeskMessage}</div>
            )}

            {helpDeskError && (
              <div className="alert alert-danger">{helpDeskError}</div>
            )}

            {isAdmin && (
              <HelpDeskDashboard
                dashboard={helpDeskDashboard}
                loading={helpDeskDashboardLoading}
              />
            )}

            {!isAdmin && (
              <ServiceRequestForm onSubmit={handleServiceRequestSubmit} />
            )}

            {selectedRequestLoading ? (
              <div className="text-center my-4">Loading request details...</div>
            ) : (
              selectedRequest && (
                <RequestDetails
                  request={selectedRequest}
                  isAdmin={isAdmin}
                  token={token}
                  onClose={() => setSelectedRequest(null)}
                  onChanged={handleRequestChanged}
                />
              )
            )}

            <h5 className="mt-3 mb-3">
              {isAdmin ? "All Service Requests" : "My Service Requests"}
            </h5>

            {helpDeskLoading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2">Loading service requests...</p>
              </div>
            ) : (
              <ServiceRequestTable
                requests={helpDeskRequests}
                isAdmin={isAdmin}
                onView={handleViewRequest}
                categoryFilter={hdCategoryFilter}
                setCategoryFilter={setHdCategoryFilter}
                priorityFilter={hdPriorityFilter}
                setPriorityFilter={setHdPriorityFilter}
                statusFilter={hdStatusFilter}
                setStatusFilter={setHdStatusFilter}
              />
            )}
          </div>
        )}

        {activeSection === "recruitment" && isAdmin && (
          <div className="mb-4">
            {jobMessage && (
              <div className="alert alert-success">{jobMessage}</div>
            )}
            {jobError && <div className="alert alert-danger">{jobError}</div>}
            {candidateMessage && (
              <div className="alert alert-success">{candidateMessage}</div>
            )}
            {candidateError && (
              <div className="alert alert-danger">{candidateError}</div>
            )}

            <RecruitmentDashboard
              dashboard={recruitmentDashboard}
              loading={recruitmentDashboardLoading}
            />

            <h5 className="mb-3">Job Openings</h5>

            <div className="mb-3">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowJobForm(true);
                  setEditingJob(null);
                }}
              >
                Add Job Opening
              </button>
            </div>

            {showJobForm && (
              <JobOpeningForm
                onSubmit={handleJobSubmit}
                editingJob={editingJob}
                onCancel={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                }}
              />
            )}

            {jobsLoading ? (
              <div className="text-center my-4">Loading job openings...</div>
            ) : (
              <JobTable
                jobs={jobs}
                onEdit={(job) => {
                  setEditingJob(job);
                  setShowJobForm(true);
                }}
                onDelete={handleJobDelete}
                searchText={jobSearchText}
                setSearchText={setJobSearchText}
                statusFilter={jobStatusFilter}
                setStatusFilter={setJobStatusFilter}
              />
            )}

            <h5 className="mt-4 mb-3">Candidate Applications</h5>

            <div className="mb-3">
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowCandidateForm(true);
                  setSelectedCandidate(null);
                }}
              >
                Add Candidate
              </button>
            </div>

            {showCandidateForm && (
              <CandidateDetails
                jobs={jobs}
                onAddCandidate={handleAddCandidate}
                onClose={() => setShowCandidateForm(false)}
              />
            )}

            {selectedCandidate && (
              <CandidateDetails
                candidate={selectedCandidate}
                jobs={jobs}
                onUpdateCandidate={handleUpdateCandidateStatus}
                onClose={() => setSelectedCandidate(null)}
              />
            )}

            {candidatesLoading ? (
              <div className="text-center my-4">Loading candidates...</div>
            ) : (
              <CandidateTable
                candidates={candidates}
                jobs={jobs}
                onView={handleViewCandidate}
                searchText={candidateSearchText}
                setSearchText={setCandidateSearchText}
                statusFilter={candidateStatusFilter}
                setStatusFilter={setCandidateStatusFilter}
                jobFilter={candidateJobFilter}
                setJobFilter={setCandidateJobFilter}
              />
            )}
          </div>
        )}

        {activeSection === "onboarding" && (
          <div className="mb-4">
            {onboardingMessage && (
              <div className="alert alert-success">{onboardingMessage}</div>
            )}
            {onboardingError && (
              <div className="alert alert-danger">{onboardingError}</div>
            )}

            {isAdmin && (
              <OnboardingTaskForm
                employees={employees}
                onSubmit={handleAssignTask}
              />
            )}

            {!isAdmin && (
              <div className="alert alert-info">
                Below are your assigned onboarding tasks. Mark them as completed
                once done.
              </div>
            )}

            <h5 className="mb-3">
              {isAdmin ? "All Onboarding Tasks" : "My Onboarding Tasks"}
            </h5>

            {onboardingTasksLoading ? (
              <div className="text-center my-4">
                Loading onboarding tasks...
              </div>
            ) : (
              <OnboardingTaskTable
                tasks={onboardingTasks}
                isAdmin={isAdmin}
                onComplete={handleCompleteTask}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
