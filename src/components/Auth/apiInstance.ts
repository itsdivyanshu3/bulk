import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
