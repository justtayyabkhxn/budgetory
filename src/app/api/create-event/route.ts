import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

const JWT_SECRET = process.env.JWT_SECRET!; // Make sure it's set in .env

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token'+err }, { status: 403 });
    }

    const userId = decoded.id || decoded.sub;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    const body = await req.json();
    const { name, type, description, date } = body;

    if (!name) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const event = new Event({
      name,
      type,
      description,
      date,
      createdBy: userId,
      status:"Incomplete"
    });

    await event.save();
    console.log('Saved Event:', event);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error: ' + (error as Error).message }, { status: 500 });
  }
}
