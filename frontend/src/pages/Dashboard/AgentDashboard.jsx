import { useState } from "react";
import Chatbot from "./Chatbot";
import AgentAvailability from "../Components/AgentAvailability";
import ClientRequests from "../Components/ClientRequests";

const AgentDashboard = () => {
  const [showAvailability, setShowAvailability] = useState(false);
  const [showClientRequests, setShowClientRequests] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Agent Dashboard</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Policy Sales */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Policy Sales</h3>
          <p className="text-gray-600">Track and manage policies you’ve sold.</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            View Sales Report
          </button>
        </div>

        {/* Client Requests */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Client Requests</h3>
          <p className="text-gray-600">
            Handle pending requests for policy purchases or claims.
          </p>
          <button
            onClick={() => setShowClientRequests(!showClientRequests)}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {showClientRequests ? "Close Requests" : "Manage Requests"}
          </button>

          {/* Show ClientRequests when button is clicked */}
          {showClientRequests && (
            <div className="mt-4">
              <ClientRequests />
            </div>
          )}
        </div>

        {/* Availability Management */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Availability Management</h3>
          <p className="text-gray-600">Track and manage availability for users.</p>
          <button
            onClick={() => setShowAvailability(!showAvailability)}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {showAvailability ? "Close Availability" : "Edit Availability"}
          </button>

          {/* Show AgentAvailability form when button is clicked */}
          {showAvailability && (
            <div className="mt-4">
              <AgentAvailability />
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <div className="mt-6">
        <Chatbot />
      </div>
    </div>
  );
};

export default AgentDashboard;
