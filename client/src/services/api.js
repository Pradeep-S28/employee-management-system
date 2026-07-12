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

// task 6 performance

const PERFORMANCE_API_URL = "http://localhost:5001/performance";

export const submitPerformanceReview = (reviewData, token) => {
  return axios.post(PERFORMANCE_API_URL, reviewData, getAuthHeader(token));
};

export const getPerformanceReviews = (token) => {
  return axios.get(PERFORMANCE_API_URL, getAuthHeader(token));
};

export const updatePerformanceReview = (id, reviewData, token) => {
  return axios.put(
    `${PERFORMANCE_API_URL}/${id}`,
    reviewData,
    getAuthHeader(token),
  );
};

export const getPerformanceSummary = (token) => {
  return axios.get(`${PERFORMANCE_API_URL}/summary`, getAuthHeader(token));
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
