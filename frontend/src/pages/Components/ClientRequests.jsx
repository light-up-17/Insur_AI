import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const ClientRequests = () => {
  const { user, isAuthenticated, token, apiRequest } = useAuth();
  const [activeRequests, setActiveRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);

  const isActive = (request) => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD local
    const currentTime = now.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5); // HH:MM local

    if (request.date !== currentDate) return false;

    return request.startTime <= currentTime && currentTime <= request.endTime;
  };

  const isHistory = (request) => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD local
    const currentTime = now.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5); // HH:MM local

    if (request.date < currentDate) return true;
    if (request.date === currentDate && request.endTime < currentTime) return true;
    return false;
  };

  useEffect(() => {
    // Fetch booked requests with user details for the logged-in agent
    const fetchBookedRequests = async () => {
      // Get agentId from AuthContext instead of localStorage
      const agentId = user ? user.id : null;
      if (!agentId) return;

      try {
        const response = await apiRequest(`http://localhost:8080/api/availability/booked/${agentId}`);
        if (response.ok) {
          const data = await response.json();
          setAllRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch booked requests:", error);
      }
    };

    fetchBookedRequests();
  }, [user, token, apiRequest]);

  useEffect(() => {
    const filterRequests = () => {
      const active = allRequests.filter(isActive);
      const history = allRequests.filter(isHistory);
      setActiveRequests(active);
      setHistoryRequests(history);
    };

    if (allRequests.length > 0) {
      filterRequests();
    }

    // Update every minute to reflect current time
    const interval = setInterval(() => {
      if (allRequests.length > 0) {
        filterRequests();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [allRequests]);

  const renderTable = (requests) => (
    <table className="w-full border border-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <thead>
        <tr className="bg-[#2a2a2a] text-left">
          <th className="p-2 border border-[#333333] text-gray-400">Client ID</th>
          <th className="p-2 border border-[#333333] text-gray-400">Client</th>
          <th className="p-2 border border-[#333333] text-gray-400">Email</th>
          <th className="p-2 border border-[#333333] text-gray-400">Phone</th>
          <th className="p-2 border border-[#333333] text-gray-400">Date</th>
          <th className="p-2 border border-[#333333] text-gray-400">Time</th>
          <th className="p-2 border border-[#333333] text-gray-400">Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.availabilityId} className="border-b border-[#333333] hover:bg-[#2a2a2a]">
            <td className="p-2 border border-[#333333] text-white">{request.clientId}</td>
            <td className="p-2 border border-[#333333] text-white">{request.clientName}</td>
            <td className="p-2 border border-[#333333] text-white">{request.email}</td>
            <td className="p-2 border border-[#333333] text-white">{request.phone}</td>
            <td className="p-2 border border-[#333333] text-white">{request.date}</td>
            <td className="p-2 border border-[#333333] text-white">{request.startTime} - {request.endTime}</td>
            <td className="p-2 border border-[#333333] text-white">{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="mt-4 p-4 bg-[#1c1c1c] rounded-lg shadow-md border border-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h3 className="text-lg font-semibold mb-2 text-white">Client Requests Management</h3>

      <h4 className="text-md font-semibold mb-2 text-white">Active Requests</h4>
      {activeRequests.length === 0 ? (
        <p className="text-gray-400">No active requests found.</p>
      ) : (
        renderTable(activeRequests)
      )}

      <h4 className="text-md font-semibold mb-2 mt-4 text-white">Request History</h4>
      {historyRequests.length === 0 ? (
        <p className="text-gray-400">No request history found.</p>
      ) : (
        renderTable(historyRequests)
      )}
    </div>
  );
};

export default ClientRequests;
