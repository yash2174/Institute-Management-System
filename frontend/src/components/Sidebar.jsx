import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  FileText,
  BarChart2,
  UserCircle,
  Trophy,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const adminLinks = [
    { name: "Dashboard",   path: "/admin/dashboard",   icon: LayoutDashboard },
    { name: "Courses",     path: "/admin/courses",     icon: BookOpen },
    { name: "Students",    path: "/admin/students",    icon: Users },
    { name: "Enrollments", path: "/admin/enrollments", icon: ClipboardList },
    { name: "Exams",       path: "/admin/exams",       icon: FileText },
    { name: "Results",     path: "/admin/results",     icon: BarChart2 },
  ];

  const studentLinks = [
    { name: "Dashboard",      path: "/student/dashboard",   icon: LayoutDashboard },
    { name: "Courses",        path: "/student/courses",     icon: BookOpen },
    { name: "My Enrollments", path: "/student/enrollments", icon: ClipboardList },
    { name: "Exams",          path: "/student/exams",       icon: FileText },
    { name: "Results",        path: "/student/results",     icon: BarChart2 },
    { name: "Profile",        path: "/student/profile",     icon: UserCircle },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const NavLink = ({ link }) => {
    const isActive = location.pathname === link.path;
    const Icon = link.icon;
    return (
      <Link
        to={link.path}
        onClick={() => {
          // Close sidebar on mobile after navigation
          if (window.innerWidth < 768 && toggleSidebar) toggleSidebar();
        }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
          ${isActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
      >
        <Icon
          size={18}
          className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
        />
        <span className="truncate">{link.name}</span>
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 md:top-16 left-0 z-40 md:z-auto
          h-screen md:h-[calc(100vh-4rem)]
          bg-white border-r border-gray-200 shadow-xl md:shadow-sm
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden"}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
              IMS
            </div>
            <span className="text-sm font-semibold text-gray-700">Menu</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">

          {/* Section label */}
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            {isAdmin ? "Administration" : "My Portal"}
          </p>

          {links.map((link) => (
            <NavLink key={link.path} link={link} />
          ))}

          {/* Leaderboard — student only */}
          {!isAdmin && (
            <>
              <p className="px-3 pt-4 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Community
              </p>
              <a
                href="/student/dashboard?scroll=leaderboard"
                onClick={() => { if (window.innerWidth < 768 && toggleSidebar) toggleSidebar(); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150 group"
              >
                <Trophy size={18} className="flex-shrink-0 text-gray-400 group-hover:text-amber-500 transition-colors group-hover:scale-110" />
                <span>Leaderboard</span>
              </a>
            </>
          )}
        </nav>

        {/* Bottom branding */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center">
            © 2026 Institute Management System
          </p>
        </div>
      </aside>
    </>
  );
}