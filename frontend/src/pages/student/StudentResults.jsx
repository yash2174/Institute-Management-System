import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await api.get("/exams/student/results");
      setResults(res.data.results);
      setLoading(false);
    };
    fetchResults();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
  <h1 className="text-3xl font-bold mb-6">My Exam Results</h1>

  {results.length === 0 ? (
    <div className="card p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-600">
        No Results Found
      </h2>
      <p className="text-gray-500 mt-2">
        You haven't attempted any exams yet.
      </p>
    </div>
  ) : (
    results.map((r) => (
      <div key={r.id} className="card p-6 mb-4 shadow">
        <h2 className="text-xl font-semibold">{r.exam_title}</h2>
        <p>Course: {r.course_title}</p>
        <p>
          Score: {r.score}/{r.total_marks}
        </p>
        <p>Percentage: {r.percentage}%</p>
        <p
          className={
            r.status === "pass"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {r.status.toUpperCase()}
        </p>
      </div>
    ))
  )}
</div>

  );
}
