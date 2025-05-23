// models/Transaction.ts
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  type: { type: String, enum: ['inflow', 'outflow'], required: true },
  category: { type: String }, // e.g., Food, Travel
  amount: { type: Number, required: true },
  paidBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }], // multiple possible
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
