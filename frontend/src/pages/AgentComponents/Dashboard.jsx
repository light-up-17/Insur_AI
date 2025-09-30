import React, { useState, useEffect } from "react";
import Chatbot from "../Dashboard/Chatbot";

const Dashboard = ({ handleNavigation }) => {
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

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Agent Dashboard</h2>
        <p className="text-gray-400">Manage your policies, client requests, and availability</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Policies Sold */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Policies Sold</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.policiesSold}</p>
              <p className="text-sm text-[#1cb08b] mt-1">This month</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {/* Client Requests */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Client Requests</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.clientRequests}</p>
              <p className="text-sm text-gray-400 mt-1">Pending</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Availability</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.availabilityStatus}</p>
              <p className="text-sm text-gray-400 mt-1">Current status</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Revenue</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{formatCurrency(stats.revenue)}</p>
              <p className="text-sm text-[#1cb08b] mt-1">This month</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="mt-6">
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;
