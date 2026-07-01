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
