import axios from 'axios';

const API_BASE_URL = 'https://d513-2401-4900-1c5b-3628-3d28-6857-7641-2f89.ngrok-free.app/api';

// Create an Axios instance
const apiInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to automatically add Authorization header
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiInstance;
