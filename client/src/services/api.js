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
