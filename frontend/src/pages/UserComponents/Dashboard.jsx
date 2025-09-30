import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Chatbot from "../Dashboard/Chatbot";
import AvailablePolicies from "./AvailablePolicies";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [availableLoading, setAvailableLoading] = useState(true);
  const [policiesCount, setPoliciesCount] = useState(0);
  const [claimsCount, setClaimsCount] = useState(0);
  const [onlineAgentsCount, setOnlineAgentsCount] = useState(0);

  useEffect(() => {
    // Fetch available policies
    setAvailableLoading(true);
    fetch(`http://localhost:8080/api/policies/available`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailablePolicies(data);
        setAvailableLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching available policies:", err);
        setAvailablePolicies([]);
        setAvailableLoading(false);
      });

    // Fetch counts
    if (user && user.id) {
      // Policies count
      fetch(`http://localhost:8080/api/policies/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setPoliciesCount(Array.isArray(data) ? data.length : 0);
        })
        .catch((err) => {
          console.error("Error fetching policies count:", err);
          setPoliciesCount(0);
        });

      // Claims count
      fetch(`http://localhost:8080/api/claims/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setClaimsCount(Array.isArray(data) ? data.length : 0);
        })
        .catch((err) => {
          console.error("Error fetching claims count:", err);
          setClaimsCount(0);
        });
    }

    // Online agents count
    fetch(`http://localhost:8080/api/availability/online`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setOnlineAgentsCount(Array.isArray(data) ? data.length : 0);
      })
      .catch((err) => {
        console.error("Error fetching online agents count:", err);
        setOnlineAgentsCount(0);
      });
  }, [user, token]);

  const buyPolicy = async (policyId) => {
    if (!user || !user.id) {
      alert("User not authenticated.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/policies/buy/${policyId}?userId=${user.id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        alert("Policy purchased successfully!");
        // Refresh available policies
        fetch(`http://localhost:8080/api/policies/available`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((data) => setAvailablePolicies(data));
      } else {
        alert("Failed to purchase policy.");
      }
    } catch (error) {
      console.error("Error buying policy:", error);
      alert("Error buying policy.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1cb08b] mb-2">User Dashboard</h2>
        <p className="text-gray-300">Manage your insurance policies and claims</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* My Policies */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">My Policies</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{policiesCount}</p>
              <p className="text-sm text-gray-300 mt-1">Active policies</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {/* My Claims */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">My Claims</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{claimsCount}</p>
              <p className="text-sm text-gray-300 mt-1">Total claims filed</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>

        {/* Available Policies */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Available Policies</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{availablePolicies.length}</p>
              <p className="text-sm text-gray-300 mt-1">Browse and purchase</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
        </div>

        {/* Online Agents */}
        <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg border border-[#333333]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Online Agents</h3>
              <p className="text-2xl font-bold text-[#1cb08b]">{onlineAgentsCount}</p>
              <p className="text-sm text-gray-300 mt-1">Available for booking</p>
            </div>
            <div className="p-3 bg-[#333333] rounded-full">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Policies */}
      <div className="mb-6">
        <AvailablePolicies onBuyPolicy={buyPolicy} />
      </div>

      {/* Chatbot */}
      <div className="mt-6">
        <Chatbot />
      </div>
    </>
  );
};

export default Dashboard;
