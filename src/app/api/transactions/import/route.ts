import jwt from 'jsonwebtoken';
import connectDB from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function getUserId(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const userId = getUserId(auth);
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let transactions;
  try {
    transactions = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!Array.isArray(transactions)) {
    return new Response(
      JSON.stringify({ error: 'Expected an array of transactions' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await connectDB();

  let importedCount = 0;

  try {
    for (const tx of transactions) {
      const { title, amount, category, type, date, comment, paymentMode } = tx;

      // Basic validation
      if (
        !title ||
        typeof amount !== 'number' ||
        !category ||
        !type ||
        !date
      ) {
        // Skip invalid transaction
        continue;
      }

      await Transaction.create({
        userId,
        title,
        amount,
        category,
        type,
        date: new Date(date),
        comment: comment || '',
        paymentMode: paymentMode || 'Cash', // default to 'cash' if not provided
      });

      importedCount++;
    }

    return new Response(
      JSON.stringify({ message: `Imported ${importedCount} transactions.` }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to import transactions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
