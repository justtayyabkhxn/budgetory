import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const updated = await DebtLent.findByIdAndUpdate(
    params.id,
    { status: 'cleared' },
    { new: true }
  );

  return NextResponse.json(updated);
}
