import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    const res = await api.get("/exams/results/all");
    setResults(res.data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Exam Results</h1>

      <div className="card p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Student</th>
              <th className="border p-2">Exam</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td className="border p-2">{r.student_name}</td>
                <td className="border p-2">{r.exam_title}</td>
                <td className="border p-2">{r.course_title}</td>
                <td className="border p-2">
                  {r.score}/{r.total_marks}
                </td>
                <td className={`border p-2 ${r.status === "pass" ? "text-green-600" : "text-red-600"}`}>
                  {r.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
