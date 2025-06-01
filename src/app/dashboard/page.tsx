"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddTransactionForm } from "../../components/AddTransactionForm";
import { TxnCard } from "../../components/TxnCard";
import Link from "next/link";
import Menu from "@/components/Menu";
import {
  Utensils,
  Shirt,
  Briefcase,
  HeartPulse,
  ReceiptText,
  Clapperboard,
  Plane,
  BanknoteArrowUp,
  FileDigit,
  RefreshCcwDot,
  CalendarClock,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

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

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  comment: string;
  paymentMode: "Cash" | "UPI";
}

type User = {
  id: string;
  email: string;
  // Add any other fields you decode from the token
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [inflow, setInflow] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [net, setNet] = useState<number>(0);
  const [today, setToday] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function preventTouchMove(e: TouchEvent) {
      e.preventDefault();
    }
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("touchmove", preventTouchMove);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [menuOpen]);

  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const inflowSum = txs
      .filter(
        (tx) =>
          tx.type === "income" &&
          new Date(tx.date).getMonth() === currentMonth &&
          new Date(tx.date).getFullYear() === currentYear
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenseSum = txs
      .filter(
        (tx) =>
          tx.type === "expense" &&
          new Date(tx.date).getMonth() === currentMonth &&
          new Date(tx.date).getFullYear() === currentYear
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const todaySum = txs
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          tx.type === "expense" &&
          txDate.getDate() === now.getDate() &&
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    setToday(todaySum);
    setInflow(inflowSum);
    setExpense(expenseSum);
    setNet(inflowSum - expenseSum);
  }, [txs]);

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

    setLoading(true); // start loading
    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTxs(data.transactions);
      })
      .catch(console.error)
      .finally(() => setLoading(false)); // stop loading
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-8">
      <div className={menuOpen ? "overflow-hidden h-screen" : ""}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
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
                  className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-700"
                >
                  MyBudgetory
                </motion.span>
              </Link>
            </motion.div>
          </section>

          {/* Dashboard and Transactions */}
          <div className="mb-5 mt-4 flex items-center justify-between">
            {/* Left side: Heading and welcome text */}
            <div className="mt-0">
              <div className="flex items-center gap-2">
                <FileDigit />
                <h1 className="text-4xl font-extrabold tracking-tight">
                  Dashboard
                </h1>
              </div>
              <p className="text-gray-400 mt-1">
                Welcome back 👋, {user?.email || "User"}
              </p>
            </div>

            <div className="mb-12">
              <Menu />
            </div>

            {menuOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setMenuOpen(false)}
              />
            )}
            {/* Menu */}
          </div>

          <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight mb-4">
            <CalendarClock />
            Today :{" "}
            <span className={`text-gray-300 ${loading ? "animate-pulse" : ""}`}>
              {loading ? "Loading..." : `₹ ${today}.00`}
            </span>{" "}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-x-auto mb-10">
            <Link href="/inflow" className="cursor-pointer">
              <TxnCard
                title={`Total Inflow (${new Date().toLocaleString("default", {
                  month: "long",
                })})`}
                amount={
                  loading ? "Loading..." : `₹ ${inflow.toLocaleString()}.00`
                }
                color="text-green-400"
              />
            </Link>
            <Link href="/expenses" className="cursor-pointer">
              <TxnCard
                title={`Total Expenses (${new Date().toLocaleString("default", {
                  month: "long",
                })})`}
                amount={
                  loading ? "Loading..." : `₹ ${expense.toLocaleString()}.00`
                }
                color="text-red-500"
              />
            </Link>
            <div>
              <TxnCard
                title={`Net (${new Date().toLocaleString("default", {
                  month: "long",
                })})`}
                amount={loading ? "Loading..." : `₹ ${net.toLocaleString()}.00`}
                color="text-gray-300"
              />
            </div>
          </div>
          {/* Add Transaction Form (kept above recent list) */}
          <AddTransactionForm onAdd={fetchTransactions} />

          {/* Recent Transactions */}
          <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-900 rounded-xl p-6 shadow-lg ">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCcwDot />
              <h2 className="text-xl font-semibold ">Recent Transactions</h2>
            </div>

            {loading ? (
              <p className="text-gray-400 animate-pulse">
                Loading transactions...
              </p>
            ) : txs.length === 0 ? (
              <p className="text-gray-400">No transactions yet.</p>
            ) : (
              <ul className="space-y-3 border-gray-900">
                {[...txs].slice(0, 5).map((tx) => {
                  const Icon = categoryIcons[tx.category] || BanknoteArrowUp;

                  return (
                    <Link
                      href={`/transactions/${tx._id}`}
                      key={tx._id}
                      className="block"
                    >
                      <li className="flex justify-between items-center p-4 bg-white/2 hover:bg-white/10 backdrop-blur-md border  rounded-xl transition-all duration-300 cursor-pointer shadow-md border-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/10 p-2 rounded-full">
                            <Icon className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <p className=" font-bold">{tx.title}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(tx.date).toLocaleDateString()} •{" "}
                              {tx.category} • {tx.paymentMode}
                            </p>
                            <p className="text-sm text-gray-400">
                              {tx.comment}
                            </p>
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
                            onClick={(e) => {
                              e.stopPropagation(); // prevent link navigation
                              e.preventDefault(); // prevent default link behavior
                              handleDelete(tx._id);
                            }}
                            className="text-sm text-red-500 hover:text-red-700 ml-4 cursor-pointer font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            )}

            {!loading && (
              <div className="font-bold text-blue-400 mt-1 text-right">
                <Link href="/transactions">See All Transactions</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
