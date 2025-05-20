import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const PropertyApi = {
  async getProperties() {
    try {
      const response = await axios.get(`${API_URL}/client/properties`);
      console.log('API Response:', response); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw new Error(error.response?.data?.message || 'Failed to fetch properties');
    }
  },

  async getProperty(id) {
    try {
      const response = await axios.get(`${API_URL}/client/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch property details');
    }
  },

  async createProperty(propertyData) {
    try {
      const formData = new FormData();
      
      // Append basic property data
      Object.keys(propertyData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyData[key]);
        }
      });

      // Append images
      if (propertyData.images) {
        propertyData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await axios.post(`${API_URL}/owner/properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create property');
    }
  },

  async updateProperty(id, propertyData) {
    try {
      const formData = new FormData();
      
      // Append basic property data
      Object.keys(propertyData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, propertyData[key]);
        }
      });

      // Append new images
      if (propertyData.images) {
        propertyData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await axios.post(`${API_URL}/owner/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update property');
    }
  },

  async deleteProperty(id) {
    try {
      const response = await axios.delete(`${API_URL}/owner/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete property');
    }
  },
}; 