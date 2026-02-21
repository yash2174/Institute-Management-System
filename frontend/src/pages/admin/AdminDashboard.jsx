import { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  const cards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: '👥', color: 'bg-blue-500' },
    { title: 'Total Courses', value: stats?.totalCourses || 0, icon: '📚', color: 'bg-green-500' },
    { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: '📝', color: 'bg-yellow-500' },
    { title: 'Total Exams', value: stats?.totalExams || 0, icon: '📋', color: 'bg-pink-500' },
    { title: 'Passed Exams', value: stats?.passedExams || 0, icon: '✅', color: 'bg-emerald-500' },
    { title: 'Failed Exams', value: stats?.failedExams || 0, icon: '❌', color: 'bg-red-500' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Recent Enrollments</h3>
          {stats?.recentEnrollments?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEnrollments.map((e, i) => (
                <div key={i} className="border-b pb-3">
                  <p className="font-medium">{e.student_name}</p>
                  <p className="text-sm text-gray-600">{e.course_title}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No recent enrollments</p>}
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Recent Results</h3>
          {stats?.recentResults?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentResults.map((r, i) => (
                <div key={i} className="border-b pb-3 flex justify-between">
                  <div>
                    <p className="font-medium">{r.student_name}</p>
                    <p className="text-sm text-gray-600">{r.exam_title}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {r.status?.toUpperCase()} - {r.percentage}%
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No recent results</p>}
        </div>
      </div>
    </div>
  );
}
