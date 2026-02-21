import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    fee: "",
    instructor: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data.courses);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      if (editingId) {
        await api.put(`/courses/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/courses", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({ title: "", description: "", duration: "", fee: "", instructor: "" });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      fee: course.fee || "",
      instructor: course.instructor || "",
    });
    setEditingId(course.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Course Management</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="card p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {editingId ? "✏️ Update Course" : "➕ Add New Course"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Course Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded text-sm w-full"
            required
          />
          <input
            name="duration"
            placeholder="Duration"
            value={form.duration}
            onChange={handleChange}
            className="border p-2 rounded text-sm w-full"
            required
          />
          <input
            name="fee"
            type="number"
            placeholder="Fee"
            value={form.fee}
            onChange={handleChange}
            className="border p-2 rounded text-sm w-full"
            required
          />
          <input
            name="instructor"
            placeholder="Instructor"
            value={form.instructor}
            onChange={handleChange}
            className="border p-2 rounded text-sm w-full"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded text-sm col-span-1 sm:col-span-2 w-full"
            rows={3}
            required
          />
          <input
            type="file"
            accept=".mp4,.pdf"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="border p-2 rounded text-sm col-span-1 sm:col-span-2 w-full"
          />

          <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium text-sm transition-colors"
            >
              {editingId ? "Update Course" : "Create Course"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ title: "", description: "", duration: "", fee: "", instructor: "" });
                }}
                className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Courses List */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">All Courses</h2>

        {courses.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No Courses Available</p>
        ) : (
          <>
            {/* Desktop Table — hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Title</th>
                    <th className="border p-2 text-left">Instructor</th>
                    <th className="border p-2 text-left">Duration</th>
                    <th className="border p-2 text-left">Fee</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="border p-2">{course.title}</td>
                      <td className="border p-2">{course.instructor}</td>
                      <td className="border p-2">{course.duration}</td>
                      <td className="border p-2">₹{course.fee}</td>
                      <td className="border p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards — shown only on mobile */}
            <div className="flex flex-col gap-3 md:hidden">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                      {course.title}
                    </h3>
                    <span className="text-sm font-bold text-blue-600 whitespace-nowrap">
                      ₹{course.fee}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    <div>
                      <span className="font-medium text-gray-600">Instructor: </span>
                      {course.instructor}
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Duration: </span>
                      {course.duration}
                    </div>
                    {course.description && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">About: </span>
                        <span className="line-clamp-2">{course.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}