import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data.courses); // aligned with backend
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="card p-6 text-center">
          No courses available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card p-6 shadow">
              <h2 className="text-xl font-semibold mb-2">
                {course.title}
              </h2>

              <p className="text-gray-600 mb-3">
                {course.description}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Fee:</strong> ₹{course.fee}</p>
              </div>
{course.file_url && (
  <div className="mt-4">
    {course.file_url.endsWith(".mp4") ? (
      <video
        controls
        className="w-full rounded-lg shadow"
        src={course.file_url}
      />
    ) : course.file_url.endsWith(".pdf") ? (
      <iframe
        src={course.file_url}
        title="PDF Viewer"
        className="w-full h-64 rounded-lg border"
      />
    ) : null}
  </div>
)}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
