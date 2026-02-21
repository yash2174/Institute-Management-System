import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, LogOut, User } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-3 sm:px-6 h-16 flex justify-between items-center">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">

          {/* Hamburger */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Logo */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 shadow-md shadow-blue-200">
            IMS
          </div>

          {/* Title — hidden on very small screens */}
          <Link
            to={isAdmin ? "/admin/dashboard" : "/student/dashboard"}
            className="text-sm sm:text-base font-semibold text-gray-800 truncate hidden xs:block sm:block hover:text-blue-600 transition-colors"
          >
            <span className="hidden md:inline">Institute Management System</span>
            <span className="inline md:hidden">IMS Portal</span>
          </Link>
        </div>

        {/* RIGHT SECTION */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {/* User info — hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={14} className="text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 leading-tight max-w-[140px] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 capitalize leading-tight">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Role badge — mobile only */}
            <span className="sm:hidden text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-full capitalize truncate max-w-[80px]">
              {user.name?.split(" ")[0]}
            </span>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm"
              aria-label="Logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}