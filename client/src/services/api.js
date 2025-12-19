import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Lecture API
export const lectureAPI = {
    upload: (formData) => api.post('/lectures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => api.get('/lectures'),
    getById: (id) => api.get(`/lectures/${id}`),
    delete: (id) => api.delete(`/lectures/${id}`)
};

// Flashcard API
export const flashcardAPI = {
    generate: (lectureId, count) => api.post(`/flashcards/generate/${lectureId}`, { count }),
    getByLecture: (lectureId) => api.get(`/flashcards/lecture/${lectureId}`),
    update: (id, data) => api.put(`/flashcards/${id}`, data),
    delete: (id) => api.delete(`/flashcards/${id}`)
};

// Quiz API
export const quizAPI = {
    generate: (lectureId, data) => api.post(`/quizzes/generate/${lectureId}`, data),
    getByLecture: (lectureId) => api.get(`/quizzes/lecture/${lectureId}`),
    getById: (id) => api.get(`/quizzes/${id}`),
    submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
    getAttempts: () => api.get('/quizzes/attempts'),
    delete: (id) => api.delete(`/quizzes/${id}`)
};

export default api;
