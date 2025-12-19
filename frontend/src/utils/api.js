import axios from 'axios';

// Determine base URL (set VITE_API_URL in production if backend is hosted separately)
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create an axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors systematically
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle global errors here (e.g., 401 Unauthorized -> logout)
        return Promise.reject(error);
    }
);

export default api;
