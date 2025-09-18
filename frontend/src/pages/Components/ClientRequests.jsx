import React, { useState, useEffect } from "react";

const ClientRequests = () => {
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
      const agentId = localStorage.getItem("agentId");
      if (!agentId) return;

      try {
        const response = await fetch(`http://localhost:8080/api/availability/booked/${agentId}`);
        if (response.ok) {
          const data = await response.json();
          setAllRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch booked requests:", error);
      }
    };

    fetchBookedRequests();
  }, []);

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
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2 border">Client ID</th>
          <th className="p-2 border">Client</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Time</th>
          <th className="p-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.availabilityId} className="border-b">
            <td className="p-2 border">{request.clientId}</td>
            <td className="p-2 border">{request.clientName}</td>
            <td className="p-2 border">{request.email}</td>
            <td className="p-2 border">{request.phone}</td>
            <td className="p-2 border">{request.date}</td>
            <td className="p-2 border">{request.startTime} - {request.endTime}</td>
            <td className="p-2 border">{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Client Requests Management</h3>

      <h4 className="text-md font-semibold mb-2">Active Requests</h4>
      {activeRequests.length === 0 ? (
        <p className="text-gray-600">No active requests found.</p>
      ) : (
        renderTable(activeRequests)
      )}

      <h4 className="text-md font-semibold mb-2 mt-4">Request History</h4>
      {historyRequests.length === 0 ? (
        <p className="text-gray-600">No request history found.</p>
      ) : (
        renderTable(historyRequests)
      )}
    </div>
  );
};

export default ClientRequests;
