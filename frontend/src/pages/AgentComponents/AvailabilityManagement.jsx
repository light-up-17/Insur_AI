import React from 'react';
import AgentAvailability from '../Components/AgentAvailability';

const AvailabilityManagement = () => {
  return (
    <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h3 className="text-lg font-semibold mb-4 text-white">Availability Management</h3>
      <p className="text-gray-400 mb-4">Track and manage availability for users.</p>
      <AgentAvailability />
    </div>
  );
};

export default AvailabilityManagement;
