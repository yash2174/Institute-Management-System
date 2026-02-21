import api from './api';

export const examService = {
  // Admin
  createExam: async (examData) => {
    const response = await api.post('/exams', examData);
    return response.data;
  },

  getAllExams: async () => {
    const response = await api.get('/exams/all');
    return response.data;
  },

  updateExam: async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  getAllResults: async () => {
    const response = await api.get('/exams/results/all');
    return response.data;
  },

  // Student
  getStudentExams: async () => {
    const response = await api.get('/exams/student/available');
    return response.data;
  },

  getExamDetails: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  submitExam: async (examId, answers) => {
    const response = await api.post('/exams/submit', { examId, answers });
    return response.data;
  },

  getMyResults: async () => {
    const response = await api.get('/exams/student/results');
    return response.data;
  },

  getResultDetails: async (id) => {
    const response = await api.get(`/exams/student/results/${id}`);
    return response.data;
  }
};
