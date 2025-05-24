import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

export async function PATCH(
  req: Request,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  const { params } = await context;  // await context to get params properly

  await connectDB();
  const updated = await DebtLent.findByIdAndUpdate(
    params.id,
    { status: 'cleared' },
    { new: true }
  );
  return NextResponse.json(updated);
}
