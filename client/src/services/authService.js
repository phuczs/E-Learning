import api from '../utils/axiosInstance';

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    googleAuth: (data) => api.post('/auth/google', data),
    getMe: () => api.get('/auth/me')
};
