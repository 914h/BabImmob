import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ClientPropertyApi = {
  async getProperties() {
    try {
      const response = await api.get('/client/properties');
      console.log('API Response:', response); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw new Error(error.response?.data?.message || 'Failed to fetch properties');
    }
  },

  async getProperty(id) {
    try {
      const response = await api.get(`/client/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch property details');
    }
  }
}; 