import api from '../utils/axiosInstance';

export const quizService = {
    generate: (lectureId, data) => api.post(`/quizzes/generate/${lectureId}`, data),
    getByLecture: (lectureId) => api.get(`/quizzes/lecture/${lectureId}`),
    getById: (id) => api.get(`/quizzes/${id}`),
    submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
    getAttempts: () => api.get('/quizzes/attempts'),
    delete: (id) => api.delete(`/quizzes/${id}`)
};
