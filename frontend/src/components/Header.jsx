import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import learnXlogo from "../assets/learnXlogo.jpeg";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "One on One", path: "/chat" },
    { name: "AI Matches", path: "/matches" },
    { name: "Calendar", path: "/scheduler" },
    { name: "Resources", path: "/resources" },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-3 sm:py-4 flex justify-between items-center">

        {/* LOGO */}
        {/* LOGO */}
<img
  src={learnXlogo}
  alt="LearnX Logo"
  onClick={() => navigate(currentUser ? "/home" : "/login")}
  className="h-14 sm:h-16 w-auto object-contain cursor-pointer"
/>
        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-3 lg:gap-4 flex-wrap">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 lg:px-5 py-2 rounded-full text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 sm:gap-4 relative">

          {/* PROFILE */}
          <div className="relative">
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="cursor-pointer"
            >
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt="Profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg border-2 border-transparent hover:border-blue-300 transition">
                  👤
                </div>
              )}
            </div>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-44 sm:w-48 bg-white shadow-xl rounded-xl p-2 border border-gray-100">
                {currentUser ? (
                  <>
                    <div className="px-3 py-2 mb-1 border-b border-gray-50">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        Account
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-500 font-medium mt-1"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg text-sm text-blue-600 font-semibold"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        navigate("/register");
                        setProfileOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 sm:px-6 py-4 space-y-2 shadow-inner">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}