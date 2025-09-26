import React, { useState, useEffect } from "react";
import Chatbot from "./Chatbot";
import PolicySales from "../AgentComponents/PolicySales";
import ClientRequestsSection from "../AgentComponents/ClientRequestsSection";
import AvailabilityManagement from "../AgentComponents/AvailabilityManagement";

const AgentDashboard = ({ showSidebar = true }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [stats, setStats] = useState({
    policiesSold: 0,
    clientRequests: 0,
    availabilityStatus: "Online",
    revenue: 0
  });

  useEffect(() => {
    // Mock data for stats
    setStats({
      policiesSold: 45,
      clientRequests: 12,
      availabilityStatus: "Online",
      revenue: 125000
    });
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Agent Dashboard</h2>
              <p className="text-gray-600">Manage your policies, client requests, and availability</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Policies Sold */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Policies Sold</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.policiesSold}</p>
                    <p className="text-sm text-green-600 mt-1">This month</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>

              {/* Client Requests */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Client Requests</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.clientRequests}</p>
                    <p className="text-sm text-gray-600 mt-1">Pending</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">📄</span>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.availabilityStatus}</p>
                    <p className="text-sm text-gray-600 mt-1">Current status</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-2xl">🟢</span>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.revenue)}</p>
                    <p className="text-sm text-green-600 mt-1">This month</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
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
      <div className="p-6 bg-gray-100">
        {renderContent()}
        <div className="mt-6">
          <Chatbot />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-gray-800 text-white transition-all duration-300 ease-in-out relative`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
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
            onClick={() => handleNavigation("policysales")}
            className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              activeView === "policysales"
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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
                ? "bg-blue-600 shadow-lg transform scale-105"
                : "hover:bg-gray-700 hover:translate-x-1"
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

        {/* Chatbot */}
        <div className="p-6 border-t bg-white">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
