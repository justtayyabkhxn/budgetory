import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

// Define the expected context type
interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    const updated = await DebtLent.findByIdAndUpdate(
      id,
      { status: 'cleared' },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
