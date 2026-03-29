import axios from 'axios';
import store from '../Store/store';
import { updateToken, logout } from '../Slice/userSlice';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 503 && error.response?.data?.maintenanceStatus) {
            // Site is in maintenance mode
            window.location.href = '/maintenance';
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/user/refresh`, { refreshToken });
                    const newToken = response.data.token;
                    store.dispatch(updateToken(newToken));
                    originalRequest.headers['auth-token'] = newToken;
                    return api(originalRequest);
                } catch (refreshError) {
                    store.dispatch(logout());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
