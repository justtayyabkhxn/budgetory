import connectDB from '@/lib/dbConnect';
import DebtLent from '@/models/DebtLent';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectDB();

    const updated = await DebtLent.findByIdAndUpdate(
      params.id,
      { status: 'cleared' },
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error'+err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
