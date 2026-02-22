import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { sendVerificationEmail } from "../utils/sendEmails.js";

const generateToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
  });
}


    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password, role, phone, address, verification_code, verification_expires) 
       VALUES ($1, $2, $3, 'student', $4, $5, $6, $7) 
       RETURNING *`,
      [name, email, hashedPassword, phone, address, verificationCode, expiry]
    );

    await sendVerificationEmail(email, name, verificationCode);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    
    // Only enforce verification for students
    if (user.role === "student" && !user.is_verified) {
      return res.status(403).json({
    success: false,
    message: "Please verify your email before logging in",
  });
}

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ success: false, message: "User not found" });

    const user = result.rows[0];

    if (String(user.verification_code) !== String(code))
      return res.status(400).json({ success: false, message: "Invalid code" });

    if (new Date(user.verification_expires) < new Date())
      return res.status(400).json({ success: false, message: "Code expired" });

    // Update user as verified
    await pool.query(
      "UPDATE users SET is_verified = true, verification_code = NULL, verification_expires = NULL WHERE email = $1",
      [email]
    );

    // Generate token immediately
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};



export const getProfile = async (req, res) => {
  try {
    const userQuery = await pool.query(
      'SELECT id, name, email, role, phone, address, profile_photo FROM users WHERE id = $1',
      [req.user.id]
    );

    const enrollCount = await pool.query(
      'SELECT COUNT(*) FROM enrollments WHERE student_id = $1',
      [req.user.id]
    );

    const examAttempted = await pool.query(
      'SELECT COUNT(*) FROM exam_results WHERE student_id = $1',
      [req.user.id]
    );

    const examPassed = await pool.query(
      "SELECT COUNT(*) FROM exam_results WHERE student_id = $1 AND status = 'pass'",
      [req.user.id]
    );

    const attempted = parseInt(examAttempted.rows[0].count);
    const passed = parseInt(examPassed.rows[0].count);

    const completion =
      attempted === 0 ? 0 : ((passed / attempted) * 100).toFixed(2);

    res.json({
      success: true,
      user: userQuery.rows[0],
      stats: {
        totalEnrollments: parseInt(enrollCount.rows[0].count),
        examsAttempted: attempted,
        examsPassed: passed,
        completionPercentage: completion,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const photoUrl = req.file ? req.file.location : null;

    const result = await pool.query(
      `UPDATE users SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        address = COALESCE($3, address),
        profile_photo = COALESCE($4, profile_photo)
       WHERE id = $5 RETURNING *`,
      [name, phone, address, photoUrl, req.user.id]
    );

    res.json({ success: true, message: 'Profile updated', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

