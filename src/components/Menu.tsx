import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  BanknoteArrowDown,
  ChartCandlestick,
  ChartNoAxesCombined,
  CircleUserRound,
  FileDigit,
  LogIn,
  Menu,
  SquareChevronRight,
  TextSearch,
  Wallet,
  WalletMinimal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import router from "next/router";
import React, { useState } from "react";

export default function MenuButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const pathname = usePathname();

  const linkClasses = (path) =>
    `text-left cursor-pointer hover:underline ${
      pathname === path ? "text-green-400 font-semibold" : ""
    }`;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("token");
        setMenuOpen(false);
        router.push("/login");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="relative z-50">
      {/* Menu Toggle Button */}

      <button
        onClick={toggleMenu}
        className="group relative inline-flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none cursor-pointer"
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: menuOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.span>

        <span className="tracking-wide">
          {menuOpen ? "Menu" : "Menu"}
        </span>

        {/* Glowing ring effect on hover */}
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition duration-300" />
      </button>

      {/* Overlay (optional, for dimming background) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-10  mb-5">
          <div className="flex justify-between items-center border-b mb-5">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <SquareChevronRight />
              Menu
            </h2>
            <button
              onClick={toggleMenu}
              className="text-md text-gray-500 hover:text-gray-300 cursor-pointer font-extrabold"
            >
              X
            </button>
          </div>
          <Link
            href="/dashboard"
            className={`${linkClasses("/dashboard")} flex items-center gap-2`}
          >
            <FileDigit />
            Dashboard
          </Link>
          <Link
            href="/debt-lent"
            className={`${linkClasses("/debt-lent")} flex items-center gap-2`}
          >
            <WalletMinimal />
            Debt Tracker
          </Link>

          <Link
            href="/transactions"
            className={`${linkClasses(
              "/transactions"
            )} flex items-center gap-2 `}
          >
            <BadgeIndianRupee />
            Transactions
          </Link>
          <Link
            href="/expenses"
            className={`${linkClasses("/expenses")} flex items-center gap-2 `}
          >
            <BanknoteArrowDown />
            Expenses
          </Link>
          <Link
            href="/inflow"
            className={`${linkClasses("/inflow")} flex items-center gap-2 `}
          >
            <Wallet /> Income
          </Link>

          <Link
            href="/charts"
            className={`${linkClasses("/charts")} flex items-center gap-2 `}
          >
            <ChartCandlestick />
            Charts
          </Link>
          <Link
            href="/stats"
            className={`${linkClasses("/stats")} flex items-center gap-2 `}
          >
            <ChartNoAxesCombined />
            Stats
          </Link>
          <Link
            href="/advanced-search"
            className={`${linkClasses(
              "/advanced-search"
            )} flex items-center gap-2 `}
          >
            <TextSearch />
            Advanced Search
          </Link>
          <Link
            href="/profile"
            className={`${linkClasses("/profile")} flex items-center gap-2 `}
          >
            <CircleUserRound />
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="text-left text-red-500 hover:underline font-semibold mt-auto cursor-pointer"
          >
            <a
              href="/login"
              className="flex items-center gap-2 hover:underline text-red-500"
            >
              <LogIn />
              Logout
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}
