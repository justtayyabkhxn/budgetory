import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

export async function PATCH(req: Request, context: any) {
  const id = context?.params?.id; // Access params safely

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  await connectDB();

  try {
    const updated = await DebtLent.findByIdAndUpdate(
      id,
      { status: 'cleared' },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
