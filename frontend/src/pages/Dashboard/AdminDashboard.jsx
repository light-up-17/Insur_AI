import Chatbot from "./Chatbot";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Users */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">User Management</h3>
          <p className="text-gray-600">Control user accounts and policies.</p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Manage Users
          </button>
        </div>

        {/* Manage Agents */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Agent Management</h3>
          <p className="text-gray-600">Oversee agents and sales performance.</p>
          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Manage Agents
          </button>
        </div>

        {/* Create Policy & Workflow */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Policy & Workflow</h3>
          <p className="text-gray-600">Create new policies and manage workflows.</p>
          <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Create Policy
          </button>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default AdminDashboard;
