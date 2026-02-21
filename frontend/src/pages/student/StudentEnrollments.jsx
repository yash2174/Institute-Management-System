import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const courseRes = await api.get("/courses");
      const enrollRes = await api.get("/enrollments/my-enrollments");

      setCourses(courseRes.data.courses);

      const ids = enrollRes.data.enrollments.map(
        (e) => e.course_id
      );

      setEnrolledCourseIds(ids);

    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post("/enrollments/enroll", { courseId });
      fetchData(); // refresh after enroll
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);

          return (
            <div key={course.id} className="card p-6 shadow">
              <h2 className="text-xl font-semibold mb-2">
                {course.title}
              </h2>

              <p className="text-gray-600 mb-3">
                {course.description}
              </p>

              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Fee:</strong> ₹{course.fee}</p>
              </div>

              {/*If NOT Enrolled */}
              {!isEnrolled && (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Enroll
                </button>
              )}

              {/* If Enrolled → Show Content */}
              {isEnrolled && course.file_url && (
                <div className="mt-4">
                  {course.file_url.endsWith(".mp4") ? (
                    <video
                      controls
                      className="w-full rounded-lg"
                      src={course.file_url}
                    />
                  ) : course.file_url.endsWith(".pdf") ? (
                    <iframe
                      src={course.file_url}
                      className="w-full h-64 rounded-lg border"
                      title="PDF Viewer"
                    />
                  ) : null}
                </div>
              )}

              {isEnrolled && (
                <div className="mt-3 text-green-600 font-semibold">
                  ✅ Enrolled
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
