import { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john.doe@email.com", role: "Customer", status: "Active", joinDate: "2024-01-15", policies: 3 },
        { id: 2, name: "Jane Smith", email: "jane.smith@email.com", role: "Customer", status: "Active", joinDate: "2024-02-20", policies: 1 },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@email.com", role: "Agent", status: "Inactive", joinDate: "2024-01-10", policies: 0 },
        { id: 4, name: "Alice Brown", email: "alice.brown@email.com", role: "Customer", status: "Active", joinDate: "2024-03-05", policies: 2 },
        { id: 5, name: "Charlie Wilson", email: "charlie.wilson@email.com", role: "Admin", status: "Active", joinDate: "2023-12-01", policies: 0 }
      ];
      setUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === "Active" ? "bg-[#333333] text-[#1cb08b]" : "bg-[#333333] text-red-400";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-[#333333] text-purple-400";
      case "Agent": return "bg-[#333333] text-blue-400";
      default: return "bg-[#333333] text-gray-400";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
        <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md border border-[#333333]">
          <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
          <p className="text-2xl font-bold text-[#1cb08b]">{users.length}</p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md border border-[#333333]">
          <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
          <p className="text-2xl font-bold text-[#1cb08b]">{users.filter(u => u.status === "Active").length}</p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md border border-[#333333]">
          <h3 className="text-sm font-medium text-gray-400">Customers</h3>
          <p className="text-2xl font-bold text-[#1cb08b]">{users.filter(u => u.role === "Customer").length}</p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md border border-[#333333]">
          <h3 className="text-sm font-medium text-gray-400">Admins</h3>
          <p className="text-2xl font-bold text-[#1cb08b]">{users.filter(u => u.role === "Admin").length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md mb-6 border border-[#333333]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#333333] text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#333333] text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-[#333333] hover:bg-[#999999] rounded-md transition-colors text-white"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#333333]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role Filter</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#333333] text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Sort By</label>
                <select className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#333333] text-white">
                  <option value="name">Name</option>
                  <option value="joinDate">Join Date</option>
                  <option value="policies">Policies Count</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Actions</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-[#1cb08b] text-white rounded-md hover:bg-[#0a8a6a] transition-colors">
                    Export
                  </button>
                  <button className="px-3 py-2 bg-[#1cb08b] text-white rounded-md hover:bg-[#0a8a6a] transition-colors">
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-[#333333] border border-[#999999] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-white">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-[#1cb08b] hover:text-white text-sm"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-[#1cb08b] text-white rounded-md hover:bg-[#0a8a6a] transition-colors text-sm">
                Bulk Edit
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm">
                Bulk Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#1c1c1c] rounded-lg shadow-md overflow-hidden border border-[#333333]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#333333]">
            <thead className="bg-[#333333]">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    className="rounded border-[#333333] text-[#1cb08b] focus:ring-[#1cb08b] bg-[#333333]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#1c1c1c] divide-y divide-[#333333]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1cb08b]"></div>
                      <span className="ml-2 text-gray-400">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#333333]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-[#333333] text-[#1cb08b] focus:ring-[#1cb08b] bg-[#333333]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[#333333] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.policies}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-[#333333] transition-colors"
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-[#333333] transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-[#333333] transition-colors"
                          title="Reset Password"
                        >
                          🔑
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-[#333333] transition-colors"
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
