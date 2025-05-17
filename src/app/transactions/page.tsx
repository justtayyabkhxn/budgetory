"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Papa from "papaparse";
import MenuButton from "@/components/Menu";

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  comment: string;
}

type User = {
  id: string;
  email: string;
};

import {
  Utensils,
  Shirt,
  Briefcase,
  HeartPulse,
  ReceiptText,
  Clapperboard,
  Plane,
  BanknoteArrowUp,
  BadgeIndianRupee,
} from "lucide-react";

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

export default function Transactions() {
  const [user, setUser] = useState<User | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleExportCSV = () => {
    const dataToExport = txs.map(({ ...tx }) => tx); // Remove _id from CSV
    const csv = Papa.unparse(dataToExport);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check auth + decode user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  // Fetch transactions
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTxs(data.transactions);
      })
      .catch(console.error);
  }, [user]);

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
        setTxs((prev) => prev.filter((tx) => tx._id !== id));
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTxs(data.transactions);
      })
      .catch(console.error);
  };
  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-6 mb-5">
          <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
            <Link href="/">💰MyBudgetory</Link>
          </h1>
        </section>
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <BadgeIndianRupee />
              <h1 className="text-4xl font-extrabold tracking-tight mb-0">
                Transactions
              </h1>
            </div>
            <MenuButton />
          </div>
        </div>
        {/* Recent Transactions */}
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg ">
          <div className="flex items-center justify-between gap-5 mb-4">
            <h2 className="text-xl font-semibold">All Transactions</h2>
            <button
              onClick={handleExportCSV}
              className="whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors mr-4"
            >
              Export CSV
            </button>
          </div>

          {txs.length === 0 ? (
            <p className="text-gray-400">No transactions yet.</p>
          ) : (
            <ul className="space-y-3">
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by title or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-4 mb-4">
                  <Link href="/advanced-search">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md text-sm font-bold transition-colors whitespace-nowrap mt-4 cursor-pointer">
                      See More
                    </button>
                  </Link>
                </div>
              </div>

              {[...txs].map((tx) => {
                const Icon = categoryIcons[tx.category] || BanknoteArrowUp;

                return (
                  <li
                    key={tx._id}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                       <div className="bg-white/10 p-2 rounded-full">

                        <Icon className="w-5 h-5 text-indigo-400" />
                        </div>
                      <div>
                        <p className="font-medium">{tx.title}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(tx.date).toLocaleDateString()} •{" "}
                          {tx.category}
                        </p>
                        <p className="text-sm text-gray-400">{tx.comment}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          tx.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.type === "income" ? "+ " : "- "}₹ {tx.amount}
                      </p>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-sm text-red-500 hover:text-red-700 ml-4 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
