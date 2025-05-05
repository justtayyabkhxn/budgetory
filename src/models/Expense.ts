import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
}

const ExpenseSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
