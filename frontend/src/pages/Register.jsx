import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Eye, EyeOff, UserPlus, Mail, Lock, User,
  Phone, MapPin, ChevronRight, ArrowLeft, ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 4) return { label: "Medium", color: "bg-yellow-400", width: "66%" };
    return { label: "Strong", color: "bg-green-400", width: "100%" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      await api.post("/auth/register", data);
      toast.success("OTP sent to your email 📩");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify", {
        email: formData.email,
        code: otp,
      });
      toast.success("Email verified successfully 🎓");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/#/student/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-green-400/60 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/35 text-sm outline-none transition-all";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative py-8"
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

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step >= s
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-white/30 border border-white/15"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <span className={`text-xs transition-colors ${step >= s ? "text-white/70" : "text-white/25"}`}>
                {s === 1 ? "Details" : "Verify"}
              </span>
              {s < 2 && <div className={`flex-1 h-px w-8 ${step > 1 ? "bg-green-500/50" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
            <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
              step === 1
                ? "bg-green-600/40 border border-green-400/30"
                : "bg-blue-600/40 border border-blue-400/30"
            }`}>
              {step === 1
                ? <UserPlus size={24} className="text-white" />
                : <ShieldCheck size={24} className="text-white" />
              }
            </div>
            <h1 className="text-2xl font-bold text-white">
              {step === 1 ? "Create Account" : "Verify Your Email"}
            </h1>
            <p className="text-white/45 text-sm mt-1">
              {step === 1
                ? "Join the Institute Management System"
                : `OTP sent to ${formData.email}`}
            </p>
          </div>

          {/* Step 1 — Registration form */}
          {step === 1 && (
            <form onSubmit={handleRegister} className="px-8 py-7 space-y-3">

              {/* Full Name */}
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Address */}
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-3.5 text-white/40 pointer-events-none" />
                <textarea
                  placeholder="Address"
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 focus:border-green-400/60 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/35 text-sm outline-none transition-all resize-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength */}
              {formData.password && (
                <div className="space-y-1.5 px-0.5">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-white/50">
                    Password strength:{" "}
                    <span className={`font-medium ${
                      strength.label === "Weak" ? "text-red-400" :
                      strength.label === "Medium" ? "text-yellow-400" : "text-green-400"
                    }`}>
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs px-0.5 ${
                  formData.password === formData.confirmPassword
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-green-900/30 !mt-5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-white/40 text-xs pt-1">
                Already have an account?{" "}
                <Link to="/student/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* Step 2 — OTP Verify */}
          {step === 2 && (
            <form onSubmit={handleVerify} className="px-8 py-8 space-y-5">
              <p className="text-white/50 text-sm text-center leading-relaxed">
                We've sent a 6-digit verification code to your email. Enter it below to activate your account.
              </p>

              {/* OTP input */}
              <input
                type="text"
                placeholder="• • • • • •"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-blue-400/60 rounded-xl px-4 py-4 text-white placeholder-white/20 text-center text-2xl tracking-[0.5em] outline-none transition-all font-mono"
              />

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="group w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-900/30"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Continue
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-white/35 hover:text-white/60 text-xs text-center transition-colors"
              >
                ← Go back and edit details
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="pb-5 text-center">
            <p className="text-white/20 text-xs">© 2026 Institute Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}