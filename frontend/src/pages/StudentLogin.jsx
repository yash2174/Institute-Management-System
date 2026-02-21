import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, GraduationCap, Mail, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(form);
      if (data.success) {
        toast.success("Login successful 🎓");
        navigate("/student/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/2675050/pexels-photo-2675050.jpeg?auto=compress&cs=tinysrgb&w=1920')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-sm mx-4 sm:mx-auto">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to portal
        </Link>

        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center shadow-lg">
              <GraduationCap size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Student Login</h1>
            <p className="text-white/45 text-sm mt-1">Access your student dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="px-8 py-7 space-y-4">

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-blue-400/60 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/35 text-sm outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-blue-400/60 rounded-xl pl-10 pr-11 py-3 text-white placeholder-white/35 text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 !mt-6"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {/* Register link */}
            <p className="text-center text-white/40 text-xs pt-1">
              Don't have an account?{" "}
              <Link to="/student/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Register here
              </Link>
            </p>

          </form>

          {/* Footer */}
          <div className="pb-5 text-center">
            <p className="text-white/20 text-xs">© 2026 Institute Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}