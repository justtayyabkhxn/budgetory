// app/api/networth/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import NetWorth from "@/models/NetWorth";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function getUserId(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { adjustment, paymentMode } = await req.json();
    const amount = parseFloat(adjustment);

    if (isNaN(amount)) {
      return NextResponse.json(
        { error: "Invalid adjustment amount" },
        { status: 400 }
      );
    }

    const auth = req.headers.get("authorization") || "";
    const userId = getUserId(auth);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find and update the net worth document
    const userNetWorth = await NetWorth.findOneAndUpdate(
      { userId },
      { 
        $inc: { bankBalance: amount }, // Increment/decrement the balance
        $set: { lastUpdated: new Date() },
        $push: { 
          transactions: {
            amount: Math.abs(amount),
            type: amount >= 0 ? "credit" : "debit",
            paymentMode,
            date: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      bankBalance: userNetWorth.bankBalance,
      message: "Balance updated successfully"
    });

  } catch (err) {
    console.error("Balance update error:", err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}