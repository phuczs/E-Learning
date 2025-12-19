import api from '../utils/axiosInstance';

export const flashcardService = {
    generate: (lectureId, count) => api.post(`/flashcards/generate/${lectureId}`, { count }),
    getByLecture: (lectureId) => api.get(`/flashcards/lecture/${lectureId}`),
    update: (id, data) => api.put(`/flashcards/${id}`, data),
    delete: (id) => api.delete(`/flashcards/${id}`)
};
