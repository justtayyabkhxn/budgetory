import { getUserFromToken } from "@/utils/getUserFromToken";
import Transaction from "@/models/Transaction";
import dbConnect from "@/lib/dbConnect";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const user = await getUserFromToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  const { id } = context.params;

  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Transaction deleted" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return new Response(
      JSON.stringify({ error: "Server error", detail: `${err}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
