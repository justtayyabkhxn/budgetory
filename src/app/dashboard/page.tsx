"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddTransactionForm } from "../../components/AddTransactionForm";
import { TxnCard } from "../../components/TxnCard";
import Link from "next/link";

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
  // Add any other fields you decode from the token
};


export default function Dashboard() {
  const [user, setUser] = useState<User | null >(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [inflow, setInflow] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [net, setNet] = useState<number>(0);

  const router = useRouter();
  useEffect(() => {
    const inflowSum = txs
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenseSum = txs
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

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

  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.removeItem("token");
    router.push("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-6 mb-5">
          <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
            <Link href="/">💰MyBudgetory</Link>
          </h1>
        </section>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back 👋, {user?.email || "User"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Summary Cards (you can update these with real sums later) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 ">
          <TxnCard
            title="Total Inflow"
            amount={`₹ ${inflow.toLocaleString()}.00`}
            color="text-green-400"
          />
          <TxnCard
            title="Total Expenses"
            amount={`₹ ${expense.toLocaleString()}.00`}
            color="text-red-500"
          />
          <TxnCard
            title="Net"
            amount={`₹ ${net.toLocaleString()}.00`}
            color="text-gray-300"
          />
        </div>

        {/* Add Transaction Form (kept above recent list) */}
        <AddTransactionForm onAdd={fetchTransactions} />

        {/* Recent Transactions */}
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

          {txs.length === 0 ? (
            <p className="text-gray-400">No transactions yet.</p>
          ) : (
            <ul className="space-y-3">
              {[...txs].slice(0, 10).map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-md"
                >
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.date).toLocaleDateString()} • {tx.category}
                    </p>
                    <p className="text-sm text-gray-400">{tx.comment}</p>
                  </div>
                  <p
                    className={`font-bold ${
                      tx.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.type === "income" ? "+ " : "- "}₹ {tx.amount}
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="text-sm text-red-500 hover:text-red-700 ml-4 cursor-pointer"
                    >
                      Delete
                    </button>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
