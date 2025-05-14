"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const AdvancedSearchPage = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTxs, setFilteredTxs] = useState<Transaction[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");


  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.removeItem("token");
    router.push("/login");
  };
  
  const router = useRouter();

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

    if (selectedMonth) {
      txs = txs.filter((tx) => {
        const txDate = new Date(tx.date);
        const monthStr = `${txDate.getFullYear()}-${String(
          txDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return monthStr === selectedMonth;
      });
    }

    if (selectedCategory) {
      txs = txs.filter((tx) => tx.category === selectedCategory);
    }

    if (selectedType) {
      txs = txs.filter((tx) => tx.type === selectedType);
    }

    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      txs = txs.filter(
        (tx) =>
          tx.title.toLowerCase().includes(lowerSearch) ||
          tx.comment.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredTxs(txs);
  }, [selectedMonth, selectedCategory, selectedType, searchText, transactions]);

  const categories = Array.from(new Set(transactions.map((tx) => tx.category)));

  const totalAmount = filteredTxs.reduce((sum, tx) => {
    return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
  }, 0);

  return (
         <div className="min-h-screen bg-gradient-to-br text-white p-4 sm:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto space-y-6 mb-5">
          <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
            <Link href="/">💰MyBudgetory</Link>
          </h1>
        </section>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-5">
          Advanced Search
            </h1>
            <a href="/transactions">
              <span className="text-2xl font-extrabold tracking-tight text-gray-400  border-b-2">
                Go Back
              </span>
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Search Box */}
        <div>
          <label className="text-sm text-gray-300">Search by Title/Comment</label>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-white/10 text-white focus:outline-none focus:bg-gray-800 mb-4"
          />
        </div>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm text-gray-300">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white/10 text-white focus:outline-none focus:bg-gray-800"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white/10 text-white focus:outline-none focus:bg-gray-800"
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
              className="w-full px-3 py-2 rounded-md bg-white/10 text-white focus:outline-none focus:bg-gray-800"
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
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
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg">
          {filteredTxs.length === 0 ? (
            <p className="text-gray-400">No matching transactions.</p>
          ) : (
            <ul className="space-y-4">
              {filteredTxs.map((tx) => (
                <li
                  key={tx._id}
                  className="p-3 bg-white/5 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{tx.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.date).toLocaleDateString()} • {tx.category}
                    </p>
                    <p className="text-sm text-gray-400">{tx.comment}</p>
                  </div>
                  <p
                    className={`font-bold ${
                      tx.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"} ₹ {tx.amount}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
