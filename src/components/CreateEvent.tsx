"use client";
import { useState } from 'react';
import axios from 'axios';

const eventTypes = ['Trip', 'Dining', 'Party', 'Custom'];

export default function CreateEvent() {
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState({
    name: '',
    type: 'Trip',
    date: '',
    description: '',
  });

  const [numParticipants, setNumParticipants] = useState(1);
  const [participants, setParticipants] = useState<string[]>(['']);

  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEventChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  }

  function handleNumParticipantsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.max(1, Number(e.target.value));
    setNumParticipants(val);
    const newParticipants = [...participants];
    while (newParticipants.length < val) newParticipants.push('');
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
      setError('Event name is required.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/create-event', eventData);
      setCreatedEventId(res.data.event._id);
      setStep(2);
    } catch (err) {
      setError('Failed to create event.');
    } finally {
      setLoading(false);
    }
  }

  async function submitParticipants() {
    setError(null);
    if (participants.some((p) => !p.trim())) {
      setError('Please fill in all participant names.');
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        participants.map((name) =>
          axios.post('/api/participant', { name, eventId: createdEventId })
        )
      );
      alert('Event and participants created successfully!');
      setStep(1);
      setEventData({ name: '', type: 'Trip', date: '', description: '' });
      setNumParticipants(1);
      setParticipants(['']);
      setCreatedEventId(null);
    } catch (err) {
      setError('Failed to add participants.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      {step === 1 && (
        <div>
          <label className="block mb-2 font-semibold">Event Name</label>
          <input
            name="name"
            value={eventData.name}
            onChange={handleEventChange}
            type="text"
            className="w-full p-2 border rounded mb-4 text-white bg-gray-800"
            placeholder="Trip to Manali"
          />

          <label className="block mb-2 font-semibold">Event Type</label>
          <select
            name="type"
            value={eventData.type}
            onChange={handleEventChange}
            className="w-full p-2 border rounded mb-4 text-white bg-gray-800"
          >
            {eventTypes.map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-semibold">Date</label>
          <input
            name="date"
            value={eventData.date}
            onChange={handleEventChange}
            type="date"
            className="w-full p-2 border rounded mb-4 text-white bg-gray-800"
          />

          <label className="block mb-2 font-semibold">Description (optional)</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleEventChange}
            className="w-full p-2 border rounded mb-4 text-white bg-gray-800"
            rows={3}
            placeholder="Write a short description..."
          />

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <button
            onClick={submitEvent}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Next: Add Participants'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block mb-2 font-semibold">Number of Participants</label>
          <input
            type="number"
            min={1}
            value={numParticipants}
            onChange={handleNumParticipantsChange}
            className="w-20 p-2 border rounded mb-4 text-white bg-gray-800"
          />

          <div className="mb-4">
            {participants.map((name, idx) => (
              <div key={idx} className="mb-2">
                <label className="block mb-1 font-semibold">Participant {idx + 1} Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleParticipantNameChange(idx, e.target.value)}
                  className="w-full p-2 border rounded text-white bg-gray-800"
                  placeholder={`Person ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <button
            onClick={submitParticipants}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Finish & Save Event'}
          </button>
        </div>
      )}
    </div>
  );
}
