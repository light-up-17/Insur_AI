import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const MyClaims = () => {
  const { user, token } = useAuth();
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    policyId: '',
    claimType: '',
    amount: '',
    dateOfIncident: '',
    description: '',
    documents: []
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      // Fetch claims
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

      // Fetch policies for dropdown
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.policyId || !formData.claimType || !formData.amount || !formData.dateOfIncident || !formData.description) {
      alert('Please fill all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const claimData = {
        policyId: formData.policyId,
        userId: user.id,
        claimType: formData.claimType,
        amount: parseFloat(formData.amount),
        dateOfIncident: formData.dateOfIncident,
        description: formData.description,
        documents: [] // For now, no file upload
      };

      const response = await fetch('http://localhost:8080/api/claims', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(claimData)
      });

      if (response.ok) {
        setFormData({
          policyId: '',
          claimType: '',
          amount: '',
          dateOfIncident: '',
          description: '',
          documents: []
        });
        setShowForm(false);
        // Refresh claims
        fetch(`http://localhost:8080/api/claims/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((data) => setClaims(data));
        alert('Claim submitted successfully!');
      } else {
        alert('Error submitting claim.');
      }
    } catch (err) {
      console.error("Error submitting claim:", err);
      alert('Error submitting claim.');
    }
    setSubmitting(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const claimTypes = ['Health', 'Accident', 'Vehicle Damage', 'Theft', 'Other'];

  return (
    <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg border border-[#333333]">
      <h3 className="text-lg font-semibold mb-4 text-gray-300">My Claims</h3>

      {/* Claim Creation Form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-[#1cb08b] text-white rounded hover:bg-[#17a77a]"
      >
        {showForm ? 'Cancel' : 'Create New Claim'}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border border-[#333333] rounded bg-[#111111]">
          <p className="mb-4 text-gray-400">
            You have purchased a policy. If you wish to raise a claim for this policy, please provide the following details. Once submitted, your claim request will be sent to the assigned Agent and Admin for review and approval.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Policy ID / Number *</label>
                <select
                  name="policyId"
                  value={formData.policyId}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#333333] rounded bg-[#1c1c1c] text-gray-300"
                  required
                  disabled={policiesLoading}
                >
                  <option value="" className="bg-[#1c1c1c] text-gray-300">Select a policy</option>
                  {policies.map((policy) => (
                    <option key={policy.policyId} value={policy.policyId} className="bg-[#1c1c1c] text-gray-300">
                      {policy.policyId} - {policy.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Claim Type *</label>
                <select
                  name="claimType"
                  value={formData.claimType}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#333333] rounded bg-[#1c1c1c] text-gray-300"
                  required
                >
                  <option value="" className="bg-[#1c1c1c] text-gray-300">Select claim type</option>
                  {claimTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#1c1c1c] text-gray-300">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Claim Amount Requested (INR) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#333333] rounded bg-[#1c1c1c] text-gray-300"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Date of Incident *</label>
                <input
                  type="date"
                  name="dateOfIncident"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#333333] rounded bg-[#1c1c1c] text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">Description of Incident *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-[#333333] rounded bg-[#1c1c1c] text-gray-300"
                rows="3"
                placeholder="Brief explanation of what happened"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-300">Supporting Documents (Optional)</label>
              <p className="text-sm text-gray-500 mb-2">For now, file upload is not implemented. You can describe or provide URLs.</p>
              <textarea
                name="documents"
                value={formData.documents.join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, documents: e.target.value.split(',').map(d => d.trim()).filter(d => d) }))}
                className="w-full p-2 border border-[#333333] rounded bg-[#1c1c1c] text-gray-300"
                rows="2"
                placeholder="Enter file names or URLs separated by commas"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || policiesLoading}
              className="px-4 py-2 bg-[#1cb08b] text-white rounded hover:bg-[#17a77a] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </form>
        </div>
      )}

      {/* Claims List */}
      {claimsLoading ? (
        <p className="text-gray-400">Loading claims...</p>
      ) : claims.length === 0 ? (
        <p className="text-gray-400">No claims found.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {claims.map((claim) => (
            <div key={claim.claimId} className="border-b border-[#333333] pb-2">
              <p className="font-medium text-gray-300">{claim.description} – {claim.status} {claim.claimType ? `(${claim.claimType})` : ''}</p>
              <p className="text-sm text-gray-400">Amount: {formatCurrency(claim.amount)}</p>
              {claim.dateOfIncident && <p className="text-sm text-gray-400">Incident Date: {new Date(claim.dateOfIncident).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;
