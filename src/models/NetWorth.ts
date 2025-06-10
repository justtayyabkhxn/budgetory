// models/NetWorth.ts
import mongoose, { Schema, Document } from "mongoose";

export interface INetWorth extends Document {
  userId: string;
  bankBalance: number;
}

const NetWorthSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  bankBalance: { type: Number, default: 0 },
});

export default mongoose.models.NetWorth ||
  mongoose.model<INetWorth>("NetWorth", NetWorthSchema);
