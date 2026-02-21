import { Link } from "react-router-dom";
import { ShieldCheck, GraduationCap, UserPlus, ChevronRight } from "lucide-react";

export default function AuthSelection() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: "url('https://pescoe.ac.in/Aboutus/campus.jpg')",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4 sm:mx-auto">

        {/* Top badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Official Portal
          </span>
        </div>

        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
            {/* Logo mark */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg tracking-tight">IMS</span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-snug">
              Institute Management
            </h1>
            <p className="text-white/50 text-sm mt-1">Select your portal to continue</p>
          </div>

          {/* Links */}
          <div className="px-6 py-6 space-y-3">

            <Link
              to="/admin/login"
              className="group flex items-center gap-4 w-full px-4 py-3.5 bg-white/10 hover:bg-red-600/80 border border-white/15 hover:border-red-500/50 rounded-2xl text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-red-900/30 hover:shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-red-600/40 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <ShieldCheck size={17} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold leading-tight">Admin Login</p>
                <p className="text-white/50 text-xs group-hover:text-white/70 transition-colors">Manage institute operations</p>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/student/login"
              className="group flex items-center gap-4 w-full px-4 py-3.5 bg-white/10 hover:bg-blue-600/80 border border-white/15 hover:border-blue-500/50 rounded-2xl text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-blue-900/30 hover:shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600/40 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <GraduationCap size={17} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold leading-tight">Student Login</p>
                <p className="text-white/50 text-xs group-hover:text-white/70 transition-colors">Access your student dashboard</p>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/student/register"
              className="group flex items-center gap-4 w-full px-4 py-3.5 bg-white/10 hover:bg-green-600/80 border border-white/15 hover:border-green-500/50 rounded-2xl text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-green-900/30 hover:shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-green-600/40 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                <UserPlus size={17} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold leading-tight">Student Register</p>
                <p className="text-white/50 text-xs group-hover:text-white/70 transition-colors">Create a new student account</p>
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
            </Link>

          </div>

          {/* Footer */}
          <div className="px-6 pb-5 text-center">
            <p className="text-white/25 text-xs">© 2026 Institute Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}