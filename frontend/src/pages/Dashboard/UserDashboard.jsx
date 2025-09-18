import React, { useEffect, useState } from "react";
import Chatbot from "./Chatbot";

const API_BASE = "http://localhost:8080/api/availability";

const UserDashboard = () => {
  const [onlineAgents, setOnlineAgents] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [claimsLoading, setClaimsLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/online`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setOnlineAgents(Array.isArray(data) ? data : []);
        setLoading(false);
        setFetchError("");
        // Debug: log the data
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No online agents returned from backend:", data);
        }
      })
      .catch((err) => {
        setOnlineAgents([]);
        setLoading(false);
        setFetchError("Could not load agents. Please try again later.");
        console.error("Fetch error:", err);
      });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setPoliciesLoading(true);
      fetch(`http://localhost:8080/api/policies/user/${user.id}`)
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

      setClaimsLoading(true);
      fetch(`http://localhost:8080/api/claims/user/${user.id}`)
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
  }, []);

  const bookAgent = async (id) => {
    setBookingStatus("");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setBookingStatus("User not authenticated.");
      return;
    }
    const userId = user.id;
    try {
      const res = await fetch(`${API_BASE}/${id}/book`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setOnlineAgents((prev) => prev.filter((agent) => agent.id !== id));
        setBookingStatus("Agent booked successfully!");
      } else {
        setBookingStatus("Failed to book agent.");
      }
    } catch {
      setBookingStatus("Error booking agent.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">User Dashboard</h2>

      {/* Online Agents Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Online Agents</h3>
        {bookingStatus && <div className="mb-2 text-green-600">{bookingStatus}</div>}
        {loading ? (
          <p className="text-gray-600">Loading agents...</p>
        ) : fetchError ? (
          <p className="text-red-600">{fetchError}</p>
        ) : onlineAgents.length === 0 ? (
          <p className="text-gray-600">No agents are currently online.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1">Agent ID</th>
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">First Name</th>
                <th className="border px-2 py-1">Last Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Phone</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Time</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {onlineAgents.map((agent) => (
                <tr key={agent.id}>
                  <td className="border px-2 py-1">{agent.agentId}</td>
                  <td className="border px-2 py-1">{agent.fullName}</td>
                  <td className="border px-2 py-1">{agent.firstName}</td>
                  <td className="border px-2 py-1">{agent.lastName}</td>
                  <td className="border px-2 py-1">{agent.email}</td>
                  <td className="border px-2 py-1">{agent.phone}</td>
                  <td className="border px-2 py-1">{agent.availabilityDate}</td>
                  <td className="border px-2 py-1">
                    {agent.startTime} - {agent.endTime}
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => bookAgent(agent.id)}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Policy and Claims section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* View existing policies */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">My Policies</h3>
          {policiesLoading ? (
            <p className="text-gray-600">Loading policies...</p>
          ) : policies.length === 0 ? (
            <p className="text-gray-600">No policies found.</p>
          ) : (
            <ul className="list-disc pl-5 text-gray-600">
              {policies.map((policy) => (
                <li key={policy.policyId}>
                  {policy.type} – {policy.status} (Premium: ${policy.premium})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* View claims */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">My Claims</h3>
          {claimsLoading ? (
            <p className="text-gray-600">Loading claims...</p>
          ) : claims.length === 0 ? (
            <p className="text-gray-600">No claims found.</p>
          ) : (
            <ul className="list-disc pl-5 text-gray-600">
              {claims.map((claim) => (
                <li key={claim.claimId}>
                  {claim.description} – {claim.status} (Amount: ${claim.amount})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buy new policy */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Buy New Policy</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Browse Policies
          </button>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default UserDashboard;
