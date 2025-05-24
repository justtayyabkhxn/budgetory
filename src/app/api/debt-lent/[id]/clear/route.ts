import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const updated = await DebtLent.findByIdAndUpdate(
      params.id,
      { status: 'cleared' },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Server error'+error }, { status: 500 });
  }
}
