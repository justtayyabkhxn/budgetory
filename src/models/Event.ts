// models/Event.ts
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Trip', 'Dining', 'Party', 'Custom'], default: 'Custom' },
  description: { type: String },
  date: { type: Date, default: Date.now },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  status:{type:String, enum:['Complete','Incomplete'],default: 'Incomplete'},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added field
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
