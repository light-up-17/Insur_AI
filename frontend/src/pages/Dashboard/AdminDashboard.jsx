import Chatbot from "./Chatbot";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Dashboard</a>
          <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">User Management</a>
          <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Agent Management</a>
          <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Policy & Workflow</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
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
    </div>
  );
};

export default AdminDashboard;
