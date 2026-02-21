import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    startTime: "",
    endTime: "",
    questions: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const examRes = await api.get("/exams/all");
      const courseRes = await api.get("/courses");
      setExams(examRes.data.exams);
      setCourses(courseRes.data.courses);
    } catch {
      setError("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
          marks: "",
        },
      ],
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...form.questions];
    updated[index][field] = value;
    setForm({ ...form, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams", form);
      fetchData();
      alert("Exam Created");
    } catch {
      setError("Exam creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    await api.delete(`/exams/${id}`);
    fetchData();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Exam Management</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* CREATE EXAM */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Exam</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            onChange={(e) =>
              setForm({ ...form, courseId: e.target.value })
            }
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <input
            placeholder="Exam Title"
            className="border p-2 w-full rounded"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            className="border p-2 w-full rounded"
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Total Marks"
            className="border p-2 w-full rounded"
            onChange={(e) =>
              setForm({ ...form, totalMarks: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Passing Marks"
            className="border p-2 w-full rounded"
            onChange={(e) =>
              setForm({ ...form, passingMarks: e.target.value })
            }
            required
          />

          <button
            type="button"
            onClick={addQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>

          {form.questions.map((q, index) => (
            <div key={index} className="border p-4 rounded space-y-2">
              <input
                placeholder="Question"
                className="border p-2 w-full rounded"
                onChange={(e) =>
                  handleQuestionChange(index, "questionText", e.target.value)
                }
                required
              />
              <input placeholder="Option A" className="border p-2 w-full rounded"
                onChange={(e) => handleQuestionChange(index, "optionA", e.target.value)} required />
              <input placeholder="Option B" className="border p-2 w-full rounded"
                onChange={(e) => handleQuestionChange(index, "optionB", e.target.value)} required />
              <input placeholder="Option C" className="border p-2 w-full rounded"
                onChange={(e) => handleQuestionChange(index, "optionC", e.target.value)} required />
              <input placeholder="Option D" className="border p-2 w-full rounded"
                onChange={(e) => handleQuestionChange(index, "optionD", e.target.value)} required />
              <input placeholder="Correct Answer (A/B/C/D)"
                className="border p-2 w-full rounded"
                onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)} required />
              <input type="number" placeholder="Marks"
                className="border p-2 w-full rounded"
                onChange={(e) => handleQuestionChange(index, "marks", e.target.value)} required />
            </div>
          ))}

          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Create Exam
          </button>
        </form>
      </div>

      {/* EXAM LIST */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">All Exams</h2>
        {exams.map((exam) => (
          <div key={exam.id} className="border p-4 mb-3 rounded">
            <h3 className="font-semibold">{exam.title}</h3>
            <p>Course: {exam.course_title}</p>
            <p>Duration: {exam.duration} mins</p>
            <button
              onClick={() => handleDelete(exam.id)}
              className="bg-red-600 text-white px-3 py-1 mt-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
