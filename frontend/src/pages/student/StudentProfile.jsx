import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const res = await api.get("/users/profile");
    setProfile(res.data.user);
    setStats(res.data.stats);
    setForm(res.data.user);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    await api.put("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchProfile();
    alert("Profile updated");
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="card p-6 text-center">
          {profile.profile_photo ? (
            <img
              src={profile.profile_photo}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4" />
          )}

          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>

        {/* Stats */}
        <div className="card p-6 col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded text-center">
            <p className="text-lg font-bold">{stats.totalEnrollments}</p>
            <p>Total Enrollments</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded text-center">
            <p className="text-lg font-bold">{stats.examsAttempted}</p>
            <p>Exams Attempted</p>
          </div>

          <div className="bg-green-100 p-4 rounded text-center">
            <p className="text-lg font-bold">{stats.examsPassed}</p>
            <p>Exams Passed</p>
          </div>

          <div className="bg-purple-100 p-4 rounded text-center">
            <p className="text-lg font-bold">
              {stats.completionPercentage}%
            </p>
            <p>Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <div className="card p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            value={form.name || ""}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Name"
          />

          <input
            value={form.phone || ""}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Phone"
          />

          <input
            value={form.address || ""}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            className="border p-2 rounded"
            placeholder="Address"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, photo: e.target.files[0] })
            }
            className="border p-2 rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
