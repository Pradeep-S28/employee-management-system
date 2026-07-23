import axios from "axios";

const API_URL = "http://localhost:5001/employees";

const getAuthHeader = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getEmployees = (token) => {
  return axios.get(API_URL, getAuthHeader(token));
};

export const getEmployeeById = (id, token) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader(token));
};

export const addEmployee = (employee, token) => {
  return axios.post(API_URL, employee, getAuthHeader(token));
};

export const updateEmployee = (id, employee, token) => {
  return axios.put(`${API_URL}/${id}`, employee, getAuthHeader(token));
};

export const deleteEmployee = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
};

// task 5
const LEAVE_API_URL = "http://localhost:5001/leaves";

export const submitLeaveRequest = (leaveData, token) => {
  return axios.post(LEAVE_API_URL, leaveData, getAuthHeader(token));
};

export const getLeaveRequests = (token) => {
  return axios.get(LEAVE_API_URL, getAuthHeader(token));
};

// task 5 admin
export const updateLeaveStatus = (id, status, token) => {
  return axios.put(
    `${LEAVE_API_URL}/${id}/status`,
    { status },
    getAuthHeader(token),
  );
};

//charts

export const getLeaveSummary = (token) => {
  return axios.get(`${LEAVE_API_URL}/summary`, getAuthHeader(token));
};

// task 9: performance appraisal module (replaces task 6 self-appraisal flow)

const PERFORMANCE_API_URL = "http://localhost:5001/performance";

export const createPerformanceReview = (reviewData, token) => {
  return axios.post(
    `${PERFORMANCE_API_URL}/review`,
    reviewData,
    getAuthHeader(token),
  );
};

export const updatePerformanceReview = (id, reviewData, token) => {
  return axios.put(
    `${PERFORMANCE_API_URL}/review/${id}`,
    reviewData,
    getAuthHeader(token),
  );
};

export const getPerformanceReviews = (token) => {
  return axios.get(`${PERFORMANCE_API_URL}/reviews`, getAuthHeader(token));
};

export const getPerformanceReviewById = (id, token) => {
  return axios.get(`${PERFORMANCE_API_URL}/review/${id}`, getAuthHeader(token));
};

export const addPerformanceKpi = (kpiData, token) => {
  return axios.post(
    `${PERFORMANCE_API_URL}/kpi`,
    kpiData,
    getAuthHeader(token),
  );
};

export const updatePerformanceKpi = (id, kpiData, token) => {
  return axios.put(
    `${PERFORMANCE_API_URL}/kpi/${id}`,
    kpiData,
    getAuthHeader(token),
  );
};

export const deletePerformanceKpi = (id, token) => {
  return axios.delete(`${PERFORMANCE_API_URL}/kpi/${id}`, getAuthHeader(token));
};

export const getPerformanceDashboard = (token) => {
  return axios.get(`${PERFORMANCE_API_URL}/dashboard`, getAuthHeader(token));
};

// task 7 payroll

const PAYROLL_API_URL = "http://localhost:5001/payroll";

export const setSalaryStructure = (salaryData, token) => {
  return axios.post(
    `${PAYROLL_API_URL}/salary`,
    salaryData,
    getAuthHeader(token),
  );
};

export const getSalaryStructure = (employeeId, token) => {
  return axios.get(
    `${PAYROLL_API_URL}/salary/${employeeId}`,
    getAuthHeader(token),
  );
};

export const generatePayslip = (payslipData, token) => {
  return axios.post(
    `${PAYROLL_API_URL}/generate`,
    payslipData,
    getAuthHeader(token),
  );
};

export const getPayslips = (token) => {
  return axios.get(`${PAYROLL_API_URL}/payslips`, getAuthHeader(token));
};

export const getPayslipById = (id, token) => {
  return axios.get(`${PAYROLL_API_URL}/payslips/${id}`, getAuthHeader(token));
};

export const getPayrollSummary = (token) => {
  return axios.get(`${PAYROLL_API_URL}/summary`, getAuthHeader(token));
};

// task 8
const REPORT_API_URL = "http://localhost:5001/reports";

export const getEmployeeReports = (token, params = {}) => {
  return axios.get(`${REPORT_API_URL}/employees`, {
    ...getAuthHeader(token),
    params,
  });
};

export const getReportsDashboard = (token) => {
  return axios.get(`${REPORT_API_URL}/dashboard`, getAuthHeader(token));
};

export const getLeaveReports = (token, params = {}) => {
  return axios.get(`${REPORT_API_URL}/leaves`, {
    ...getAuthHeader(token),
    params,
  });
};

export const getPayrollReports = (token, params = {}) => {
  return axios.get(`${REPORT_API_URL}/payroll`, {
    ...getAuthHeader(token),
    params,
  });
};

export const exportReport = (token, format, params = {}) => {
  return axios.get(`${REPORT_API_URL}/export/${format}`, {
    ...getAuthHeader(token),
    params,
    responseType: "blob",
  });
};

export const getAttendanceReports = (token, params = {}) => {
  return axios.get(`${REPORT_API_URL}/attendance`, {
    ...getAuthHeader(token),
    params,
  });
};

// task 10 asset management

const ASSET_API_URL = "http://localhost:5001/assets";

export const getAssets = (token, params = {}) => {
  return axios.get(ASSET_API_URL, {
    ...getAuthHeader(token),
    params,
  });
};

export const getAssetById = (id, token) => {
  return axios.get(`${ASSET_API_URL}/${id}`, getAuthHeader(token));
};

export const addAsset = (assetData, token) => {
  return axios.post(ASSET_API_URL, assetData, getAuthHeader(token));
};

export const updateAsset = (id, assetData, token) => {
  return axios.put(`${ASSET_API_URL}/${id}`, assetData, getAuthHeader(token));
};

export const deleteAsset = (id, token) => {
  return axios.delete(`${ASSET_API_URL}/${id}`, getAuthHeader(token));
};

export const assignAsset = (assignmentData, token) => {
  return axios.post(
    `${ASSET_API_URL}/assign`,
    assignmentData,
    getAuthHeader(token),
  );
};

export const returnAsset = (returnData, token) => {
  return axios.post(
    `${ASSET_API_URL}/return`,
    returnData,
    getAuthHeader(token),
  );
};

export const getAssetAssignments = (token) => {
  return axios.get(`${ASSET_API_URL}/assignments`, getAuthHeader(token));
};

export const getAssetDashboard = (token) => {
  return axios.get(`${ASSET_API_URL}/dashboard`, getAuthHeader(token));
};

// task 11 help desk & service requests

const HELPDESK_API_URL = "http://localhost:5001/helpdesk";

export const createServiceRequest = (requestData, token) => {
  return axios.post(
    `${HELPDESK_API_URL}/request`,
    requestData,
    getAuthHeader(token),
  );
};

export const getServiceRequests = (token, params = {}) => {
  return axios.get(`${HELPDESK_API_URL}/requests`, {
    ...getAuthHeader(token),
    params,
  });
};

export const getServiceRequestById = (id, token) => {
  return axios.get(`${HELPDESK_API_URL}/request/${id}`, getAuthHeader(token));
};

export const updateServiceRequest = (id, requestData, token) => {
  return axios.put(
    `${HELPDESK_API_URL}/request/${id}`,
    requestData,
    getAuthHeader(token),
  );
};

export const addRequestComment = (id, comment, token) => {
  return axios.post(
    `${HELPDESK_API_URL}/request/${id}/comment`,
    { comment },
    getAuthHeader(token),
  );
};

export const updateRequestStatus = (id, statusData, token) => {
  return axios.put(
    `${HELPDESK_API_URL}/request/${id}/status`,
    statusData,
    getAuthHeader(token),
  );
};

export const getHelpDeskDashboard = (token) => {
  return axios.get(`${HELPDESK_API_URL}/dashboard`, getAuthHeader(token));
};

// task 12 recruitment & employee onboarding

const RECRUITMENT_API_URL = "http://localhost:5001/recruitment";
const ONBOARDING_API_URL = "http://localhost:5001/onboarding";

export const getJobs = (token, params = {}) => {
  return axios.get(`${RECRUITMENT_API_URL}/jobs`, {
    ...getAuthHeader(token),
    params,
  });
};

export const addJob = (jobData, token) => {
  return axios.post(
    `${RECRUITMENT_API_URL}/jobs`,
    jobData,
    getAuthHeader(token),
  );
};

export const updateJob = (id, jobData, token) => {
  return axios.put(
    `${RECRUITMENT_API_URL}/jobs/${id}`,
    jobData,
    getAuthHeader(token),
  );
};

export const deleteJob = (id, token) => {
  return axios.delete(
    `${RECRUITMENT_API_URL}/jobs/${id}`,
    getAuthHeader(token),
  );
};

export const getCandidates = (token, params = {}) => {
  return axios.get(`${RECRUITMENT_API_URL}/candidates`, {
    ...getAuthHeader(token),
    params,
  });
};

export const getCandidateById = (id, token) => {
  return axios.get(
    `${RECRUITMENT_API_URL}/candidates/${id}`,
    getAuthHeader(token),
  );
};

export const addCandidate = (candidateData, token) => {
  return axios.post(
    `${RECRUITMENT_API_URL}/candidates`,
    candidateData,
    getAuthHeader(token),
  );
};

export const updateCandidate = (id, candidateData, token) => {
  return axios.put(
    `${RECRUITMENT_API_URL}/candidates/${id}`,
    candidateData,
    getAuthHeader(token),
  );
};

export const getRecruitmentDashboard = (token) => {
  return axios.get(`${RECRUITMENT_API_URL}/dashboard`, getAuthHeader(token));
};

export const getOnboardingTasks = (token, params = {}) => {
  return axios.get(`${ONBOARDING_API_URL}/tasks`, {
    ...getAuthHeader(token),
    params,
  });
};

export const addOnboardingTask = (taskData, token) => {
  return axios.post(
    `${ONBOARDING_API_URL}/tasks`,
    taskData,
    getAuthHeader(token),
  );
};

export const updateOnboardingTask = (id, taskData, token) => {
  return axios.put(
    `${ONBOARDING_API_URL}/tasks/${id}`,
    taskData,
    getAuthHeader(token),
  );
};
