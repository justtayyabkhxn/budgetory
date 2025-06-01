import { useState, useEffect } from "react";
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
    paymentMode: "Cash", // 👈 new field
  });

  interface Transaction {
    _id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    date: string;
    comment: string;
    paymentMode: string; // 👈 added
  }

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
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
    const { name, value } = e.target;

    // Prevent category change if type is income
    if (form.type === "income" && name === "category") return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto-set category to "Other" when type is income
  useEffect(() => {
    if (form.type === "income") {
      setForm((prev) => ({ ...prev, category: "Other" }));
    }
  }, [form.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

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
        paymentMode: "Cash",
      });
      onAdd();

      const updated = await fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      if (updated.transactions) setTxs(updated.transactions);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="mb-10 bg-[#111]/80 border border-gray-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
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
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 rounded bg-black border border-gray-700 text-white"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          name="paymentMode"
          value={form.paymentMode}
          onChange={handleChange}
          required
          className="p-2 rounded bg-black border border-gray-700 text-white"
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
        </select>

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
            disabled={form.type === "income"} // Disable if income
            className={`p-2 rounded bg-black border border-gray-700 text-white flex-1 ${
              form.type === "income" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

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
          className="p-2 rounded bg-black border border-gray-700 text-white resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className={`sm:col-span-2 mt-2 ${
            loading ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"
          } text-white py-2 px-4 rounded cursor-pointer font-bold`}
        >
          {loading ? "Adding Transaction..." : "Add Transaction"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-2">{error}</p>}
      {success && <p className="text-green-400 mt-2">{success}</p>}

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
                    <strong>{tx.title}</strong> - ₹{tx.amount} ({tx.type},{" "}
                    {tx.paymentMode}) on{" "}
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
