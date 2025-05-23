"use client";
import { useState } from "react";
import axios from "axios";

const eventTypes = ["Trip", "Dining", "Party", "Custom"];

export default function CreateEvent() {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    name: "",
    type: "Trip",
    date: "",
    description: "",
  });

  const [numParticipants, setNumParticipants] = useState(1);
  const [participants, setParticipants] = useState<string[]>([""]);

  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEventChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  }

  function handleNumParticipantsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(1, Number(e.target.value));
    setNumParticipants(val);
    const newParticipants = [...participants];
    while (newParticipants.length < val) newParticipants.push("");
    while (newParticipants.length > val) newParticipants.pop();
    setParticipants(newParticipants);
  }

  function handleParticipantNameChange(index: number, value: string) {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  }

 async function submitEvent() {
  setError(null);
  if (!eventData.name) {
    setError("Event name is required.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    setError("User not authenticated.");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post("/api/create-event", eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setCreatedEventId(res.data.event._id);
    setStep(2);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(
        "Failed to create event. " +
          (err.response?.data?.error || err.message)
      );
    } else if (err instanceof Error) {
      setError("Failed to create event. " + err.message);
    } else {
      setError("Failed to create event due to an unknown error.");
    }
  } finally {
    setLoading(false);
  }
}


  async function submitParticipants() {
    setError(null);
    if (participants.some((p) => !p.trim())) {
      setError("Please fill in all participant names.");
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        participants.map((name) =>
          axios.post("/api/participant", { name, eventId: createdEventId })
        )
      );
      alert("Event and participants created successfully!");
      setStep(1);
      setEventData({ name: "", type: "Trip", date: "", description: "" });
      setNumParticipants(1);
      setParticipants([""]);
      setCreatedEventId(null);
    } catch (err) {
      setError("Failed to add participants. " + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mt-10 mx-auto px-5 py-5 text-white bg-white/5 shadow-xl rounded-2xl border border-gray-600">
      <h1 className="text-xl font-bold mb-8">
        Create New Event
      </h1>
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block mb-2 font-semibold text-indigo-300">
                Event Name
              </label>
              <input
                name="name"
                value={eventData.name}
                onChange={handleEventChange}
                type="text"
                className="w-full p-3 bg-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Trip to Manali"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-2 font-semibold text-indigo-300">
                Event Type
              </label>
              <select
                name="type"
                value={eventData.type}
                onChange={handleEventChange}
                className="w-full p-3 bg-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {eventTypes.map((et) => (
                  <option key={et} value={et}>
                    {et}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-indigo-300">
              Date
            </label>
            <input
              name="date"
              value={eventData.date}
              onChange={handleEventChange}
              type="date"
              className="w-full p-3 bg-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-indigo-300">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleEventChange}
              className="w-full p-3 bg-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Write a short description..."
            />
          </div>

          {error && <p className="text-red-500 font-medium">{error}</p>}
          <button
            onClick={submitEvent}
            disabled={loading}
            className="w-full py-3 mt-0 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Next: Add Participants"}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-indigo-300">
              Number of Participants
            </label>
            <input
              type="number"
              min={1}
              value={numParticipants}
              onChange={handleNumParticipantsChange}
              className="w-24 p-3 bg-gray-950 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-4">
            {participants.map((name, idx) => (
              <div key={idx}>
                <label className="block mb-1 font-semibold text-indigo-300">
                  Participant {idx + 1}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    handleParticipantNameChange(idx, e.target.value)
                  }
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Name of Person ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 font-medium">{error}</p>}

          <button
            onClick={submitParticipants}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Finish & Save Event"}
          </button>
        </div>
      )}
    </div>
  );
}
