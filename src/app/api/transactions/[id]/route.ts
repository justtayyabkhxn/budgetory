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


export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const id = req.nextUrl.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
  }

  try {
    const transaction = await Transaction.findOne({ _id: id, userId: user._id });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, transaction }, { status: 200 });
  } catch (err) {
    console.error("GET /transactions/:id error:", err);
    return NextResponse.json(
      { error: "Server error", detail: `${err}` },
      { status: 500 }
    );
  }
}

// PATCH /api/transactions/:id
export async function PATCH(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const id = req.nextUrl.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid transaction ID" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { title, amount, category, type, date } = body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: user._id },
      { title, amount, category, type, date },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Transaction not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Transaction updated", transaction: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /transactions/:id error:", err);
    return NextResponse.json(
      { error: "Server error", detail: `${err}` },
      { status: 500 }
    );
  }
}