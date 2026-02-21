import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchExams = async () => {
    const res = await api.get("/exams/student/available");
    setExams(res.data.exams);
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Exams</h1>

      <div className="grid gap-6">
        {exams.length === 0 ? (
  <div className="card p-6 text-center">
    <h2 className="text-lg font-semibold text-gray-600">
      No Exams Available
    </h2>
    <p className="text-gray-500 mt-2">
      Please check back later or contact your administrator.
    </p>
  </div>
) : (
  <div className="grid gap-6">
    {exams.map((exam) => (
      <div key={exam.id} className="card p-6 shadow">
        <h2 className="text-xl font-semibold">{exam.title}</h2>
        <p>Course: {exam.course_title}</p>
        <p>Duration: {exam.duration} mins</p>

        {exam.has_attempted > 0 ? (
          <button
            className="bg-gray-400 text-white px-4 py-2 mt-4 rounded cursor-not-allowed"
            disabled
          >
            Already Attempted
          </button>
        ) : (
          <button
            onClick={() => navigate(`/student/exams/${exam.id}`)}
            className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
          >
            Start Exam
          </button>
        )}
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}
