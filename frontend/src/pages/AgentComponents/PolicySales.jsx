import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PolicySales = () => {
  const { user, token } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      setPoliciesLoading(true);
      fetch(`http://localhost:8080/api/policies/agent/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setPolicies(data);
          setPoliciesLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching policies:", err);
          setPolicies([]);
          setPoliciesLoading(false);
        });
    }
  }, [user, token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-md border border-[#333333]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h3 className="text-lg font-semibold mb-4 text-white">Policy Sales</h3>
      {policiesLoading ? (
        <p className="text-gray-400">Loading policies...</p>
      ) : policies.length === 0 ? (
        <p className="text-gray-400">No policies sold yet.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {policies.map((policy) => (
            <div key={policy.policyId} className="border-b border-[#333333] pb-2">
              <p className="font-medium text-white">{policy.type} – {policy.status}</p>
              <p className="text-sm text-gray-400">Premium: {formatCurrency(policy.premium)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicySales;
