// models/Participant.ts
import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  color: { type: String }, // Optional UI color/icon tag
});

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);
