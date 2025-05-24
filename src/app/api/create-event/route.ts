import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/auth"; // ✅ You need to implement this

export async function POST(req: Request) {
  try {
    await dbConnect();

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token); // ✅ implement this to decode JWT
    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 403 });
    }

    const body = await req.json();
    const { name, type, date, description } = body;

    if (!name || !type || !date) {
      return NextResponse.json(
        { error: "Name, type, and date are required." },
        { status: 400 }
      );
    }

    const newEvent = new Event({
      name,
      type,
      date,
      description,
      createdBy: userId, // ✅ This fixes the error
    });

    const createdEvent = await newEvent.save();

    return NextResponse.json({ event: createdEvent }, { status: 200 });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown server error occurred." }, { status: 500 });
  }
}
