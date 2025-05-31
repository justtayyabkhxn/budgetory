"use client";

import {
  Utensils,
  Shirt,
  Briefcase,
  HeartPulse,
  ReceiptText,
  Clapperboard,
  Plane,
  BanknoteArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const categoryIcons = {
  Food: Utensils,
  Outing: Briefcase,
  Clothes: Shirt,
  Medical: HeartPulse,
  Bills: ReceiptText,
  Entertainment: Clapperboard,
  Travel: Plane,
  Others: BanknoteArrowUp,
};

type Transaction = {
  _id: string;
  title: string;
  date: string;
  category: keyof typeof categoryIcons;
  paymentMode: string;
  type: "income" | "expense";
  amount: number;
  comment?: string;
};

export default function TransactionDetailsClient() {
  const { id } = useParams(); // Get ID from URL
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem("token"); // Adjust the key if your token is stored under a different name

        if (!token) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransaction(res.data.transaction); // Make sure to access the correct field
      } catch (err: any) {
        setError("Failed to fetch transaction.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  if (error || !transaction) {
    return (
      <p className="text-center text-red-500">
        {error || "Transaction not found."}
      </p>
    );
  }

  const Icon = categoryIcons[transaction.category] || BanknoteArrowUp;

  return (
    <div>
      <div className="max-w-5xl mx-auto mt-5">
        <section className="text-center max-w-2xl mx-auto space-y-6 mb-2">
          <motion.div
            className="flex flex-col items-center text-center space-y-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.1, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="text-4xl  md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-700"
              >
                MyBudgetory
              </motion.span>
            </Link>
          </motion.div>
        </section>
      </div>
      <div className="max-w-xl mx-auto mt-10 bg-[#111]/80 border border-gray-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold mb-4 text-white">
            Transaction Details
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-3 rounded-full">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                {transaction.title}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(transaction.date).toLocaleDateString()} •{" "}
                {transaction.category} • {transaction.paymentMode}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-gray-300">
          <p>
            <span className="font-medium text-white">Amount:</span>{" "}
            <span
              className={`font-bold ${
                transaction.type === "income"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {transaction.type === "income" ? "+ " : "- "}₹{" "}
              {transaction.amount}
            </span>
          </p>
           <p>
            <span className="font-medium text-white">Type:</span>{" "}
            {transaction.type}
          </p>
          <p>
            <span className="font-medium text-white">Comment:</span>{" "}
            {transaction.comment || "—"}
          </p>
          {/* <p>
            <span className="font-medium text-white">ID:</span>{" "}
            {transaction._id}
          </p> */}
          <p>
            <span className="font-medium text-white">Date:</span>{" "}
            {transaction.date.split("T")[0]}
          </p>
         
        </div>
      </div>
    </div>
  );
}
