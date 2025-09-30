import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";

const PolicyWorkflow = () => {
  const { apiRequest } = useAuth();
  const [activeTab, setActiveTab] = useState("policies");
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [policiesResponse, claimsResponse] = await Promise.all([
        apiRequest("http://localhost:8080/api/policies"),
        apiRequest("http://localhost:8080/api/claims")
      ]);
      const policiesData = await policiesResponse.json();
      const claimsData = await claimsResponse.json();
      setPolicies(policiesData);
      setClaims(claimsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiRequest]);

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = policy.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || policy.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [policies, searchTerm, filterStatus]);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const matchesSearch = claim.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || claim.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [claims, searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved": return "bg-[#333333] text-[#1cb08b]";
      case "under review": return "bg-[#333333] text-yellow-400";
      case "draft":
      case "pending": return "bg-[#333333] text-gray-400";
      case "rejected": return "bg-[#333333] text-red-400";
      default: return "bg-[#333333] text-blue-400";
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "vehicle": return "bg-[#333333] text-blue-400";
      case "property": return "bg-[#333333] text-green-400";
      case "life": return "bg-[#333333] text-purple-400";
      case "health": return "bg-[#333333] text-red-400";
      case "business": return "bg-[#333333] text-orange-400";
      default: return "bg-[#333333] text-gray-400";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(activeTab === "policies" ? {
      userId: "",
      type: "Vehicle",
      status: "Active",
      premium: 0,
      coverage: 0,
      startDate: "",
      endDate: ""
    } : {
      policyId: "",
      userId: "",
      description: "",
      status: "Pending",
      amount: 0,
      dateFiled: ""
    });
    setShowCreateForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setIsLoading(true);
    try {
      const endpoint = activeTab === "policies" ? `/api/policies/${id}` : `/api/claims/${id}`;
      await apiRequest(`http://localhost:8080${endpoint}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = activeTab === "policies" ? "/api/policies" : "/api/claims";
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `http://localhost:8080${endpoint}/${editingItem.policyId || editingItem.claimId}` : `http://localhost:8080${endpoint}`;

      // Clean the data before sending
      const dataToSend = { ...formData };
      if (activeTab === "policies") {
        // For template policies, set userId to null if empty
        if (!dataToSend.userId || dataToSend.userId.trim() === "") {
          dataToSend.userId = null;
        }
        // Ensure dates are in correct format
        if (dataToSend.startDate) {
          dataToSend.startDate = dataToSend.startDate;
        }
        if (dataToSend.endDate) {
          dataToSend.endDate = dataToSend.endDate;
        }
      }

      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error("Error saving item:", error);
      alert(`Error saving ${activeTab.slice(0, -1)}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPoliciesTable = () => (
    <div className="bg-[#1c1c1c] rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#333333]">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policy ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Premium</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coverage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#1c1c1c] divide-y divide-[#333333]">
            {filteredPolicies.map((policy) => (
              <tr key={policy.policyId} className="hover:bg-[#2a2a2a]">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{policy.policyId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(policy.type)}`}>
                    {policy.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                    {policy.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatCurrency(policy.premium)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatCurrency(policy.coverage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{policy.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(policy)} className="text-[#1cb08b] hover:text-[#0a8a6a] mr-3">Edit</button>
                  <button onClick={() => handleDelete(policy.policyId)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClaimsTable = () => (
    <div className="bg-[#1c1c1c] rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#333333]">
          <thead className="bg-[#2a2a2a]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Claim ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Policy ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Filed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#1c1c1c] divide-y divide-[#333333]">
            {filteredClaims.map((claim) => (
              <tr key={claim.claimId} className="hover:bg-[#2a2a2a]">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{claim.claimId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{claim.policyId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{claim.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatCurrency(claim.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{claim.dateFiled}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(claim)} className="text-[#1cb08b] hover:text-[#0a8a6a] mr-3">Edit</button>
                  <button onClick={() => handleDelete(claim.claimId)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Policy & Workflow Management</h2>
            <p className="text-gray-400">Manage insurance policies and claims</p>
          </div>
          {activeTab === "policies" && (
            <button
              onClick={handleCreate}
              className="bg-[#1cb08b] text-white px-4 py-2 rounded-md hover:bg-[#0a8a6a] transition-colors"
            >
              Create New Policy
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-[#333333]">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("policies")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "policies"
                  ? "border-[#1cb08b] text-[#1cb08b]"
                  : "border-transparent text-gray-400 hover:text-white hover:border-[#333333]"
              }`}
            >
              Policies ({policies.length})
            </button>
            <button
              onClick={() => setActiveTab("claims")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "claims"
                  ? "border-[#1cb08b] text-[#1cb08b]"
                  : "border-transparent text-gray-400 hover:text-white hover:border-[#333333]"
              }`}
            >
              Claims ({claims.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-400">Total {activeTab === "policies" ? "Policies" : "Claims"}</h3>
          <p className="text-2xl font-bold text-[#1cb08b]">{activeTab === "policies" ? policies.length : claims.length}</p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-400">Active {activeTab === "policies" ? "Policies" : "Approved Claims"}</h3>
          <p className="text-2xl font-bold text-green-400">
            {activeTab === "policies"
              ? policies.filter(p => p.status === "Active").length
              : claims.filter(c => c.status === "Approved").length}
          </p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-400">Total Value</h3>
          <p className="text-2xl font-bold text-purple-400">
            {formatCurrency(activeTab === "policies"
              ? policies.reduce((acc, p) => acc + p.premium, 0)
              : claims.reduce((acc, c) => acc + c.amount, 0))}
          </p>
        </div>
        <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-400">Pending Items</h3>
          <p className="text-2xl font-bold text-orange-400">
            {activeTab === "policies"
              ? policies.filter(p => p.status === "Under Review" || p.status === "Draft").length
              : claims.filter(c => c.status === "Pending" || c.status === "Under Review").length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
            >
              <option value="all">All Status</option>
              {activeTab === "policies" ? (
                <>
                  <option value="active">Active</option>
                  <option value="under review">Under Review</option>
                  <option value="draft">Draft</option>
                </>
              ) : (
                <>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="under review">Under Review</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {activeTab === "policies" ? renderPoliciesTable() : renderClaimsTable()}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1c] p-6 rounded-lg max-w-md w-full mx-4 border border-[#333333]">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {editingItem ? `Edit ${activeTab.slice(0, -1)}` : `Create New ${activeTab.slice(0, -1)}`}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "policies" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">User ID (optional for templates)</label>
                    <input
                      type="text"
                      value={formData.userId || ""}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <select
                      value={formData.type || "Vehicle"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
                    >
                      <option>Vehicle</option>
                      <option>Property</option>
                      <option>Life</option>
                      <option>Health</option>
                      <option>Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      value={formData.status || "Active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
                    >
                      <option>Active</option>
                      <option>Under Review</option>
                      <option>Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Premium</label>
                    <input
                      type="number"
                      value={formData.premium || ""}
                      onChange={(e) => setFormData({ ...formData, premium: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Coverage</label>
                    <input
                      type="number"
                      value={formData.coverage || ""}
                      onChange={(e) => setFormData({ ...formData, coverage: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate || ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate || ""}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Policy ID</label>
                    <input
                      type="text"
                      value={formData.policyId || ""}
                      onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                    <input
                      type="text"
                      value={formData.userId || ""}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      value={formData.status || "Pending"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
                    >
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Under Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date Filed</label>
                    <input
                      type="date"
                      value={formData.dateFiled || ""}
                      onChange={(e) => setFormData({ ...formData, dateFiled: e.target.value })}
                      className="w-full px-3 py-2 border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1cb08b] bg-[#2a2a2a] text-white"
                      required
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-300 border border-[#333333] rounded-md hover:bg-[#2a2a2a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#1cb08b] text-white rounded-md hover:bg-[#0a8a6a] disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyWorkflow;
