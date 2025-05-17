import { axiosClient } from "../../api/axios.js";

const ClientApi = {
    create: async (payload) => {
        return await axiosClient.post('/admin/clients', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: async (id, payload) => {
        console.log('ClientApi.update called with id:', id, 'and payload:', payload);
        
        // Check if payload contains a file
        const hasFile = payload instanceof FormData && [...payload.entries()].some(([key, value]) => value instanceof File);
        
        if (hasFile) {
            // Use POST with _method override for file uploads
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            payload.append('_method', 'PUT');
            const response = await axiosClient.post(`/admin/clients/${id}`, payload, config);
            console.log('Update response:', response);
            return response;
        } else {
            // Use regular PUT for non-file updates
            const data = {};
            if (payload instanceof FormData) {
                for (let [key, value] of payload.entries()) {
                    data[key] = value;
                }
            } else {
                Object.assign(data, payload);
            }
            return await axiosClient.put(`/admin/clients/${id}`, data);
        }
    },
    delete: async (id) => {
        return await axiosClient.delete(`/admin/clients/${id}`);
    },
    all: async () => {
        return await axiosClient.get('/admin/clients');
    },
};

export default ClientApi;       