import { useState, useEffect } from "react";
import { Link ,useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,Legend,} from "recharts";
import { Trophy } from "lucide-react";



export default function StudentDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    examsAttempted: 0,
    examsPassed: 0,
    completionPercentage: 0,
  });
  const [leaderboard, setLeaderboard] = useState([]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/profile");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    const fetchLeaderboard = async () => {
  try {
    const res = await api.get("/exams/leaderboard");
    setLeaderboard(res.data.leaderboard);
  } catch (err) {
    console.error("Failed to fetch leaderboard");
  }
};

fetchLeaderboard();


    fetchStats();
  }, []);


  useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("scroll") === "leaderboard") {
    const el = document.getElementById("leaderboard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}, [location]);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-8">
        Here's your learning overview
      </p>

      {/* Dynamic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-blue-100 text-sm">
            Enrolled Courses
          </p>
          <p className="text-4xl font-bold mt-2">
            {stats.totalEnrollments}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-green-100 text-sm">
            Exams Completed
          </p>
          <p className="text-4xl font-bold mt-2">
            {stats.examsAttempted}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-purple-100 text-sm">
            Pass Rate
          </p>
          <p className="text-4xl font-bold mt-2">
            {stats.completionPercentage}%
          </p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card">
          <h3 className="text-xl font-bold mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/student/courses"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <p className="font-semibold">📚 Browse Courses</p>
              <p className="text-sm text-gray-600">
                Find and enroll in new courses
              </p>
            </Link>

            <Link
              to="/student/exams"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <p className="font-semibold">📋 Take Exams</p>
              <p className="text-sm text-gray-600">
                View available exams
              </p>
            </Link>

            <Link
              to="/student/results"
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <p className="font-semibold">🏆 View Results</p>
              <p className="text-sm text-gray-600">
                Check your exam scores
              </p>
            </Link>
          </div>
        </div>
      <div className="card">
  <h3 className="text-xl font-bold mb-4">
    Performance Overview
  </h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={[
        {
          name: "Stats",
          Enrollments: stats.totalEnrollments,
          Attempted: stats.examsAttempted,
          Passed: stats.examsPassed,
        },
      ]}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Legend />
      <Bar dataKey="Enrollments" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      <Bar dataKey="Attempted" fill="#f59e0b" radius={[6, 6, 0, 0]} />
      <Bar dataKey="Passed" fill="#22c55e" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

          <div className="card mt-6">
            <div id="leaderboard" className="card mt-6 scroll-mt-24">

  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
    <Trophy className="text-yellow-500" /> Top Performers
  </h3>

  {leaderboard.length === 0 ? (
    <p className="text-gray-500">No leaderboard data available</p>
  ) : (
    <div className="space-y-3">
      {leaderboard.map((student, index) => (
        <div
          key={student.id}
          className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${
            index === 0
              ? "bg-yellow-100"
              : index === 1
              ? "bg-gray-100"
              : index === 2
              ? "bg-orange-100"
              : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">#{index + 1}</span>
            <div>
              <p className="font-semibold">{student.name}</p>
              <p className="text-sm text-gray-500">
                Avg: {parseFloat(student.avg_percentage).toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-blue-600">
              {student.total_score} pts
            </p>
            <p className="text-sm text-gray-500">
              Passed: {student.exams_passed}
            </p>
          </div>
        </div>
        
      ))}
    </div>
  )}
</div>

</div>

      </div>
    </div>
  );
}
