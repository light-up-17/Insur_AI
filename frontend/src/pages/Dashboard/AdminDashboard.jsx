import { useState } from "react";
import UserManagement from "../AdminComponents/UserManagement";
import AgentManagement from "../AdminComponents/AgentManagement";
import PolicyWorkflow from "../AdminComponents/PolicyWorkflow";
import Dashboard from "../AdminComponents/Dashboard";

const AdminDashboard = ({ showSidebar = true }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  if (!showSidebar) {
    return (
      <div className="p-6 bg-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out relative`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-700 transition-colors"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation("dashboard")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "dashboard"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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
        {/* Header Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
              >
                ☰
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {activeView === "dashboard" && "Admin Dashboard"}
                  {activeView === "users" && "User Management"}
                  {activeView === "agents" && "Agent Management"}
                  {activeView === "policies" && "Policy & Workflow"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeView === "dashboard" && "Overview of system performance and key metrics"}
                  {activeView === "users" && "Manage user accounts, roles, and permissions"}
                  {activeView === "agents" && "Monitor agent performance and manage activities"}
                  {activeView === "policies" && "Manage insurance policies and workflow configurations"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>🕐</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
