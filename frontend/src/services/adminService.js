import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  getStudentDetails: async (id) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  }
};