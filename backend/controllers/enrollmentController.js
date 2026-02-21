import pool from '../config/database.js';
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const existing = await pool.query('SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2', [req.user.id, courseId]);
    if (existing.rows.length > 0) return res.status(400).json({ success: false, message: 'Already enrolled' });
    const result = await pool.query('INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *', [req.user.id, courseId]);
    res.status(201).json({ success: true, message: 'Enrolled successfully', enrollment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Enrollment failed' });
  }
};
export const getMyEnrollments = async (req, res) => {
  try {
    const result = await pool.query('SELECT e.*, c.* FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = $1', [req.user.id]);
    res.json({ success: true, count: result.rows.length, enrollments: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
export const getAllEnrollments = async (req, res) => {
  try {
    const result = await pool.query('SELECT e.*, u.name as student_name, u.email, c.title as course_title FROM enrollments e JOIN users u ON e.student_id = u.id JOIN courses c ON e.course_id = c.id');
    res.json({ success: true, count: result.rows.length, enrollments: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
export const deleteEnrollment = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM enrollments WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Enrollment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
