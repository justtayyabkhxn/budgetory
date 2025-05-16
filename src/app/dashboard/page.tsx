"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddTransactionForm } from "../../components/AddTransactionForm";
import { TxnCard } from "../../components/TxnCard";
import Link from "next/link";
import Menu from "@/components/Menu";
import { FileDigit } from "lucide-react";

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

const financialQuotes = [
  "An investment in knowledge pays the best interest. – Benjamin Franklin",
  "Do not save what is left after spending, but spend what is left after saving. – Warren Buffet",
  "The goal is not to get rich quickly but to get rich slowly. – Unknown",
  "It's not your salary that makes you rich, it's your spending habits. – Charles A. Jaffe",
  "Wealth consists not in having great possessions, but in having few wants. – Epictetus",
  "Beware of little expenses. A small leak will sink a great ship. – Benjamin Franklin",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "Formal education will make you a living; self-education will make you a fortune. – Jim Rohn",
  "A penny saved is a penny earned. – Benjamin Franklin",
  "The rich invest in time, the poor invest in money. – Warren Buffet",
  "The stock market is filled with individuals who know the price of everything, but the value of nothing. – Philip Fisher",
  "Wealth is the ability to fully experience life. – Henry David Thoreau",
  "Never depend on a single income. Make investment to create a second source. – Warren Buffett",
  "Risk comes from not knowing what you’re doing. – Warren Buffett",
  "Do not save what is left after spending, but spend what is left after saving. – Warren Buffet",
  "The key to financial freedom is to earn money while you sleep. – Unknown",
  "The most important investment you can make is in yourself. – Warren Buffet",
  "A budget is telling your money where to go instead of wondering where it went. – Dave Ramsey",
  "The rich invest in time, the poor invest in money. – Warren Buffet",
  "In investing, what is comfortable is rarely profitable. – Robert Arnott",
  "The four most dangerous words in investing are: 'This time it’s different.' – Sir John Templeton",
  "Know what you own, and know why you own it. – Peter Lynch",
  "The best way to predict the future is to create it. – Peter Drucker",
  "Financial freedom is available to those who learn about it and work for it. – Robert Kiyosaki",
  "When you combine ignorance and leverage, you get some pretty interesting results. – Warren Buffett",
  "If you’re not willing to own a stock for 10 years, don’t even think about owning it for 10 minutes. – Warren Buffett",
  "The goal of investing is not to get rich, but to remain rich. – Unknown",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Make your money work for you, don’t work for money. – Unknown",
  "To achieve financial freedom, you must first master self-discipline. – Unknown",
  "It’s not your income that makes you wealthy, it’s your financial discipline. – Unknown",
  "The best investment on earth is earth. – Louis Glickman",
  "If you want to be rich, don’t allow your expenses to exceed your income. – Unknown",
  "Money is a terrible master but an excellent servant. – P.T. Barnum",
  "The rich are those who know how to control money, rather than letting money control them. – Unknown",
  "Don't just make money, make a difference. – Unknown",
  "The greatest wealth is to live content with little. – Plato",
  "The secret to wealth is simple: Spend less than you earn and invest the difference. – Unknown",
  "The key to wealth is not just working hard but working smart with your money. – Unknown",
  "Financial success is not about how much money you make, but how much you keep. – Unknown",
  "To be successful with money, you have to understand how it works. – Unknown",
  "You can't have a million-dollar dream with a minimum-wage work ethic. – Unknown",
  "It’s not about how much money you make, it’s about how much you keep. – Unknown",
  "Wealth consists not in having great possessions, but in having few wants. – Epictetus",
  "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas. – Paul Samuelson",
  "The goal of investing is not to get rich quickly, but to get rich slowly. – Unknown",
  "The more you learn, the more you earn. – Warren Buffett",
  "Do not wait to buy real estate. Buy real estate and wait. – T. Harv Eker",
  "The stock market is a device for transferring money from the impatient to the patient. – Warren Buffett",
  "Never let a lack of money stop you from pursuing your dreams. – Unknown",
  "Financial independence is not a dream, it’s a goal. – Unknown",
  "Being rich is having money; being wealthy is having time. – Margaret Bonnano",
  "Money grows on the tree of persistence. – Japanese Proverb",
  "Opportunities are never lost; someone will take the one you miss. – Andy Rooney",
  "Money is not the only thing that counts, but it sure counts for a lot. – Unknown",
  "In investing, there’s no such thing as a free lunch. – Unknown",
  "The more you give, the more you will receive. – Unknown",
  "A good reputation is more valuable than money. – Publilius Syrus",
  "If you want to be rich, think of how you can help others. – Unknown",
  "It’s easier to feel a sense of accomplishment with your finances when you are living below your means. – Unknown",
  "The first rule of wealth is to spend less than you earn. – Unknown",
  "The best way to predict the future is to create it. – Peter Drucker",
  "Being rich is not about how much money you have, but how much you can do with it. – Unknown",
  "Your wealth can be stolen, but the knowledge you have can never be taken from you. – Unknown",
  "The rich don't work for money. They make money work for them. – Robert Kiyosaki",
  "Successful people don’t make excuses, they make things happen. – Unknown",
  "Never spend your money before you have it. – Thomas Jefferson",
  "A man is rich in proportion to the number of things he can afford to let go of. – Henry David Thoreau",
  "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to foresight, and so broadens the mind. – T.T. Munger",
  "If you do not learn to master your emotions, you will never become a successful investor. – Unknown",
  "Wealth is the ability to fully experience life. – Henry David Thoreau",
  "The best investment you can make is in yourself. – Warren Buffett",
  "Time is money, and it's important to understand the value of both. – Unknown",
  "Your wealth can be stolen, but the knowledge you have can never be taken from you. – Unknown",
  "The best way to get rich is to invest in things that appreciate. – Unknown",
  "The best way to predict the future is to invent it. – Alan Kay",
  "A goal without a plan is just a wish. – Antoine de Saint-Exupery",
  "Be fearful when others are greedy, and greedy when others are fearful. – Warren Buffett",
  "The real measure of your wealth is how much you’d be worth if you lost all your money. – Unknown",
  "Your savings account is a key to unlocking your financial future. – Unknown",
  "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
  "In the business world, the rearview mirror is always clearer than the windshield. – Warren Buffett",
  "What you lack in talent can be made up with desire, hustle, and giving 110% all the time. – Don Zimmer",
  "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
  "The secret to getting ahead is getting started. – Mark Twain",
  "Money doesn’t change people, it reveals them. – Unknown",
  "The art is not in making money, but in keeping it. – Unknown",
  "To be rich, you must know how to control your spending habits. – Unknown",
  "The best investment you can make is in yourself. – Warren Buffett",
  "The greatest glory in living lies not in never falling, but in rising every time we fall. – Nelson Mandela",
  "Financial freedom is not about how much you make, it’s about how much you keep. – Unknown",
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [inflow, setInflow] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [net, setNet] = useState<number>(0);
  const [today, setToday] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [quote, setQuote] = useState<string>("");

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

  // Fetch random quote of the day
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * financialQuotes.length);
    setQuote(financialQuotes[randomIndex]);
  }, []);

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
        return tx.type === "expense" && txDate.getDate() === now.getDate();
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
            <h1 className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
              <Link href="/">💰MyBudgetory</Link>
            </h1>
          </section>

          {/* Quote of the Day */}
          <section className="text-center rounded-xl p-6 shadow-lg mb-2">
            <h2 className="text-xl font-semibold mb-2">Quote of the Day</h2>
            <p className="text-gray-400 italic">“{quote}”</p>
          </section>

          {/* Dashboard and Transactions */}
          <div className="mb-10 flex items-center justify-between">
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
          <div className="text-2xl font-extrabold tracking-tight mb-5">
            Today :{" "}
            <span className={`text-gray-300 ${loading ? "animate-pulse" : ""}`}>
              {loading ? "Loading..." : `₹ ${today}.00`}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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

            <Link href="/expenses">
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

            <TxnCard
              title={`Net (${new Date().toLocaleString("default", {
                month: "long",
              })})`}
              amount={loading ? "Loading..." : `₹ ${net.toLocaleString()}.00`}
              color="text-gray-300"
            />
          </div>

          {/* Add Transaction Form (kept above recent list) */}
          <AddTransactionForm onAdd={fetchTransactions} />

          {/* Recent Transactions */}
          <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

            {loading ? (
              <p className="text-gray-400 animate-pulse">
                Loading transactions...
              </p>
            ) : txs.length === 0 ? (
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

            {!loading && (
              <div className="font-bold text-blue-400 mt-1 text-right">
                <Link href="/transactions">See All Transactions</Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-evenly mt-6">
          <Link
            href="/charts"
            className="px-5 py-3 text-shadow-lg/10  bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition text-lg font-bold"
          >
            View Charts
          </Link>
          <Link
            href="/stats"
            className="px-5 py-3 text-shadow-lg/10  bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition text-lg font-bold"
          >
            View Stats
          </Link>
        </div>
      </div>
    </div>
  );
}
