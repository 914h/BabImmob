import { axiosClient } from "../../api/axios.js";

const UserApi = {
    login: async (email, password) => {
        console.log('UserApi: Making login request');
        try {
            const response = await axiosClient.post('/login', { email, password });
            console.log('UserApi: Login response', response);
            return response;
        } catch (error) {
            console.error('UserApi: Login error', error);
            throw error;
        }
    },
    logout: async () => {
        console.log('UserApi: Making logout request');
        try {
            const response = await axiosClient.post('/logout');
            console.log('UserApi: Logout response', response);
            return response;
        } catch (error) {
            console.error('UserApi: Logout error', error);
            throw error;
        }
    },
    getUser: async () => {
        console.log('UserApi: Getting user data');
        try {
            const response = await axiosClient.get('/me');
            console.log('UserApi: Get user response', response);
            return response;
        } catch (error) {
            console.error('UserApi: Get user error', error);
            throw error;
        }
    },
    all: async (columns = []) => {
        console.log('UserApi: Getting all users');
        try {
            const response = await axiosClient.get('/me', {
                params: {
                    columns: columns
                },
            });
            console.log('UserApi: Get all users response', response);
            return response;
        } catch (error) {
            console.error('UserApi: Get all users error', error);
            throw error;
        }
    },
};

export default UserApi;