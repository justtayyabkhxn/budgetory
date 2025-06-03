"use client";
import MenuButton from "@/components/Menu";
import { useEffect, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  BarChart3,
  Wallet,
  Banknote,
  PieChart,
  Hash,
  ListOrdered,
  BadgePercent,
  Calendar,
  ChartNoAxesCombined,
  CreditCard,
  Equal,
  ShoppingCart,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
    const largestIncomeNameVar = largestIncome ? largestIncomeTxn.title : "N/A";

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
      <Header/>
      <div>
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2  text-white">
            <ChartNoAxesCombined />
            <h1 className="text-4xl font-extrabold tracking-tight mb-0">
              User Statistics
            </h1>
          </div>
          <MenuButton />
        </div>
      </div>
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-200">
          <StatCard
            title={
              <>
                <TrendingDown className="w-5 h-5 text-pink-400 group-hover:rotate-[-8deg] transition-transform" />
                <span>Most Spending Day</span>
              </>
            }
            value={`${mostSpentDay} – ₹ ${mostSpentAmt}`}
          />
          <StatCard
            title={
              <>
                <TrendingUp className="w-5 h-5 text-green-400 group-hover:rotate-[-8deg] transition-transform" />
                <span>Most Inflow Day</span>
              </>
            }
            value={`${mostInflowDay} – ₹ ${mostInflowAmt}`}
          />
          <StatCard
            title={
              <>
                <Calendar className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span>Max Expense Month</span>
              </>
            }
            value={`${maxSpentMonth} – ₹ ${maxSpentMonthAmt}`}
          />
          <StatCard
            title={
              <>
                <Calendar className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Max Inflow Month</span>
              </>
            }
            value={`${maxInflowMonth} – ₹ ${maxInflowMonthAmt}`}
          />
          <StatCard
            title={
              <>
                <BarChart3 className="w-5 h-5 text-blue-300 group-hover:rotate-[6deg] transition-transform" />
                <span>Avg Monthly Spending</span>
              </>
            }
            value={avgMonthlySpending()}
          />
          <StatCard
            title={
              <>
                <Wallet className="w-5 h-5 text-purple-400 group-hover:rotate-[8deg] transition-transform" />
                <span>Top Spending Category</span>
              </>
            }
            value={`${topCategory[0]} – ₹ ${topCategory[1]}`}
          />
          <StatCard
            title={
              <>
                <BadgePercent className="w-5 h-5 text-pink-300 group-hover:rotate-[8deg] transition-transform" />
                <span>Least Spent Category</span>
              </>
            }
            value={`${leastCategory[0]} – ₹ ${leastCategory[1]}`}
          />
          <StatCard
            title={
              <>
                <Banknote className="w-5 h-5 text-green-300 group-hover:-translate-y-1 transition-transform" />
                <span>Total Income This Month</span>
              </>
            }
            value={`₹ ${totalIncome}`}
          />
          <StatCard
            title={
              <>
                <CreditCard className="w-5 h-5 text-rose-400 group-hover:-translate-y-1 transition-transform" />
                <span>Total Expenses This Month</span>
              </>
            }
            value={`₹ ${totalExpenses}`}
          />
          <StatCard
            title={
              <>
                <Equal className="w-5 h-5 text-cyan-300 group-hover:rotate-[4deg] transition-transform" />
                <span>Net Balance</span>
              </>
            }
            value={`₹ ${netBalance}`}
          />
          <StatCard
            title={
              <>
                <ShoppingCart className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                <span>Largest Expense</span>
              </>
            }
            value={`₹ ${largestExpense} • ${largestExpenseName}`}
          />
          <StatCard
            title={
              <>
                <Banknote className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                <span>Largest Income</span>
              </>
            }
            value={`₹ ${largestIncome} • ${largestIncomeName}`}
          />
          <StatCard
            title={
              <>
                <PieChart className="w-5 h-5 text-indigo-400 group-hover:rotate-[6deg] transition-transform" />
                <span>Most Frequent Category</span>
              </>
            }
            value={mostFrequentCategory}
          />
          <StatCard
            title={
              <>
                <ListOrdered className="w-5 h-5 text-orange-300 group-hover:scale-110 transition-transform" />
                <span>Top 3 Most Spent Days</span>
              </>
            }
            value={top3Days.map((day, index) => (
              <p key={index}>💠 {day}</p>
            ))}
          />
          <StatCard
            title={
              <>
                <Hash className="w-5 h-5 text-blue-400 group-hover:rotate-[6deg] transition-transform" />
                <span>Total Transactions</span>
              </>
            }
            value={totalTransactions.toString()}
          />
        </div>
      )}
      <Footer/>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div
      className="bg-gradient-to-br from-[#1c1c2c] via-[#111827]/70 to-[#1a1a2e]/80 
                    border border-gray-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl
                    transition-shadow duration-300 group hover:scale-[1.02]"
    >
      <h3 className="text-base font-semibold text-gray-300 mb-1 flex items-center gap-2">
        {title}
      </h3>
      <div className="text-xl font-extrabold text-blue-300 group-hover:text-blue-400 transition duration-200">
        {value}
      </div>
    </div>
  );
}
