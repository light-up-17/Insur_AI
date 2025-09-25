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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Available Policies</h3>
      {availableLoading ? (
        <p className="text-gray-600">Loading available policies...</p>
      ) : availablePolicies.length === 0 ? (
        <p className="text-gray-600">No policies available.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availablePolicies.map((policy) => (
            <div key={policy.policyId} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{policy.type}</p>
                <p className="text-sm text-gray-600">Premium: {formatCurrency(policy.premium)}/month</p>
                <p className="text-sm text-gray-600">Coverage: {formatCurrency(policy.coverage)}</p>
              </div>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
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
