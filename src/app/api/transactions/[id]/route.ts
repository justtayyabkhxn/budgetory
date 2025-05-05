import { getUserFromToken } from "@/utils/getUserFromToken";
import Transaction from "@/models/Transaction";
import dbConnect from "@/lib/dbConnect";

// This is the correct signature for dynamic route handlers
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await dbConnect();

  // Await params before destructuring
  const { id } = await params;

  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
      });
    }

    return new Response(
        JSON.stringify({ success: true, message: "Transaction deleted" }),
        {
          status: 200,
        }
      );
      
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
