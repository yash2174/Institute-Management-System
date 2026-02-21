import express from 'express';
import { createExam, getAllExams, getStudentExams, getExamDetails, submitExam, getMyResults, getResultDetails, getAllResults, updateExam, deleteExam ,getLeaderboard} from '../controllers/examController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = express.Router();
router.post('/', authenticate, authorize('admin'), createExam);
router.get('/all', authenticate, authorize('admin'), getAllExams);
router.put('/:id', authenticate, authorize('admin'), updateExam);
router.delete('/:id', authenticate, authorize('admin'), deleteExam);
router.get('/results/all', authenticate, authorize('admin'), getAllResults);
router.get('/student/available', authenticate, authorize('student'), getStudentExams);
router.get('/student/results', authenticate, authorize('student'), getMyResults);
router.get('/student/results/:id', authenticate, authorize('student'), getResultDetails);
router.post('/submit', authenticate, authorize('student'), submitExam);
router.get("/leaderboard", authenticate, getLeaderboard);

router.get('/:id', authenticate, getExamDetails);
export default router;
