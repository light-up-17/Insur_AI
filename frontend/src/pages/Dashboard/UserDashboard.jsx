import { useState } from "react";
import Dashboard from "../UserComponents/Dashboard";
import OnlineAgents from "../UserComponents/OnlineAgents";
import MyPolicies from "../UserComponents/MyPolicies";
import MyClaims from "../UserComponents/MyClaims";

const UserDashboard = ({ showSidebar = true }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  if (!showSidebar) {
    return (
      <div className="p-6 bg-[#111111]">
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
            onClick={() => handleNavigation("onlineagents")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "onlineagents"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
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
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
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
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
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

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
