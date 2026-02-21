import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, ChevronRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
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
        toast.success("Welcome back, Admin 🛡️");
        navigate("/admin/dashboard");
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
          "url('https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg')",
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
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-600/40 border border-red-400/30 flex items-center justify-center shadow-lg">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-white/45 text-sm mt-1">Manage institute operations</p>
          </div>

          <form onSubmit={handleLogin} className="px-8 py-7 space-y-4">

            {/* Demo credentials */}
            <div className="bg-black/30 border border-yellow-500/25 rounded-2xl p-4">
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
                🎯 Demo Credentials
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Email</span>
                  <span className="text-white/80 font-mono">admin@institute.com</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Password</span>
                  <span className="text-white/80 font-mono">admin123</span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="email"
                placeholder="Admin email address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-red-400/60 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/35 text-sm outline-none transition-all"
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
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-red-400/60 rounded-xl pl-10 pr-11 py-3 text-white placeholder-white/35 text-sm outline-none transition-all"
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
              className="group w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-red-900/30 mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In as Admin
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

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