import { axiosClient } from "../../api/axios.js";

const PropertyApi = {
  getMyProperties: async () => {
    return await axiosClient.get("/owner/properties");
  },

  get: async (id) => {
    return await axiosClient.get(`/owner/properties/${id}`);
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
    return await axiosClient.post('/owner/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    return await axiosClient.put(`/owner/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: async (id) => {
    return await axiosClient.delete(`/owner/properties/${id}`);
  },

  all: async () => {
    return await axiosClient.get('/owner/properties');
  },
};

export default PropertyApi; 