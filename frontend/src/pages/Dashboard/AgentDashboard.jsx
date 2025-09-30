import React, { useState } from "react";
import PolicySales from "../AgentComponents/PolicySales";
import ClientRequestsSection from "../AgentComponents/ClientRequestsSection";
import AvailabilityManagement from "../AgentComponents/AvailabilityManagement";

import Dashboard from "../AgentComponents/Dashboard";

const AgentDashboard = ({ showSidebar = true }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard handleNavigation={handleNavigation} />;
      case "policysales":
        return <PolicySales />;
      case "clientrequests":
        return <ClientRequestsSection />;
      case "availability":
        return <AvailabilityManagement />;
      default:
        return null;
    }
  };

  if (!showSidebar) {
    return (
      <div className="p-6 bg-[#111111]" style={{ fontFamily: "'Inter', sans-serif" }}>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#111111]" style={{ fontFamily: "'Inter', sans-serif" }}>
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
            onClick={() => handleNavigation("policysales")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "policysales"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Policy Sales" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📋</span>
              {!sidebarCollapsed && <span>Policy Sales</span>}
            </div>
          </button>
          <button
            onClick={() => handleNavigation("clientrequests")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "clientrequests"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Client Requests" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">📄</span>
              {!sidebarCollapsed && <span>Client Requests</span>}
            </div>
          </button>
          <button
            onClick={() => handleNavigation("availability")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "availability"
                ? "bg-[#1cb08b] shadow-lg transform scale-105"
                : "hover:bg-[#333333] hover:translate-x-1"
            }`}
            title={sidebarCollapsed ? "Availability Management" : ""}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">🕒</span>
              {!sidebarCollapsed && <span>Availability Management</span>}
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-gray-400 text-center">
              <p>© 2024 InsurAI</p>
              <p>Agent Panel v1.0</p>
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

export default AgentDashboard;
