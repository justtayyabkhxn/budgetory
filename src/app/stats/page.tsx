"use client";
import MenuButton from "@/components/Menu";
import Link from "next/link";
import { useEffect, useState } from "react";

type Txn = {
  _id: string;
  title: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
};

export default function StatsPage() {
  const [txs, setTxs] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [largestExpense, setLargestExpense] = useState(0);
  const [largestExpenseName, setLargestExpenseName] = useState<string>("");
  const [largestIncomeName, setLargestIncomeName] = useState<string>("");
  const [largestIncome, setLargestIncome] = useState(0);
  const [mostFrequentCategory, setMostFrequentCategory] =
    useState<string>("N/A");
  const [top3Days, setTop3Days] = useState<string[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) {
          setTxs(data.transactions);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Helper functions
  const formatMonth = (dateStr: string) =>
    new Date(dateStr).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

  const isCurrentMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const getMostBy = (
    data: Txn[],
    filter: "income" | "expense",
    groupBy: "date" | "month" | "category"
  ) => {
    const grouped: Record<string, number> = {};

    data
      .filter((tx) => tx.type === filter)
      .forEach((tx) => {
        const key =
          groupBy === "date"
            ? new Date(tx.date).toLocaleDateString()
            : groupBy === "month"
            ? formatMonth(tx.date)
            : tx.category;

        grouped[key] = (grouped[key] || 0) + tx.amount;
      });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    return sorted[0] || ["N/A", 0];
  };

  const avgMonthlySpending = () => {
    const monthly: Record<string, number> = {};
    txs.forEach((tx) => {
      if (tx.type === "expense" && isCurrentMonth(tx.date)) {
        const key = formatMonth(tx.date);
        monthly[key] = (monthly[key] || 0) + tx.amount;
      }
    });
    const values = Object.values(monthly);
    return values.length > 0
      ? `₹ ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)}`
      : "N/A";
  };

  const getTopAndLeastCategoryForCurrentMonth = () => {
    const categoryData: Record<string, number> = {};

    txs.forEach((tx) => {
      if (tx.type === "expense" && isCurrentMonth(tx.date)) {
        categoryData[tx.category] =
          (categoryData[tx.category] || 0) + tx.amount;
      }
    });

    const sortedCategories = Object.entries(categoryData).sort(
      (a, b) => b[1] - a[1]
    );
    const topCategory = sortedCategories[0] || ["N/A", 0];
    const leastCategory = sortedCategories[sortedCategories.length - 1] || [
      "N/A",
      0,
    ];

    return [topCategory, leastCategory];
  };

  const calculateStats = () => {
    const totalIncome = txs
      .filter((tx) => tx.type === "income" && isCurrentMonth(tx.date))
      .reduce((acc, tx) => acc + tx.amount, 0);

    const totalExpenses = txs
      .filter((tx) => tx.type === "expense" && isCurrentMonth(tx.date))
      .reduce((acc, tx) => acc + tx.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    const largestExpense = Math.max(
      ...txs
        .filter((tx) => tx.type === "expense" && isCurrentMonth(tx.date))
        .map((tx) => tx.amount)
    );

    const largestExpenseTxn = txs
      .filter((tx) => tx.type === "expense" && isCurrentMonth(tx.date))
      .reduce((max, tx) => (tx.amount > max.amount ? tx : max), txs[0]);
    const largestExpenseNameVar = largestExpense
      ? largestExpenseTxn.title
      : "N/A";

      
      const largestIncome = Math.max(
          ...txs
          .filter((tx) => tx.type === "income" && isCurrentMonth(tx.date))
          .map((tx) => tx.amount)
        );
        const largestIncomeTxn = txs
          .filter((tx) => tx.type === "income" && isCurrentMonth(tx.date))
          .reduce((max, tx) => (tx.amount > max.amount ? tx : max), txs[0]);
        const largestIncomeNameVar = largestIncome
          ? largestIncomeTxn.title
          : "N/A";
        
    const categoryFrequency = txs
      .filter((tx) => isCurrentMonth(tx.date))
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const mostFrequentCategory = Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])
      .shift() || ["N/A", 0];

    const daysSpending = txs
      .filter((tx) => tx.type === "expense" && isCurrentMonth(tx.date))
      .reduce((acc, tx) => {
        const day = new Date(tx.date).toLocaleDateString();
        acc[day] = (acc[day] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    const top3Days =
      Object.entries(daysSpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([day, amt]) => `${day} – ₹ ${amt}`) || [];

    const totalTransactions = txs.filter((tx) =>
      isCurrentMonth(tx.date)
    ).length;

    setLargestIncomeName(largestIncomeNameVar);
    setLargestExpenseName(largestExpenseNameVar);
    setTotalIncome(totalIncome);
    setTotalExpenses(totalExpenses);
    setNetBalance(netBalance);
    setLargestExpense(largestExpense);
    setLargestIncome(largestIncome);
    setMostFrequentCategory(mostFrequentCategory[0]);
    setTop3Days(top3Days);
    setTotalTransactions(totalTransactions);
  };

  useEffect(() => {
    if (!loading) {
      calculateStats();
    }
  }, [txs, loading]);

  const [
    [mostSpentDay, mostSpentAmt],
    [mostInflowDay, mostInflowAmt],
    [maxSpentMonth, maxSpentMonthAmt],
    [maxInflowMonth, maxInflowMonthAmt],
    topCategory,
    leastCategory,
  ] = loading
    ? [
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
        ["", 0],
      ]
    : [
        getMostBy(txs, "expense", "date"),
        getMostBy(txs, "income", "date"),
        getMostBy(txs, "expense", "month"),
        getMostBy(txs, "income", "month"),
        getTopAndLeastCategoryForCurrentMonth()[0],
        getTopAndLeastCategoryForCurrentMonth()[1],
      ];

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-6 mb-5">
        <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
          <Link href="/">💰MyBudgetory</Link>
        </h1>
      </section>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white font-extrabold tracking-tight mb-5">
            User Statistics
          </h1>
          <a href="/dashboard">
            <span className="text-2xl font-extrabold tracking-tight text-gray-400  border-b-2">
              Go Back
            </span>
          </a>
        </div>
        <MenuButton/>
      </div>
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-200">
          <StatCard
            title="🟥 Most Spending Day"
            value={`${mostSpentDay} – ₹ ${mostSpentAmt}`}
          />
          <StatCard
            title="🟩 Most Inflow Day"
            value={`${mostInflowDay} – ₹ ${mostInflowAmt}`}
          />
          <StatCard
            title="📆 Max Expense Month"
            value={`${maxSpentMonth} – ₹ ${maxSpentMonthAmt}`}
          />
          <StatCard
            title="📈 Max Inflow Month"
            value={`${maxInflowMonth} – ₹ ${maxInflowMonthAmt}`}
          />
          <StatCard
            title="💰 Avg Monthly Spending"
            value={avgMonthlySpending()}
          />
          <StatCard
            title="🏆 Top Spending Category (This Month)"
            value={`${topCategory[0]} – ₹ ${topCategory[1]}`}
          />
          <StatCard
            title="🔻 Least Spent Category (This Month)"
            value={`${leastCategory[0]} – ₹ ${leastCategory[1]}`}
          />
          <StatCard
            title="💸 Total Income This Month"
            value={`₹ ${totalIncome}`}
          />
          <StatCard
            title="💳 Total Expenses This Month"
            value={`₹ ${totalExpenses}`}
          />
          <StatCard
            title="⚖️ Net Balance (Income - Expenses)"
            value={`₹ ${netBalance}`}
          />
          <StatCard
            title="💥 Largest Single Expense Transaction"
            value={`₹ ${largestExpense} • ${largestExpenseName}`}
          />
          <StatCard
            title="💰 Largest Single Income Transaction"
            value={`₹ ${largestIncome} • ${largestIncomeName}`}
          />
          <StatCard
            title="📊 Most Frequent Category"
            value={mostFrequentCategory}
          />
          <StatCard
            title="🔝 Top 3 Most Spent Days"
            value={top3Days.map((day, index) => (
              <p key={index}>💠{" "}{day}</p>
            ))}
          />
          <StatCard
            title="🔢 Total Transactions This Month"
            value={totalTransactions.toString()}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 p-5 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-xl font-bold text-blue-300">{value}</div>
    </div>
  );
}
