import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

// ✅ Correct parameter destructuring and typing
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

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
