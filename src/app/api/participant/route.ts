// app/api/participant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Participant from '@/models/Participant';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, eventId, color } = body;

    if (!name || !eventId) {
      return NextResponse.json({ error: 'Name and eventId are required' }, { status: 400 });
    }

    const participant = new Participant({ name, eventId, color });
    await participant.save();

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
