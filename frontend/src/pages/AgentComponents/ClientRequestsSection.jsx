import React from 'react';
import ClientRequests from '../Components/ClientRequests';

const ClientRequestsSection = () => {
  return (
    <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h3 className="text-lg font-semibold mb-4 text-white">Client Requests</h3>
      <p className="text-gray-400 mb-4">
        Handle pending requests for policy purchases or claims.
      </p>
      <ClientRequests />
    </div>
  );
};

export default ClientRequestsSection;
