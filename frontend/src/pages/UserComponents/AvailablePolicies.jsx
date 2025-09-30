import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const AvailablePolicies = ({ onBuyPolicy }) => {
  const { token } = useAuth();
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [availableLoading, setAvailableLoading] = useState(true);

  useEffect(() => {
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
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleBuy = (policyId) => {
    if (onBuyPolicy) {
      onBuyPolicy(policyId);
    }
  };

  return (
    <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-gray-300">Available Policies</h3>
      {availableLoading ? (
        <p className="text-gray-400">Loading available policies...</p>
      ) : availablePolicies.length === 0 ? (
        <p className="text-gray-400">No policies available.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availablePolicies.map((policy) => (
            <div key={policy.policyId} className="flex justify-between items-center border-b border-[#333333] pb-2">
              <div>
                <p className="font-medium text-gray-300">{policy.type}</p>
                <p className="text-sm text-gray-400">Premium: {formatCurrency(policy.premium)}/month</p>
                <p className="text-sm text-gray-400">Coverage: {formatCurrency(policy.coverage)}</p>
              </div>
              <button
                className="px-3 py-1 bg-[#1cb08b] text-white rounded hover:bg-[#17a77a] text-sm"
                onClick={() => handleBuy(policy.policyId)}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailablePolicies;
