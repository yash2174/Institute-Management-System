import pool from '../config/database.js';

export const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, courses: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
};

export const getCourse = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, duration, fee, instructor } = req.body;

    const fileUrl = req.file ? req.file.location : null;

    const result = await pool.query(
      `INSERT INTO courses 
      (title, description, duration, fee, instructor, file_url) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, duration, fee, instructor, fileUrl]
    );

    res.status(201).json({
      success: true,
      message: "Course created",
      course: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, duration, fee, instructor, status } = req.body;

    const fileUrl = req.file ? req.file.location : null;

    const result = await pool.query(
      `UPDATE courses SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        duration = COALESCE($3, duration),
        fee = COALESCE($4, fee),
        instructor = COALESCE($5, instructor),
        status = COALESCE($6, status),
        file_url = COALESCE($7, file_url)
      WHERE id = $8 RETURNING *`,
      [title, description, duration, fee, instructor, status, fileUrl, req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.json({
      success: true,
      message: "Course updated",
      course: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating course" });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};
