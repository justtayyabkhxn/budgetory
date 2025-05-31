import  connectDB  from "@/lib/dbConnect"; // your db connection util
import Transaction from "@/models/Transaction"; // your Mongoose model

export async function getTransactionById(id: string) {
  await connectDB();
  const tx = await Transaction.findById(id).lean();
  return tx ? JSON.parse(JSON.stringify(tx)) : null;
}
