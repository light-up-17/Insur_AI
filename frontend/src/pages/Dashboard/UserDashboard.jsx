import Chatbot from "./Chatbot";

const UserDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">User Dashboard</h2>

      {/* Policy section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* View existing policies */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">My Policies</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Health Insurance – Active</li>
            <li>Vehicle Insurance – Expiring Soon</li>
          </ul>
        </div>

        {/* Buy new policy */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Buy New Policy</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Browse Policies
          </button>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
