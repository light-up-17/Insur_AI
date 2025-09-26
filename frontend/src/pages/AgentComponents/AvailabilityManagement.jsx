import React from 'react';
import AgentAvailability from '../Components/AgentAvailability';

const AvailabilityManagement = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Availability Management</h3>
      <p className="text-gray-600 mb-4">Track and manage availability for users.</p>
      <AgentAvailability />
    </div>
  );
};

export default AvailabilityManagement;
