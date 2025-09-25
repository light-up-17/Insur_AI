import { useState, useEffect } from "react";
import Chatbot from "../Dashboard/Chatbot";

const Dashboard = ({ handleNavigation }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAgents: 0,
    totalPolicies: 0,
    pendingClaims: 0,
    monthlyRevenue: 0,
    activeUsers: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate API calls to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // In a real app, these would be actual API calls
        setStats({
          totalUsers: 1247,
          activeAgents: 89,
          totalPolicies: 3421,
          pendingClaims: 23,
          monthlyRevenue: 284750,
          activeUsers: 892
        });

        setRecentActivity([
          { id: 1, type: 'policy_created', message: 'New auto insurance policy created', time: '2 minutes ago' },
          { id: 2, type: 'user_registered', message: 'New user registered: john.doe@email.com', time: '5 minutes ago' },
          { id: 3, type: 'claim_approved', message: 'Claim #CL-2024-001 approved', time: '10 minutes ago' },
          { id: 4, type: 'agent_login', message: 'Agent Sarah Wilson logged in', time: '15 minutes ago' },
          { id: 5, type: 'policy_renewed', message: 'Policy #PL-2024-089 renewed', time: '1 hour ago' }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'policy_created': return '📋';
      case 'user_registered': return '👤';
      case 'claim_approved': return '✅';
      case 'agent_login': return '🔐';
      case 'policy_renewed': return '🔄';
      default: return '📊';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Overview of system performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
              <p className="text-2xl font-bold text-green-600">{stats.activeAgents}</p>
              <p className="text-sm text-green-600 mt-1">98% availability rate</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Total Policies */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Policies</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPolicies.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+8% this quarter</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending Claims</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingClaims}</p>
              <p className="text-sm text-gray-600 mt-1">Require attention</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">+15% vs last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-indigo-600">{stats.activeUsers}</p>
              <p className="text-sm text-green-600 mt-1">71% of total users</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <span className="text-2xl">🔵</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNavigation("users")}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
            >
              <div className="font-medium text-blue-700">User Management</div>
              <div className="text-sm text-blue-600">Manage user accounts</div>
            </button>
            <button
              onClick={() => handleNavigation("agents")}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
            >
              <div className="font-medium text-green-700">Agent Oversight</div>
              <div className="text-sm text-green-600">Monitor agent performance</div>
            </button>
            <button
              onClick={() => handleNavigation("policies")}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
            >
              <div className="font-medium text-purple-700">Policy Review</div>
              <div className="text-sm text-purple-600">Review active policies</div>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <div className="font-medium text-orange-700">Claims Processing</div>
              <div className="text-sm text-orange-600">Process pending claims</div>
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="mt-6">
        <Chatbot />
      </div>
    </>
  );
};

export default Dashboard;
