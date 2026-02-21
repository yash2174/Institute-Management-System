import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// Public Pages
import AuthSelection from "./pages/AuthSelection";
import Login from "./pages/Login"; // Admin Login
import StudentLogin from "./pages/StudentLogin";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminExams from "./pages/admin/AdminExams";
import AdminResults from "./pages/admin/AdminResults";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentEnrollments from "./pages/student/StudentEnrollments";
import StudentExams from "./pages/student/StudentExams";
import TakeExam from "./pages/student/TakeExam";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";

import { Toaster } from "react-hot-toast";


export default function App() {
  return (
    <BrowserRouter>
       <Toaster position="top-center" />
      <AuthProvider>
        <Routes>

          {/*Landing Page */}
          <Route path="/" element={<AuthSelection />} />
          <Route path="/login" element={<AuthSelection />} />


          {/*Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Student Authentication */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<Register />} />

          {/*Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="results" element={<AdminResults />} />
          </Route>

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="enrollments" element={<StudentEnrollments />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="exams/:id" element={<TakeExam />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
