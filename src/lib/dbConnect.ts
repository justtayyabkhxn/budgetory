// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) throw new Error('Please add your Mongo URI');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'budgetory',
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo error', err);
  }
};

export default connectDB;
