import express from 'express';
import { getDashboardStats, getAllStudents, deleteStudent } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = express.Router();
router.use(authenticate, authorize('admin'));
router.get('/dashboard/stats', getDashboardStats);
router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);
export default router;
