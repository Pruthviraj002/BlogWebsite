import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:5002/api/admin',
});


// Request Interceptor: Inject Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        config.headers['auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && [400, 401].includes(error.response.status)) {
        localStorage.removeItem('auth-token');
        // Avoid infinite reload loop if already on login page
        if (!window.location.pathname.includes('login')) {
            window.location.href = '/'; // App.jsx will handle if token is null
        }
    }

    return Promise.reject(error);
});

export default api;
