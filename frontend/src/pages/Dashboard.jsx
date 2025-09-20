import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserDashboard from "./Dashboard/UserDashboard";
import AgentDashboard from "./Dashboard/AgentDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const category = user?.category || "USER";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Insur-AI</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user?.firstName || "User"}</span>

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
