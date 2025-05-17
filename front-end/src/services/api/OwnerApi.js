import { axiosClient } from "../../api/axios.js";

const OwnerApi = {
    create: async (payload) => {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            if (payload[key] !== undefined) {
                formData.append(key, payload[key]);
            }
        });
        return await axiosClient.post('/admin/owners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: async (id, payload) => {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
            if (payload[key] !== undefined) {
                formData.append(key, payload[key]);
            }
        });
        formData.append('id', id);
        return await axiosClient.put(`/admin/owners/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    delete: async (id) => {
        return await axiosClient.delete(`/admin/owners/${id}`);
    },
    all: async (columns = []) => {
        return await axiosClient.get('/admin/owners', {
            params: {
                columns: columns
            },
        });
    },
}
export default OwnerApi    