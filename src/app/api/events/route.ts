// src/app/api/events/route.ts

import jwt from 'jsonwebtoken';
import connectDB from '@/lib/dbConnect';
import Event from '@/models/Event';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Helper: extract userId from “Authorization: Bearer <token>”
function getUserId(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
}

// GET /api/events — Fetch events created by current user
export async function GET(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const userId = getUserId(auth);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await connectDB();
  try {
    const events = await Event.find({ createdBy: userId }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to fetch events';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
