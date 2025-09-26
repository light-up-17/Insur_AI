import React from 'react';
import ClientRequests from '../Components/ClientRequests';

const ClientRequestsSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Client Requests</h3>
      <p className="text-gray-600 mb-4">
        Handle pending requests for policy purchases or claims.
      </p>
      <ClientRequests />
    </div>
  );
};

export default ClientRequestsSection;
