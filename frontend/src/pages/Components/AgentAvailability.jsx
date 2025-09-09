// src/pages/AgentAvailability.jsx
import React, { useState } from "react";
import { format } from "date-fns";

export default function AgentAvailability() {
  const [availabilityList, setAvailabilityList] = useState([]);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    recurring: "None",
    breaks: [],
    status: "Available",
    notes: "",
  });

  const agentId = localStorage.getItem("agentId");

  // Reset form
  const resetForm = () => {
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      recurring: "None",
      breaks: [],
      status: "Available",
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
      alert("Agent ID not found in localStorage");
      return;
    }

    // Prepare payload for backend
    const payload = {
      agentId: agentId,
      availabilityDate: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      recurring: form.recurring,
      status: form.status,
      notes: form.notes,
      breaks: form.breaks.map((b) => ({
        breakStart: b.start,
        breakEnd: b.end,
      })),
    };

    try {
      const response = await fetch("http://localhost:8080/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedSlot = await response.json();
        setAvailabilityList([...availabilityList, savedSlot]);
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

  // Delete availability slot (frontend only)
  const deleteAvailability = (id) => {
    setAvailabilityList(availabilityList.filter((slot) => slot.id !== id));
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Agent Availability Management</h1>

      {/* Form Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Add Availability Slot</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block font-medium">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          {/* Recurring */}
          <div>
            <label className="block font-medium">Recurring</label>
            <select
              name="recurring"
              value={form.recurring}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            >
              <option>None</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Custom (Mon, Wed, Fri)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            >
              <option>Available</option>
              <option>Unavailable</option>
              <option>Booked</option>
              <option>On Leave</option>
            </select>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block font-medium">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
              placeholder="Special instructions (optional)"
            />
          </div>
        </div>

        {/* Breaks */}
        <div className="mt-4">
          <label className="block font-medium mb-2">Breaks</label>
          {form.breaks.map((brk, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="time"
                value={brk.start}
                onChange={(e) =>
                  handleBreakChange(index, "start", e.target.value)
                }
                className="border rounded-lg p-2"
              />
              <input
                type="time"
                value={brk.end}
                onChange={(e) =>
                  handleBreakChange(index, "end", e.target.value)
                }
                className="border rounded-lg p-2"
              />
            </div>
          ))}
          <button
            onClick={addBreak}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg"
          >
            + Add Break
          </button>
        </div>

        <button
          onClick={addAvailability}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Availability
        </button>
      </div>

      {/* Availability List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">Your Availability</h2>
        {availabilityList.length === 0 ? (
          <p className="text-gray-500">No availability slots added yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Recurring</th>
                <th className="p-2 border">Breaks</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Notes</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilityList.map((slot) => (
                <tr key={slot.id} className="border-b">
                  <td className="p-2 border">
                    {format(new Date(slot.availabilityDate), "dd/MM/yyyy")}
                  </td>
                  <td className="p-2 border">
                    {slot.startTime} - {slot.endTime}
                  </td>
                  <td className="p-2 border">{slot.recurring}</td>
                  <td className="p-2 border">
                    {slot.breaks.length === 0
                      ? "-"
                      : slot.breaks
                          .map((b) => `${b.breakStart} - ${b.breakEnd}`)
                          .join(", ")}
                  </td>
                  <td className="p-2 border">{slot.status}</td>
                  <td className="p-2 border">{slot.notes || "-"}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => deleteAvailability(slot.id)}
                      className="text-red-600 hover:underline"
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
    </div>
  );
}
