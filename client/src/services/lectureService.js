import api from '../utils/axiosInstance';

export const lectureService = {
    upload: (formData) => api.post('/lectures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => api.get('/lectures'),
    getById: (id) => api.get(`/lectures/${id}`),
    delete: (id) => api.delete(`/lectures/${id}`)
};
