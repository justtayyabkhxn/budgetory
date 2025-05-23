// pages/api/transaction.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/TransactionEvent';
import Event from '@/models/Event';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { eventId, type, category, amount, paidBy, sharedWith, notes } = req.body;

      if (!eventId || !type || !amount || !paidBy || !sharedWith) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate event exists
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ error: 'Event not found' });

      const transaction = new Transaction({
        eventId,
        type,
        category,
        amount,
        paidBy,
        sharedWith,
        notes,
      });

      await transaction.save();

      return res.status(201).json({ transaction });
    } catch (error) {
      return res.status(500).json({ error: 'Server error'+error });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
