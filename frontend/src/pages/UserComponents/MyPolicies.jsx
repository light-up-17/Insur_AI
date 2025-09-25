import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const MyPolicies = () => {
  const { user, token } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      setPoliciesLoading(true);
      fetch(`http://localhost:8080/api/policies/user/${user.id}`, {
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">My Policies</h3>
      {policiesLoading ? (
        <p className="text-gray-600">Loading policies...</p>
      ) : policies.length === 0 ? (
        <p className="text-gray-600">No policies found.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {policies.map((policy) => (
            <div key={policy.policyId} className="border-b pb-2">
              <p className="font-medium">{policy.type} – {policy.status}</p>
              <p className="text-sm text-gray-600">Premium: {formatCurrency(policy.premium)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
