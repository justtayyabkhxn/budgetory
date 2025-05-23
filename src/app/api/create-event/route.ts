import { NextResponse } from "next/server";
import  dbConnect  from "@/lib/dbConnect";
import Event from "@/models/Event"; // adjust the path as per your project structure

export async function POST(req: Request) {
  try {
    await dbConnect();
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
    });

    const createdEvent = await newEvent.save();

    return NextResponse.json({ event: createdEvent }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown server error occurred." },
      { status: 500 }
    );
  }
}
