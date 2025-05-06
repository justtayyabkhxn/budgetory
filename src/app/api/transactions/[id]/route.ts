import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/getUserFromToken";
import Transaction from "@/models/Transaction";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Extract transaction ID from the URL
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
  }

  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Transaction deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Server error", detail: `${err}` },
      { status: 500 }
    );
  }
}
