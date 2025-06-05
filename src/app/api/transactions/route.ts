// app/api/transactions/route.ts
import jwt from "jsonwebtoken";
import connectDB from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import { encrypt, decrypt } from "@/utils/crypto";

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

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const userId = getUserId(auth);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { title, amount, category, type, date, comment, paymentMode } =
    await req.json();

  await connectDB();

  try {
    const tx = await Transaction.create({
      userId,
      title: encrypt(title),
      amount: encrypt(amount.toString()),
      category,
      type,
      date: new Date(date),
      comment: encrypt(comment || ""),
      paymentMode,
    });

    return new Response(JSON.stringify({ transaction: tx }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to add transaction";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const userId = getUserId(auth);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await connectDB();

  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    const decryptedTxns = transactions.map(txn => ({
      ...txn.toObject(),
      title: decrypt(txn.title),
      amount: parseFloat(decrypt(txn.amount)),
      comment: decrypt(txn.comment),
    }));

    return new Response(JSON.stringify({ transactions: decryptedTxns }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch transactions"+err }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const userId = getUserId(auth);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await connectDB();

  try {
    await Transaction.deleteMany({ userId });
    return new Response(
      JSON.stringify({ message: "All transactions deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete transactions";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
