import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import examRoutes from './routes/examRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'https://institute-management-system-1.onrender.com', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/health', (req, res) => res.json({ success: true, message: 'Server running' }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
export default app;
