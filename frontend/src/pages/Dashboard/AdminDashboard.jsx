import { useState } from "react";
import UserManagement from "../AdminComponents/UserManagement";
import AgentManagement from "../AdminComponents/AgentManagement";
import PolicyWorkflow from "../AdminComponents/PolicyWorkflow";
import Dashboard from "../AdminComponents/Dashboard";

const AdminDashboard = ({ showSidebar = true }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  if (!showSidebar) {
    return (
      <div className="p-6 bg-[#111111]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1cb08b]"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard handleNavigation={handleNavigation} />;
      case "users":
        return <UserManagement />;
      case "agents":
        return <AgentManagement />;
      case "policies":
        return <PolicyWorkflow />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#111111]">
      {/* Left Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-[#1c1c1c] text-white transition-all duration-300 ease-in-out relative`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >


        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation("dashboard")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "dashboard"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Dashboard" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📊</span>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </div>
          </button>

          <button
            onClick={() => handleNavigation("users")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "users"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "User Management" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">👥</span>
              {!sidebarCollapsed && <span>User Management</span>}
            </div>
          </button>

          <button
            onClick={() => handleNavigation("agents")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "agents"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Agent Management" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">🎯</span>
              {!sidebarCollapsed && <span>Agent Management</span>}
            </div>
          </button>

          <button
            onClick={() => handleNavigation("policies")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "policies"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Policy & Workflow" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📋</span>
              {!sidebarCollapsed && <span>Policy & Workflow</span>}
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-400 text-center">
              <p>© 2024 InsurAI</p>
              <p>Admin Panel v2.0</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarCollapsed ? "ml-0" : ""
        }`}
      >


        {/* Content Area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1cb08b]"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
