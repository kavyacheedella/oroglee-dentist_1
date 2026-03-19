import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-teal-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19.5 8.5l-7.5 7.5-7.5-7.5m7.5 7.5V3" />
              </svg>
            </div>
            <span className="font-heading text-xl font-bold text-teal-700">OroGlee</span>
            <span className="hidden sm:inline text-xs font-body text-teal-400 mt-1">Dental Care</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              }`}
            >
              Find Dentists
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/admin")
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                  }`}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
