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

  create: async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined) {
        if (key === 'images' && Array.isArray(payload[key])) {
          payload[key].forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });
        } else {
          formData.append(key, payload[key]);
        }
      }
    });
    try {
      const response = await axiosClient.post('/owner/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined) {
        if (key === 'images' && Array.isArray(payload[key])) {
          payload[key].forEach((file, index) => {
            formData.append(`images[${index}]`, file);
          });
        } else {
          formData.append(key, payload[key]);
        }
      }
    });
    try {
      const response = await axiosClient.put(`/owner/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
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