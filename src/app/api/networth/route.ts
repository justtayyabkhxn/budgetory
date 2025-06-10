// app/api/networth/route.ts
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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization") || "";
    const userId = getUserId(auth);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the user's net worth document
    const userNetWorth = await NetWorth.findOne({ userId });

    if (!userNetWorth) {
      // If no document exists, return 0 as default balance
      return NextResponse.json({ bankBalance: 0 });
    }

    return NextResponse.json({ 
      bankBalance: userNetWorth.bankBalance || 0 
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}