import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enrollments");
      setEnrollments(res.data.enrollments);
    } catch (err) {
      setError("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?"))
      return;

    try {
      await api.delete(`/enrollments/${id}`);
      fetchEnrollments();
    } catch (err) {
      setError("Delete failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Enrollments</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="card p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Student Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No enrollments found
                </td>
              </tr>
            ) : (
              enrollments.map((enroll) => (
                <tr key={enroll.id}>
                  <td className="border p-2">{enroll.student_name}</td>
                  <td className="border p-2">{enroll.email}</td>
                  <td className="border p-2">{enroll.course_title}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(enroll.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
