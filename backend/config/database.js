import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const initDatabase = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL, phone VARCHAR(20), address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

    await pool.query(`CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, duration VARCHAR(100),
      fee DECIMAL(10, 2), instructor VARCHAR(255), status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

    await pool.query(`CREATE TABLE IF NOT EXISTS enrollments (
      id SERIAL PRIMARY KEY, student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, status VARCHAR(50) DEFAULT 'active',
      UNIQUE(student_id, course_id))`);

    await pool.query(`CREATE TABLE IF NOT EXISTS exams (
      id SERIAL PRIMARY KEY, course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL, description TEXT, duration INTEGER NOT NULL,
      total_marks INTEGER NOT NULL, passing_marks INTEGER NOT NULL,
      start_time TIMESTAMP NOT NULL, end_time TIMESTAMP NOT NULL, status VARCHAR(50) DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

    await pool.query(`CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY, exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL, option_a TEXT NOT NULL, option_b TEXT NOT NULL,
      option_c TEXT NOT NULL, option_d TEXT NOT NULL, correct_answer VARCHAR(1) NOT NULL, marks INTEGER NOT NULL)`);

    await pool.query(`CREATE TABLE IF NOT EXISTS exam_results (
      id SERIAL PRIMARY KEY, exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES users(id) ON DELETE CASCADE, score INTEGER NOT NULL,
      total_marks INTEGER NOT NULL, percentage DECIMAL(5, 2), status VARCHAR(50),
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(exam_id, student_id))`);

    await pool.query(`CREATE TABLE IF NOT EXISTS student_answers (
      id SERIAL PRIMARY KEY, result_id INTEGER REFERENCES exam_results(id) ON DELETE CASCADE,
      question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE, selected_answer VARCHAR(1),
      is_correct BOOLEAN, marks_obtained INTEGER)`);

    const adminCheck = await pool.query("SELECT * FROM users WHERE email = 'admin@institute.com'");
    if (adminCheck.rows.length === 0) {
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.default.hash('admin123', 10);
      await pool.query(`INSERT INTO users (name, email, password, role, phone, address) VALUES ($1, $2, $3, $4, $5, $6)`,
        ['Admin User', 'admin@institute.com', hashedPassword, 'admin', '1234567890', 'Institute Address']);
      console.log('Admin: admin@institute.com / admin123');
    }
    console.log('Database ready');
  } catch (error) {
    console.error('DB error:', error);
  }
};

export default pool;
