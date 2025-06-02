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
  Pencil,
  CircleArrowLeft,
  CookingPot,
  ArrowRightLeft,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const router = useRouter();

  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEdit = (txn: Transaction) => {
    setEditingTxn({ ...txn });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTxn) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.patch(
        `/api/transactions/${editingTxn._id}`,
        editingTxn,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setTransaction(response.data.transaction); // update the UI with new data
        setEditingTxn(null);
      } else {
        alert("Failed to update transaction");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating transaction");
    }
  };

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
        router.push("/dashboard");
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
  const Icon =
    categoryIcons[transaction?.category as keyof typeof categoryIcons] ||
    BanknoteArrowUp;

  const renderHeader = () => (
    <section className="text-center max-w-2xl mx-auto space-y-6 mb-4 mt-5">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.1, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md"
          >
            MyBudgetory
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );

  if (isLoading || isError || !transaction) {
    return (
      <div className="max-w-5xl mx-auto px-4">
        {renderHeader()}
        <p
          className={`text-center text-xl font-extrabold mt-10 ${
            isLoading ? "text-gray-700" : "text-red-500"
          }`}
        >
          {isLoading
            ? "Loading Transaction..."
            : errorMessage || "Transaction not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10">
      <div className="max-w-3xl mx-auto">{renderHeader()}</div>

      <div className="flex justify-center gap-40 items-center mt-4 px-4 md:px-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl text-white font-bold hover:underline"
        >
          <CircleArrowLeft />
          <span>Go Back</span>
        </Link>
        <Menu />
      </div>

      <div className="max-w-sm mx-auto mt-8 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-gray-900 shadow-xl space-y-6 transition-all">
        <div className="flex items-center gap-2  text-white">
          <ArrowRightLeft />
          <h1 className="text-3xl font-extrabold text-center text-white tracking-tight">
            Transaction Details
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-indigo-500/10">
            <Icon className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <p className="text-xl font-medium text-white">
              {transaction.title}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(transaction.date).toLocaleDateString()} •{" "}
              {transaction.category} • {transaction.paymentMode}
            </p>
          </div>
        </div>

        <div className="text-gray-300 space-y-2">
          <p>
            <span className="text-white font-semibold">Amount:</span>{" "}
            <span
              className={`font-bold ${
                transaction.type === "income"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {transaction.type === "income" ? "+ ₹" : "- ₹"}
              {transaction.amount}
            </span>
          </p>
          <p>
            <span className="text-white font-semibold">Mode:</span>{" "}
            {transaction.paymentMode}
          </p>
          <p>
            <span className="text-white font-semibold">Type:</span>{" "}
            {transaction.type}
          </p>
          <p>
            <span className="text-white font-semibold">Comment:</span>{" "}
            {transaction.comment || "No Comment"}
          </p>
          <p>
            <span className="text-white font-semibold">Date:</span>{" "}
            {transaction.date.split("T")[0]}
          </p>
        </div>

        <div className="flex justify-around gap-4 mt-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete(transaction._id);
            }}
            className="border-2 border-red-500 text-red-500 font-bold cursor-pointer px-4 py-2 rounded-xl hover:text-red-500 hover:border-red-600 transition"
          >
            <div className="flex items-center gap-2">
              <span>Delete</span>
              <CookingPot size={16} />
            </div>
          </button>
          <button
            onClick={() => handleEdit(transaction)}
            className="border-2 border-green-500 cursor-pointer text-green-400 font-bold px-4 py-2 rounded-xl hover:text-green-600 hover:border-green-600 transition"
          >
            <div className="flex items-center gap-2">
              <span>Edit</span>
              <Pencil size={15} />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {editingTxn && (
            <motion.form
              key="edit-form"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleUpdate}
              className="bg-[#111]/90 border border-gray-900 p-4 rounded-xl space-y-4"
            >
              <h3 className="text-lg font-bold text-yellow-500">
                Edit Transaction
              </h3>

              <input
                type="text"
                value={editingTxn.title}
                onChange={(e) =>
                  setEditingTxn({ ...editingTxn, title: e.target.value })
                }
                placeholder="Title"
                className="w-full p-2 bg-gray-900 border border-gray-800 rounded text-white"
              />

              <input
                type="number"
                value={editingTxn.amount}
                onChange={(e) =>
                  setEditingTxn({
                    ...editingTxn,
                    amount: parseFloat(e.target.value),
                  })
                }
                placeholder="Amount"
                className="w-full p-2 bg-gray-900 border border-gray-800 rounded text-white"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded text-sm cursor-pointer"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setEditingTxn(null)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
