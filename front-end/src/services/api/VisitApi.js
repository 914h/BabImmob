import { axiosClient } from "../../api/axios.js";

const VisitApi = {
    // Fetch all visits for the owner
    all: async () => {
        return await axiosClient.get('/owner/visits');
    },
    // Update visit status
    updateStatus: async (id, status) => {
        return await axiosClient.put(`/visits/${id}`, { status });
    },
};

export default VisitApi; 