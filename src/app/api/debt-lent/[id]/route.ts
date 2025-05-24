import connectDB from "@/lib/dbConnect";
import DebtLent from "@/models/DebtLent";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    await connectDB();
    const deleted = await DebtLent.findByIdAndDelete(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ message: 'Delete failed', error }, { status: 500 });
  }
}
