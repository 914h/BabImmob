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
  async getProperties(params = {}) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      
      // Search
      if (params.search) queryParams.append('search', params.search);
      
      // Filters
      if (params.type && params.type !== 'all') queryParams.append('type', params.type);
      if (params.price_min) queryParams.append('price_min', params.price_min);
      if (params.price_max) queryParams.append('price_max', params.price_max);
      if (params.rooms) queryParams.append('rooms', params.rooms);
      if (params.surface_min) queryParams.append('surface_min', params.surface_min);
      if (params.surface_max) queryParams.append('surface_max', params.surface_max);
      
      // Sorting
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      
      const url = `/client/properties${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
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