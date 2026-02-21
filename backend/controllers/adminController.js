import pool from '../config/database.js';
export const getDashboardStats = async (req, res) => {
  try {
    const students = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const courses = await pool.query('SELECT COUNT(*) as count FROM courses');
    const activeCourses = await pool.query("SELECT COUNT(*) as count FROM courses WHERE status = 'active'");
    const enrollments = await pool.query('SELECT COUNT(*) as count FROM enrollments');
    const exams = await pool.query('SELECT COUNT(*) as count FROM exams');
    const results = await pool.query('SELECT COUNT(*) as count FROM exam_results');
    const passed = await pool.query("SELECT COUNT(*) as count FROM exam_results WHERE status = 'pass'");
    const failed = await pool.query("SELECT COUNT(*) as count FROM exam_results WHERE status = 'fail'");
    const recentEnrollments = await pool.query('SELECT e.*, u.name as student_name, c.title as course_title FROM enrollments e JOIN users u ON e.student_id = u.id JOIN courses c ON e.course_id = c.id ORDER BY e.enrollment_date DESC LIMIT 5');
    const recentResults = await pool.query('SELECT er.*, u.name as student_name, e.title as exam_title FROM exam_results er JOIN users u ON er.student_id = u.id JOIN exams e ON er.exam_id = e.id ORDER BY er.submitted_at DESC LIMIT 5');
    res.json({
      success: true,
      stats: {
        totalStudents: parseInt(students.rows[0].count),
        totalCourses: parseInt(courses.rows[0].count),
        activeCourses: parseInt(activeCourses.rows[0].count),
        totalEnrollments: parseInt(enrollments.rows[0].count),
        totalExams: parseInt(exams.rows[0].count),
        totalResults: parseInt(results.rows[0].count),
        passedExams: parseInt(passed.rows[0].count),
        failedExams: parseInt(failed.rows[0].count),
        recentEnrollments: recentEnrollments.rows,
        recentResults: recentResults.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
export const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, phone, address, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC");
    res.json({ success: true, count: result.rows.length, students: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 AND role = 'student' RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
