import { useState } from "react";
import {
  Utensils,
  Shirt,
  Briefcase,
  HeartPulse,
  ReceiptText,
  Clapperboard,
  Plane,
  BanknoteArrowUp,
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

export function AddTransactionForm({ onAdd }: { onAdd: () => void }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "income",
    date: "",
    comment: "",
  });

  interface Transaction {
    _id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
    comment: string;
  }

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [txs, setTxs] = useState<Transaction[]>([]);

  const categories = [
    "Food",
    "Outing",
    "Clothes",
    "Travel",
    "Medical",
    "Entertainment",
    "Bills",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) return setError("You must be logged in");

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("Transaction added!");
      setForm({
        title: "",
        amount: "",
        category: "Food",
        type: "income",
        date: "",
        comment: "",
      });
      onAdd();
      // refresh list
      const updated = await fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      if (updated.transactions) setTxs(updated.transactions);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="mb-10 bg-[#111]/80 border border-gray-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="p-2 rounded bg-black border border-gray-700 text-white"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="p-2 rounded bg-black border border-gray-700 text-white"
        />
        <div className="flex items-center gap-2">
          {(() => {
            const Icon = categoryIcons[form.category] || BanknoteArrowUp;
            return <Icon className="w-5 h-5 text-gray-400" />;
          })()}

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="p-2 rounded bg-black border border-gray-700 text-white flex-1"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 rounded bg-black border border-gray-700 text-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          required
          className="p-2 rounded bg-black border border-gray-700 text-white w-87 sm:w-full md:w-80 lg:w-94 xl:w-120"
        />

        <input
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={handleChange}
          className=" p-2 rounded bg-black border border-gray-700 text-white resize-none"
        />

        <button
          type="submit"
          className="sm:col-span-2 mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer font-bold"
        >
          Add Transaction
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {success && <p className="text-green-400 mt-2">{success}</p>}

      {/* Optional: Preview recent transactions */}
      {txs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Most recent transaction
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {[...txs].slice(0, 1).map((tx, index) => {
              const Icon = categoryIcons[tx.category] || BanknoteArrowUp;
              return (
                <li
                  key={index}
                  className="border-b border-gray-600 pb-1 flex items-start gap-2"
                >
                  <Icon className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <strong>{tx.title}</strong> - ₹{tx.amount} ({tx.type}) on{" "}
                    {new Date(tx.date).toLocaleDateString()}
                    {tx.comment && (
                      <p className="text-gray-400 italic mt-1">{tx.comment}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
