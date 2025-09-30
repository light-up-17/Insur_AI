// src/pages/AgentAvailability.jsx
import React, { useState, useEffect } from "react";
import { format, isBefore, isAfter, parseISO } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";

export default function AgentAvailability() {
  const { user, token, apiRequest } = useAuth();
  const [availabilityList, setAvailabilityList] = useState([]);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    breaks: [],
    notes: "",
  });

  const agentId = user ? user.id : null;

  // Fetch availability slots from backend
  const fetchAvailability = async () => {
    if (!agentId) return;
    try {
      const response = await apiRequest(`http://localhost:8080/api/availability/${agentId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailabilityList(data);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    }
  };

  useEffect(() => {
    fetchAvailability();
    // eslint-disable-next-line
  }, [agentId, token]);

  // Reset form
  const resetForm = () => {
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      breaks: [],
      notes: "",
    });
  };

  // Add availability slot
  const addAvailability = async () => {
    if (!form.date || !form.startTime || !form.endTime) {
      alert("Please fill Date, Start Time, and End Time");
      return;
    }

    if (!agentId) {
      alert("User not authenticated");
      return;
    }

    // Prepare payload for backend (no status field)
    const payload = {
      agentId: agentId,
      availabilityDate: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes,
      breaks: form.breaks.map((b) => ({
        breakStart: b.start,
        breakEnd: b.end,
      })),
    };

    try {
      const response = await apiRequest("http://localhost:8080/api/availability", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchAvailability();
        resetForm();
      } else {
        let errorMsg = "Failed to save availability";
        try {
          const errorData = await response.json();
          errorMsg += ": " + (errorData.message || "");
        } catch {}
        alert(errorMsg);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  // Delete availability slot (frontend only, you may want to implement backend delete)
  const deleteAvailability = (id) => {
    setAvailabilityList(
      availabilityList.filter((slot) => slot.availabilityId !== id)
    );
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add a break slot
  const addBreak = () => {
    setForm({
      ...form,
      breaks: [...form.breaks, { start: "", end: "" }],
    });
  };

  // Update a break slot
  const handleBreakChange = (index, field, value) => {
    const updatedBreaks = [...form.breaks];
    updatedBreaks[index][field] = value;
    setForm({ ...form, breaks: updatedBreaks });
  };

  // Split slots into active and history
  const now = new Date();
  const activeSlots = availabilityList.filter((slot) => {
    const slotDate =
      typeof slot.availabilityDate === "string"
        ? parseISO(slot.availabilityDate)
        : slot.availabilityDate;
    const endTime = slot.endTime || "23:59";
    const slotEnd = new Date(slotDate);
    if (endTime.length >= 5) {
      const [h, m] = endTime.split(":");
      slotEnd.setHours(Number(h), Number(m), 0, 0);
    }
    return isAfter(slotEnd, now);
  });

  const historySlots = availabilityList.filter((slot) => {
    const slotDate =
      typeof slot.availabilityDate === "string"
        ? parseISO(slot.availabilityDate)
        : slot.availabilityDate;
    const endTime = slot.endTime || "23:59";
    const slotEnd = new Date(slotDate);
    if (endTime.length >= 5) {
      const [h, m] = endTime.split(":");
      slotEnd.setHours(Number(h), Number(m), 0, 0);
    }
    return isBefore(slotEnd, now);
  });

  // Determine agent's overall status
  let agentStatus = "Unavailable";
  if (activeSlots.some((slot) => slot.status === "Available")) {
    agentStatus = "Available";
  } else if (activeSlots.some((slot) => slot.status === "Booked")) {
    agentStatus = "Booked";
  }

  return (
    <div className="p-6 bg-[#111111] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h1 className="text-2xl font-bold mb-4 text-white">Agent Availability Management</h1>

      {/* Agent Status Indicator */}
      <div className="mb-4">
        <span className="font-semibold text-white">Current Status: </span>
        <span
          className={
            agentStatus === "Available"
              ? "text-green-400"
              : agentStatus === "Booked"
              ? "text-yellow-400"
              : "text-red-400"
          }
        >
          {agentStatus}
        </span>
      </div>

      {/* Form Section */}
      <div className="bg-[#1c1c1c] shadow-md rounded-xl p-6 mb-6 border border-[#333333]">
        <h2 className="text-lg font-semibold mb-3 text-white">Add Availability Slot</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block font-medium text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border border-[#333333] rounded-lg p-2 w-full bg-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b]"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block font-medium text-gray-400">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border border-[#333333] rounded-lg p-2 w-full bg-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b]"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block font-medium text-gray-400">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border border-[#333333] rounded-lg p-2 w-full bg-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b]"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block font-medium text-gray-400">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="border border-[#333333] rounded-lg p-2 w-full bg-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b]"
              placeholder="Special instructions (optional)"
            />
          </div>
        </div>

        {/* Breaks */}
        <div className="mt-4">
          <label className="block font-medium mb-2 text-gray-400">Breaks</label>
          {form.breaks.map((brk, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="time"
                value={brk.start}
                onChange={(e) =>
                  handleBreakChange(index, "start", e.target.value)
                }
                className="border border-[#333333] rounded-lg p-2 bg-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b]"
              />
              <input
                type="time"
                value={brk.end}
                onChange={(e) =>
                  handleBreakChange(index, "end", e.target.value)
                }
                className="border border-[#333333] rounded-lg p-2 bg-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b]"
              />
            </div>
          ))}
          <button
            onClick={addBreak}
            className="bg-[#333333] hover:bg-[#999999] px-3 py-1 rounded-lg text-white transition-colors"
          >
            + Add Break
          </button>
        </div>

        <button
          onClick={addAvailability}
          className="mt-4 bg-[#1cb08b] text-white px-4 py-2 rounded-lg hover:bg-[#0a8a6a] transition-colors"
        >
          Add Availability
        </button>
      </div>

      {/* Active Availability List */}
      <div className="bg-[#1c1c1c] shadow-md rounded-xl p-6 mb-6 border border-[#333333]">
        <h2 className="text-lg font-semibold mb-3 text-white">Active Slots</h2>
        {activeSlots.length === 0 ? (
          <p className="text-gray-400">No active availability slots.</p>
        ) : (
          <table className="w-full border border-[#333333]">
            <thead>
              <tr className="bg-[#2a2a2a] text-left">
                <th className="p-2 border border-[#333333] text-gray-400">Date</th>
                <th className="p-2 border border-[#333333] text-gray-400">Time</th>
                <th className="p-2 border border-[#333333] text-gray-400">Breaks</th>
                <th className="p-2 border border-[#333333] text-gray-400">Status</th>
                <th className="p-2 border border-[#333333] text-gray-400">Notes</th>
                <th className="p-2 border border-[#333333] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSlots.map((slot) => (
                <tr key={slot.availabilityId} className="border-b border-[#333333] hover:bg-[#2a2a2a]">
                  <td className="p-2 border border-[#333333] text-white">
                    {format(
                      typeof slot.availabilityDate === "string"
                        ? parseISO(slot.availabilityDate)
                        : slot.availabilityDate,
                      "dd/MM/yyyy"
                    )}
                  </td>
                  <td className="p-2 border border-[#333333] text-white">
                    {slot.startTime} - {slot.endTime}
                  </td>
                  <td className="p-2 border border-[#333333] text-white">
                    {slot.breaks && slot.breaks.length === 0
                      ? "-"
                      : slot.breaks
                          .map((b) => `${b.breakStart} - ${b.breakEnd}`)
                          .join(", ")}
                  </td>
                  <td className="p-2 border border-[#333333] text-white">{slot.status}</td>
                  <td className="p-2 border border-[#333333] text-white">{slot.notes || "-"}</td>
                  <td className="p-2 border border-[#333333] text-white">
                    <button
                      onClick={() => deleteAvailability(slot.availabilityId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* History List */}
      <div className="bg-[#1c1c1c] shadow-md rounded-xl p-6 border border-[#333333]">
        <h2 className="text-lg font-semibold mb-3 text-white">History</h2>
        {historySlots.length === 0 ? (
          <p className="text-gray-400">No past slots.</p>
        ) : (
          <table className="w-full border border-[#333333]">
            <thead>
              <tr className="bg-[#2a2a2a] text-left">
                <th className="p-2 border border-[#333333] text-gray-400">Date</th>
                <th className="p-2 border border-[#333333] text-gray-400">Time</th>
                <th className="p-2 border border-[#333333] text-gray-400">Breaks</th>
                <th className="p-2 border border-[#333333] text-gray-400">Status</th>
                <th className="p-2 border border-[#333333] text-gray-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              {historySlots.map((slot) => (
                <tr key={slot.availabilityId} className="border-b border-[#333333] hover:bg-[#2a2a2a]">
                  <td className="p-2 border border-[#333333] text-white">
                    {format(
                      typeof slot.availabilityDate === "string"
                        ? parseISO(slot.availabilityDate)
                        : slot.availabilityDate,
                      "dd/MM/yyyy"
                    )}
                  </td>
                  <td className="p-2 border border-[#333333] text-white">
                    {slot.startTime} - {slot.endTime}
                  </td>
                  <td className="p-2 border border-[#333333] text-white">
                    {slot.breaks && slot.breaks.length === 0
                      ? "-"
                      : slot.breaks
                          .map((b) => `${b.breakStart} - ${b.breakEnd}`)
                          .join(", ")}
                  </td>
                  <td className="p-2 border border-[#333333] text-white">{slot.status}</td>
                  <td className="p-2 border border-[#333333] text-white">{slot.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
