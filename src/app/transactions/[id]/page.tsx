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
  SkipBack,
} from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ import router

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Menu from "@/components/Menu";

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
  const { id } = useParams();
  const router = useRouter(); // ✅ initialize router

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  ("use client");

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard"); // ✅ redirect after successful deletion
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("error");
          setErrorMessage("User not authenticated.");
          return;
        }

        const res = await axios.get(`/api/transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransaction(res.data.transaction);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage("Failed to fetch transaction.");
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  const isLoading = status === "loading";
  const isError = status === "error";

  const renderHeader = () => (
    <section className="text-center max-w-2xl mx-auto space-y-6 mb-2 mt-5">
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
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-700"
          >
            MyBudgetory
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );

  if (isLoading || isError || !transaction) {
    return (
      <div className="max-w-5xl mx-auto">
        {renderHeader()}
        <p
          className={`text-center text-4xl font-extrabold mt-10 ${
            isLoading ? "text-gray-400" : "text-red-500"
          }`}
        >
          {isLoading ? "Loading..." : errorMessage || "Transaction not found."}
        </p>
      </div>
    );
  }

  const Icon = categoryIcons[transaction.category] || BanknoteArrowUp;

  return (
    <div>
      <div className="max-w-5xl mx-auto">{renderHeader()}</div>
      <div className="flex justify-center gap-30 items-center mt-4 px-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-3xl text-white font-extrabold tracking-tighter"
        >
          <SkipBack />
          <p>Go Back</p>
        </Link>
        <Menu />
      </div>

      <div className="max-w-sm mx-auto mt-5 bg-[#111]/80 border border-gray-700 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-4 text-white tracking-tighter ">
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
            <span className="font-medium text-white">Mode:</span>{" "}
            {transaction.paymentMode}
          </p>
          <p>
            <span className="font-medium text-white">Type:</span>{" "}
            {transaction.type}
          </p>
          <p>
            <span className="font-medium text-white">Comment:</span>{" "}
            {transaction.comment || "No Comment"}
          </p>
          <p>
            <span className="font-medium text-white">Date:</span>{" "}
            {transaction.date.split("T")[0]}
          </p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete(transaction._id);
            }}
            className="text-sm border-2 px-4 py-2 rounded-2xl font-bold text-red-500 hover:text-red-700 cursor-pointer"
          >
            Delete Transaction
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // TODO: Add handleEdit or routing logic
            }}
            className="text-sm border-2 px-4 py-2 rounded-2xl font-bold text-green-500 hover:text-green-600 cursor-pointer"
          >
            Edit Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
