"use client";
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
  PiggyBank,
  TextSearch,
  Wallet,
  WalletMinimal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MenuButton() {

  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClasses = (path: string) =>
    `text-center cursor-pointer transition-all duration-200 ${
      pathname === path ? "bg-white/10 font-semibold rounded-2xl p-2" : ""
    }`;

  const handleLogout = async () => {
  try {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {
      localStorage.removeItem("token");
      setMenuOpen(false);
      window.location.href = "/login"; // ✅ Redirect to login
    } else {
      console.error("Logout failed:", await res.text());
      window.location.href = "/login";
    }
  } catch (err) {
    console.error("Error logging out:", err);
  }
};


  return (
    <div className="relative z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="group relative inline-flex items-center cursor-pointer justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: menuOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.span>
        <span className="tracking-wide">Menu</span>
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition duration-300" />
      </button>

      {/* Dimmed Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/30 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Glass Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 backdrop-blur-sm bg-white/10 dark:bg-black/20 border-l border-white/20 dark:border-white/10 text-gray-100 dark:text-white shadow-2xl transition-transform duration-300 ease-in-out z-50 rounded-l-3xl ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full px-6 py-8 space-y-6">
          <div className="flex justify-start">
            <button
              onClick={toggleMenu}
              className="text-md text-white font-bold"
            >
              <Menu />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-8 mt-4">
            <Link href="/dashboard" className={`${linkClasses("/dashboard")} flex items-center gap-2`}>
              <FileDigit color="#818cf8" /> Dashboard
            </Link>
            <Link href="/net-worth" className={`${linkClasses("/net-worth")} flex items-center gap-2`}>
              <PiggyBank color="#fcba03" /> Net Worth
            </Link>

            <Link href="/debt-lent" className={`${linkClasses("/debt-lent")} flex items-center gap-2`}>
              <WalletMinimal color="#a78bfa" /> Debt Tracker
            </Link>
            <Link href="/transactions" className={`${linkClasses("/transactions")} flex items-center gap-2`}>
              <BadgeIndianRupee color="#4ade80" /> Transactions
            </Link>
            <Link href="/expenses" className={`${linkClasses("/expenses")} flex items-center gap-2`}>
              <BanknoteArrowDown color="#f87171" /> Expenses
            </Link>
            <Link href="/inflow" className={`${linkClasses("/inflow")} flex items-center gap-2`}>
              <Wallet color="#34d399" /> Income
            </Link>
            <Link href="/charts" className={`${linkClasses("/charts")} flex items-center gap-2`}>
              <ChartCandlestick color="#38bdf8" /> Charts
            </Link>
            <Link href="/stats" className={`${linkClasses("/stats")} flex items-center gap-2`}>
              <ChartNoAxesCombined color="#fbbf24" /> Stats
            </Link>
            <Link href="/advanced-search" className={`${linkClasses("/advanced-search")} flex items-center gap-2`}>
              <TextSearch color="#d946ef" /> Advanced Search
            </Link>
            <Link href="/profile" className={`${linkClasses("/profile")} flex items-center gap-2`}>
              <CircleUserRound color="#60a5fa" /> Profile
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/3 p-3 rounded-3xl hover:underline font-semibold cursor-pointer">
              <LogIn color="#ef4444" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
