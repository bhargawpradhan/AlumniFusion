import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: '/api',
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
