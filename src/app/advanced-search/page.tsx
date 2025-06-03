"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Menu from "@/components/Menu";

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
  TextSearch,
  ArrowUp,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";

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

const AdvancedSearchPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTxs, setFilteredTxs] = useState<Transaction[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const router = useRouter();

  const exportToCSV = () => {
    if (!filteredTxs.length) return;

    const headers = ["Title", "Comment", "Amount", "Date", "Category", "Type"];
    const rows = filteredTxs.map((tx) => [
      tx.title,
      tx.comment,
      tx.amount,
      new Date(tx.date).toLocaleDateString(),
      tx.category,
      tx.type,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mybudgetory_filtered_transactions.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTransactions(data.transactions);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    let txs = [...transactions];

    // Month filter
    if (selectedMonth) {
      txs = txs.filter((tx) => {
        const txDate = new Date(tx.date);
        const monthStr = `${txDate.getFullYear()}-${String(
          txDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthStr === selectedMonth;
      });
    }

    // Date range filter
    if (fromDate) {
      txs = txs.filter((tx) => new Date(tx.date) >= new Date(fromDate));
    }
    if (toDate) {
      txs = txs.filter((tx) => new Date(tx.date) <= new Date(toDate));
    }

    // Category filter
    if (selectedCategory) {
      txs = txs.filter((tx) => tx.category === selectedCategory);
    }

    // Type filter
    if (selectedType) {
      txs = txs.filter((tx) => tx.type === selectedType);
    }

    // Text search
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      txs = txs.filter(
        (tx) =>
          tx.title.toLowerCase().includes(lowerSearch) ||
          tx.comment.toLowerCase().includes(lowerSearch)
      );
    }

    // Sorting
    switch (sortBy) {
      case "amount-asc":
        txs.sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        txs.sort((a, b) => b.amount - a.amount);
        break;
      case "date-asc":
        txs.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "date-desc":
      default:
        txs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }

    setFilteredTxs(txs);
  }, [
    selectedMonth,
    selectedCategory,
    selectedType,
    searchText,
    fromDate,
    toDate,
    sortBy,
    transactions,
  ]);

  const categories = Array.from(new Set(transactions.map((tx) => tx.category)));

  const totalAmount = filteredTxs.reduce((sum, tx) => {
    return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br text-white p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <Header/>
      <div>
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <TextSearch />
            <h1 className="text-3xl font-extrabold tracking-tight mb-0">
              Advanced Search
            </h1>
          </div>
          <Menu />
        </div>
      </div>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Section: Search & Filters */}
        <div className="space-y-4 bg-black/20 backdrop-blur-sm border border-gray-900 rounded-xl p-4 shadow-inner">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5 text-white" />
            Search & Filters
          </h2>

          {/* Search Box */}
          <div>
            <label className="text-sm text-gray-300">
              Search by Title/Comment
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-sm text-gray-300">Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
              >
                <option value="">All</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:bg-gray-800"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Export + Clear Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white text-sm rounded-md transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                setSelectedMonth("");
                setFromDate("");
                setToDate("");
                setSelectedCategory("");
                setSelectedType("");
                setSearchText("");
                setSortBy("date-desc");
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 cursor-pointer text-white text-sm rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Total Amount */}
        <div className="text-lg font-bold text-white/90">
          Total:{" "}
          <span
            className={totalAmount >= 0 ? "text-green-400" : "text-red-400"}
          >
            ₹ {totalAmount}
          </span>
        </div>

        {/* Filtered Results */}

        <div className="bg-black/20 backdrop-blur-sm border border-gray-900 rounded-xl p-5 shadow-lg">
          {filteredTxs.length === 0 ? (
            <p className="text-gray-400">No matching transactions.</p>
          ) : (
            <ul className="space-y-3">
              {filteredTxs.map((tx) => {
                const Icon =
                  categoryIcons[tx.category as keyof typeof categoryIcons] ||
                  BanknoteArrowUp;

                return (
                  <Link
                    href={`/transactions/${tx._id}`}
                    key={tx._id}
                    className="block"
                  >
                    <li className="p-3 bg-white/4 hover:bg-white/10 rounded-lg flex items-center gap-5 transition-all duration-300 cursor-pointer">
                      <div className="bg-white/6 p-2 rounded-full">
                        <Icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{tx.title}</h3>
                        <p className="text-sm text-gray-400">{tx.comment}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.date).toLocaleDateString()} •{" "}
                          {tx.category} • {tx.type}
                        </p>
                      </div>
                      <div
                        className={`font-bold ${
                          tx.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        ₹ {tx.amount}
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full shadow-md backdrop-blur-sm transition-all"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AdvancedSearchPage;
