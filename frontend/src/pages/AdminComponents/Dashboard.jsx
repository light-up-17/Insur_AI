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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1cb08b]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-400">Overview of system performance and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-[#1cb08b] mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Active Agents</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.activeAgents}</p>
              <p className="text-sm text-[#1cb08b] mt-1">98% availability rate</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Total Policies */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Total Policies</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.totalPolicies.toLocaleString()}</p>
              <p className="text-sm text-[#1cb08b] mt-1">+8% this quarter</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Pending Claims</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.pendingClaims}</p>
              <p className="text-sm text-gray-400 mt-1">Require attention</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Monthly Revenue</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-sm text-[#1cb08b] mt-1">+15% vs last month</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{stats.activeUsers}</p>
              <p className="text-sm text-[#1cb08b] mt-1">71% of total users</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">🔵</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#333333]">
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNavigation("users")}
              className="p-4 bg-[#333333] hover:bg-[#999999] rounded-lg text-left transition-colors"
            >
              <div className="font-medium text-white">User Management</div>
              <div className="text-sm text-gray-400">Manage user accounts</div>
            </button>
            <button
              onClick={() => handleNavigation("agents")}
              className="p-4 bg-[#333333] hover:bg-[#999999] rounded-lg text-left transition-colors"
            >
              <div className="font-medium text-white">Agent Oversight</div>
              <div className="text-sm text-gray-400">Monitor agent performance</div>
            </button>
            <button
              onClick={() => handleNavigation("policies")}
              className="p-4 bg-[#333333] hover:bg-[#999999] rounded-lg text-left transition-colors"
            >
              <div className="font-medium text-white">Policy Review</div>
              <div className="text-sm text-gray-400">Review active policies</div>
            </button>
            <button className="p-4 bg-[#333333] hover:bg-[#999999] rounded-lg text-left transition-colors">
              <div className="font-medium text-white">Claims Processing</div>
              <div className="text-sm text-gray-400">Process pending claims</div>
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
