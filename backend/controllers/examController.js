import pool from '../config/database.js';

export const createExam = async (req, res) => {
  try {
    const { courseId, title, description, duration, totalMarks, passingMarks, startTime, endTime, questions } = req.body;
    const examResult = await pool.query(
      'INSERT INTO exams (course_id, title, description, duration, total_marks, passing_marks, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [courseId, title, description, duration, totalMarks, passingMarks, startTime, endTime]
    );
    const exam = examResult.rows[0];
    for (const q of questions) {
      await pool.query(
        'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [exam.id, q.questionText, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer, q.marks]
      );
    }
    res.status(201).json({ success: true, message: 'Exam created', exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating exam' });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const result = await pool.query('SELECT e.*, c.title as course_title FROM exams e JOIN courses c ON e.course_id = c.id ORDER BY e.start_time DESC');
    res.json({ success: true, count: result.rows.length, exams: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const getStudentExams = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT e.*, c.title as course_title, (SELECT COUNT(*) FROM exam_results WHERE exam_id = e.id AND student_id = $1) as has_attempted
       FROM exams e JOIN courses c ON e.course_id = c.id JOIN enrollments en ON en.course_id = c.id
       WHERE en.student_id = $1 AND en.status = 'active' ORDER BY e.start_time DESC`,
      [req.user.id]
    );
    res.json({ success: true, count: result.rows.length, exams: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const getExamDetails = async (req, res) => {
  try {
    const examResult = await pool.query('SELECT e.*, c.title as course_title FROM exams e JOIN courses c ON e.course_id = c.id WHERE e.id = $1', [req.params.id]);
    if (examResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Exam not found' });
    const exam = examResult.rows[0];
    const questionsResult = await pool.query('SELECT id, question_text, option_a, option_b, option_c, option_d, marks FROM questions WHERE exam_id = $1', [req.params.id]);
    exam.questions = questionsResult.rows;
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const examResult = await pool.query('SELECT * FROM exams WHERE id = $1', [examId]);
    if (examResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Exam not found' });
    const exam = examResult.rows[0];
    const existing = await pool.query('SELECT * FROM exam_results WHERE exam_id = $1 AND student_id = $2', [examId, req.user.id]);
    if (existing.rows.length > 0) return res.status(400).json({ success: false, message: 'Already submitted' });
    const questionsResult = await pool.query('SELECT * FROM questions WHERE exam_id = $1', [examId]);
    const questions = questionsResult.rows;
    let totalScore = 0;
    const answerDetails = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return null;
      const isCorrect = answer.selectedAnswer === question.correct_answer;
      const marksObtained = isCorrect ? question.marks : 0;
      totalScore += marksObtained;
      return { questionId: answer.questionId, selectedAnswer: answer.selectedAnswer, isCorrect, marksObtained };
    }).filter(a => a !== null);
    const percentage = (totalScore / exam.total_marks) * 100;
    const status = totalScore >= exam.passing_marks ? 'pass' : 'fail';
    const resultInsert = await pool.query(
      'INSERT INTO exam_results (exam_id, student_id, score, total_marks, percentage, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [examId, req.user.id, totalScore, exam.total_marks, percentage.toFixed(2), status]
    );
    const examResultRecord = resultInsert.rows[0];
    for (const answer of answerDetails) {
      await pool.query(
        'INSERT INTO student_answers (result_id, question_id, selected_answer, is_correct, marks_obtained) VALUES ($1, $2, $3, $4, $5)',
        [examResultRecord.id, answer.questionId, answer.selectedAnswer, answer.isCorrect, answer.marksObtained]
      );
    }
    res.status(201).json({ success: true, message: 'Exam submitted', result: { score: totalScore, totalMarks: exam.total_marks, percentage: percentage.toFixed(2), status } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Submission failed' });
  }
};

export const getMyResults = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT er.*, e.title as exam_title, c.title as course_title FROM exam_results er JOIN exams e ON er.exam_id = e.id JOIN courses c ON e.course_id = c.id WHERE er.student_id = $1 ORDER BY er.submitted_at DESC',
      [req.user.id]
    );
    res.json({ success: true, count: result.rows.length, results: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const getResultDetails = async (req, res) => {
  try {
    const resultQuery = await pool.query(
      'SELECT er.*, e.title as exam_title, c.title as course_title FROM exam_results er JOIN exams e ON er.exam_id = e.id JOIN courses c ON e.course_id = c.id WHERE er.id = $1 AND er.student_id = $2',
      [req.params.id, req.user.id]
    );
    if (resultQuery.rows.length === 0) return res.status(404).json({ success: false, message: 'Result not found' });
    const result = resultQuery.rows[0];
    const answersQuery = await pool.query(
      'SELECT sa.*, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.marks FROM student_answers sa JOIN questions q ON sa.question_id = q.id WHERE sa.result_id = $1',
      [req.params.id]
    );
    result.answers = answersQuery.rows;
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const getAllResults = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT er.*, u.name as student_name, u.email, e.title as exam_title, c.title as course_title FROM exam_results er JOIN users u ON er.student_id = u.id JOIN exams e ON er.exam_id = e.id JOIN courses c ON e.course_id = c.id ORDER BY er.submitted_at DESC'
    );
    res.json({ success: true, count: result.rows.length, results: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { title, description, duration, totalMarks, passingMarks, startTime, endTime, status } = req.body;
    const result = await pool.query(
      'UPDATE exams SET title = COALESCE($1, title), description = COALESCE($2, description), duration = COALESCE($3, duration), total_marks = COALESCE($4, total_marks), passing_marks = COALESCE($5, passing_marks), start_time = COALESCE($6, start_time), end_time = COALESCE($7, end_time), status = COALESCE($8, status) WHERE id = $9 RETURNING *',
      [title, description, duration, totalMarks, passingMarks, startTime, endTime, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam updated', exam: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export const deleteExam = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM exams WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
};
export const getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        COUNT(er.id) AS exams_attempted,
        SUM(CASE WHEN er.status = 'pass' THEN 1 ELSE 0 END) AS exams_passed,
        COALESCE(AVG(er.percentage), 0) AS avg_percentage,
        COALESCE(SUM(er.score), 0) AS total_score
      FROM users u
      LEFT JOIN exam_results er ON u.id = er.student_id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      leaderboard: result.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching leaderboard" });
  }
};
