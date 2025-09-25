import { useState } from "react";
import Dashboard from "../UserComponents/Dashboard";
import OnlineAgents from "../UserComponents/OnlineAgents";
import MyPolicies from "../UserComponents/MyPolicies";
import MyClaims from "../UserComponents/MyClaims";

const UserDashboard = ({ showSidebar = true }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  if (!showSidebar) {
    return (
      <div className="p-6 bg-gray-100">
        {renderContent()}
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "onlineagents":
        return <OnlineAgents />;
      case "mypolicies":
        return <MyPolicies />;
      case "myclaims":
        return <MyClaims />;
      default:
        return <Dashboard />;
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
            {!sidebarCollapsed && <h2 className="text-xl font-bold">User Panel</h2>}
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
            onClick={() => handleNavigation("onlineagents")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "onlineagents"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Online Agents" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">🎯</span>
              {!sidebarCollapsed && <span>Online Agents</span>}
            </div>
          </button>
          <button
            onClick={() => handleNavigation("mypolicies")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "mypolicies"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "My Policies" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📋</span>
              {!sidebarCollapsed && <span>My Policies</span>}
            </div>
          </button>
          <button
            onClick={() => handleNavigation("myclaims")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "myclaims"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "My Claims" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📄</span>
              {!sidebarCollapsed && <span>My Claims</span>}
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-400 text-center">
              <p>© 2024 InsurAI</p>
              <p>User Panel v1.0</p>
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
                  {activeView === "dashboard" && "User Dashboard"}
                  {activeView === "onlineagents" && "Online Agents"}
                  {activeView === "mypolicies" && "My Policies"}
                  {activeView === "myclaims" && "My Claims"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeView === "dashboard" && "Manage your insurance policies and claims"}
                  {activeView === "onlineagents" && "Book an agent for assistance"}
                  {activeView === "mypolicies" && "View and manage your insurance policies"}
                  {activeView === "myclaims" && "Track your insurance claims"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>🕐</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
