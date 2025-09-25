import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:8080/api/availability";

const OnlineAgents = () => {
  const { user, token } = useAuth();
  const [onlineAgents, setOnlineAgents] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/online`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setOnlineAgents(Array.isArray(data) ? data : []);
        setLoading(false);
        setFetchError("");
      })
      .catch((err) => {
        setOnlineAgents([]);
        setLoading(false);
        setFetchError("Could not load agents. Please try again later.");
        console.error("Fetch error:", err);
      });
  }, [token]);

  const bookAgent = async (id) => {
    setBookingStatus("");
    if (!user || !user.id) {
      setBookingStatus("User not authenticated.");
      return;
    }
    const userId = user.id;
    try {
      const res = await fetch(`${API_BASE}/${id}/book`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Online Agents</h3>
      {bookingStatus && <div className="mb-2 text-green-600">{bookingStatus}</div>}
      {loading ? (
        <p className="text-gray-600">Loading agents...</p>
      ) : fetchError ? (
        <p className="text-red-600">{fetchError}</p>
      ) : onlineAgents.length === 0 ? (
        <p className="text-gray-600">No agents are currently online.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {onlineAgents.slice(0, 5).map((agent) => (
            <div key={agent.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{agent.fullName}</p>
                <p className="text-sm text-gray-600">{agent.availabilityDate} - {agent.startTime} to {agent.endTime}</p>
              </div>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => bookAgent(agent.id)}
              >
                Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineAgents;
