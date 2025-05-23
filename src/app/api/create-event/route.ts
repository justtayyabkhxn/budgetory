import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, type, description, date } = body;

    if (!name) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const event = new Event({ name, type, description, date });
    await event.save();

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
