"use client";

import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import Charts from "@/components/Charts";

type Transaction = {
  _id: string;
  userId: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
};

const ChartsPage = () => {
  const [inflow, setInflow] = useState(0);
  const [expense, setExpense] = useState(0);
  const [dailyBarData, setDailyBarData] = useState<{
    categories: string[];
    inflow: number[];
    expense: number[];
  }>({
    categories: [],
    inflow: [],
    expense: [],
  });

  const [monthlyBarData, setMonthlyBarData] = useState<{
    categories: string[];
    inflow: number[];
    expense: number[];
  }>({
    categories: [],
    inflow: [],
    expense: [],
  });

  // Prepare data for monthly bar chart (Jan–Dec)

  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const allTxs = data.transactions;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTxs = allTxs.filter((tx: Transaction) => {
          const txDate = new Date(tx.date);
          return (
            txDate.getMonth() === currentMonth &&
            txDate.getFullYear() === currentYear
          );
        });

        const inflowAmt = monthlyTxs
          .filter((tx) => tx.type === "income")
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        const expenseAmt = monthlyTxs
          .filter((tx) => tx.type === "expense")
          .reduce((sum, tx) => sum + Number(tx.amount), 0);

        setInflow(inflowAmt);
        setExpense(expenseAmt);

        // Prepare data for daily bar chart
        const daysInMonth = new Date(
          currentYear,
          currentMonth + 1,
          0
        ).getDate();
        const categories = Array.from({ length: daysInMonth }, (_, i) =>
          (i + 1).toString()
        );
        const inflowPerDay = Array(daysInMonth).fill(0);
        const expensePerDay = Array(daysInMonth).fill(0);

        monthlyTxs.forEach((tx) => {
          const txDate = new Date(tx.date);
          const day = txDate.getDate() - 1;
          if (tx.type === "income") inflowPerDay[day] += tx.amount;
          else if (tx.type === "expense") expensePerDay[day] += tx.amount;
        });

        const months = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString("default", { month: "short" })
        );
        const inflowPerMonth = Array(12).fill(0);
        const expensePerMonth = Array(12).fill(0);

        allTxs.forEach((tx: Transaction) => {
          const txDate = new Date(tx.date);
          const month = txDate.getMonth();
          if (tx.type === "income") inflowPerMonth[month] += tx.amount;
          else if (tx.type === "expense") expensePerMonth[month] += tx.amount;
        });

        setMonthlyBarData({
          categories: months,
          inflow: inflowPerMonth,
          expense: expensePerMonth,
        });

        setDailyBarData({
          categories,
          inflow: inflowPerDay,
          expense: expensePerDay,
        });
      } catch (err) {
        console.error("❌ Failed to fetch transactions", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-6 mb-5">
          <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
            <Link href="/">💰MyBudgetory</Link>
          </h1>
        </section>

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-5">
              Expenses
            </h1>
            <Link href="/dashboard">
              <span className="text-2xl font-extrabold tracking-tight text-gray-400 border-b-2">
                Go Back
              </span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8">
          {/* Donut Chart Section */}
          <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 space-y-4">
            <div>
              <Charts
                inflow={inflow}
                expense={expense}
                dailyBarData={dailyBarData}
                monthlyBarData={monthlyBarData}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChartsPage;
