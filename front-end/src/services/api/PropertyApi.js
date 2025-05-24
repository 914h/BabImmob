import { axiosClient } from "../../api/axios.js";

const PropertyApi = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/properties');
      return response;
    } catch (error) {
      throw error;
    }
  },

  get: async (id) => {
    try {
      const response = await axiosClient.get(`/owner/properties/${id}`);
      return response;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404 || error.response.data?.message?.includes('No query results')) {
          throw new Error('Property not found');
        }
        throw new Error(error.response.data.message || 'Failed to fetch property');
      }
      throw error;
    }
  },

  // Owner specific endpoints
  getMyProperties: async () => {
    try {
      const response = await axiosClient.get('/owner/properties');
      return response;
    } catch (error) {
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await axiosClient.post('/owner/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Create property error:', error);
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const response = await axiosClient.put(`/owner/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Update property error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosClient.delete(`/owner/properties/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default PropertyApi; 