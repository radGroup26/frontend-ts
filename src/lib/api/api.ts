import axios from 'axios';

const baseURL = 'http://localhost:3000';

// Create an Axios instance
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Include cookies in requests
});

// Request interceptor to attach the access token
api.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to handle token expiry
api.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (err) {
            console.log('Refresh token expired or invalid');
            // Handle refresh token expiry (e.g., redirect to login)
        }
    }
    return Promise.reject(error);
});

export default api;