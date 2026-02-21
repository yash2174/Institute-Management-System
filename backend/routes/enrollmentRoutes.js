import express from 'express';
import { enrollCourse, getMyEnrollments, getAllEnrollments, deleteEnrollment } from '../controllers/enrollmentController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = express.Router();
router.post('/enroll', authenticate, authorize('student'), enrollCourse);
router.get('/my-enrollments', authenticate, authorize('student'), getMyEnrollments);
router.get('/', authenticate, authorize('admin'), getAllEnrollments);
router.delete('/:id', authenticate, authorize('admin'), deleteEnrollment);
export default router;
