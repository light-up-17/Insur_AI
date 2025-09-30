import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationList from "./Components/NotificationList";
import UserDashboard from "./Dashboard/UserDashboard";
import AgentDashboard from "./Dashboard/AgentDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const category = user?.category || "USER";
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="bg-[#1c1c1c] shadow-sm p-4 flex justify-between items-center border-b border-[#333333]">
        <h1 className="text-xl font-bold text-[#1cb08b]">Insur-AI</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-400">Welcome, {user?.firstName || "User"}</span>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1c1c1c] rounded-md shadow-lg border border-[#333333] z-50">
                <NotificationList />
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md
                       hover:bg-red-700 transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Role-based dashboard */}
      {category === "USER" && <UserDashboard />}
      {category === "AGENT" && <AgentDashboard />}
      {category === "ADMIN" && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
