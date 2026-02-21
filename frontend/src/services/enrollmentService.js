import api from './api';

export const enrollmentService = {
  enrollCourse: async (courseId) => {
    const response = await api.post('/enrollments/enroll', { courseId });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-enrollments');
    return response.data;
  },

  getAllEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  updateEnrollmentStatus: async (id, status) => {
    const response = await api.put(`/enrollments/${id}/status`, { status });
    return response.data;
  },

  deleteEnrollment: async (id) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  }
};
