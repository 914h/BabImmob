import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const AgentApi = {
  create: (data) => {
    return axios.post(`${API_BASE_URL}/api/admin/agents`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${getAuthToken()}`
      },
    });
  },
  update: (id, data) => {
    return axios.put(`${API_BASE_URL}/api/admin/agents/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${getAuthToken()}`
      },
    });
  },
  delete: (id) => {
    return axios.delete(`${API_BASE_URL}/api/admin/agents/${id}`, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    });
  },
  all: (columns = []) => {
    return axios.get(`${API_BASE_URL}/api/admin/agents`, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      },
      params: {
        columns: columns.join(","),
      },
    });
  },
};

export default AgentApi; 