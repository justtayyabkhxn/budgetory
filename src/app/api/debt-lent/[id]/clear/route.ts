import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

export async function PATCH(req: Request, context: any) {
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
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
