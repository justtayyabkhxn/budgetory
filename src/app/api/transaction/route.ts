// src/app/api/transaction/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/TransactionEvent';
import Event from '@/models/Event';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { eventId, type, category, amount, paidBy, sharedWith, notes } = body;

    if (!eventId || !type || !amount || !paidBy || !sharedWith) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

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

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error: ' + error }, { status: 500 });
  }
}
