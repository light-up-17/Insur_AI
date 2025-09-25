import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const MyClaims = () => {
  const { user, token } = useAuth();
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      setClaimsLoading(true);
      fetch(`http://localhost:8080/api/claims/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setClaims(data);
          setClaimsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching claims:", err);
          setClaims([]);
          setClaimsLoading(false);
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
      <h3 className="text-lg font-semibold mb-4">My Claims</h3>
      {claimsLoading ? (
        <p className="text-gray-600">Loading claims...</p>
      ) : claims.length === 0 ? (
        <p className="text-gray-600">No claims found.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {claims.map((claim) => (
            <div key={claim.claimId} className="border-b pb-2">
              <p className="font-medium">{claim.description} – {claim.status}</p>
              <p className="text-sm text-gray-600">Amount: {formatCurrency(claim.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
