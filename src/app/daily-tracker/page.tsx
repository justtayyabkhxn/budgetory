"use client";
import Header from "@/components/Header";
import IMG2 from "../../../public/img2.png";
import Piggy from "../../../public/img3.png";
import Image from "next/image";

import {
  PieChart,
  Cloud,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  Smartphone,
  Lock,
  EyeOff,
  Zap,
  BadgeCheck,
  VolumeOff,
  Shield,
} from "lucide-react";
import Footer from "@/components/Footer";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-white dark:from-gray-900 dark:via-black dark:to-black text-gray-800 dark:text-gray-200 px-6 py-5 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mt-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Track Budget Efficiently! With{" "}
          <span className="text-green-300 bg-gradient-to-r from-green-300 to-green-300 bg-clip-text ">
            MyBudgetory
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          MyBudgetory helps you track your expenses, analyze spending habits,
          and stay financially organized — all in one place.
        </p>
        <Image
          src={Piggy}
          alt="Money Management"
          className="mx-auto h-64 w-64 drop-shadow-lg"
        />
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() =>
              document
                .getElementById("final-cta")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="relative inline-flex items-center justify-center px-7 py-3 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <span className="relative z-10">Start Managing</span>
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 opacity-30 blur-sm"></span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl text-transparent font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text mb-10">
          Why You&apos;ll Love MyBudgetory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: Wallet,
              title: "Track Daily Expenses",
              desc: "Log your income and expenses daily with simple category-based inputs.",
              color: "text-green-600",
            },
            {
              icon: PieChart,
              title: "Visual Reports",
              desc: "Understand your habits with clear weekly, monthly, and yearly charts.",
              color: "text-purple-600",
            },
            {
              icon: Cloud,
              title: "Cloud Synced",
              desc: "Secure cloud storage lets you access data across devices, any time.",
              color: "text-blue-600",
            },
            {
              icon: CalendarCheck,
              title: "Budget Reminders",
              desc: "Set monthly spending goals and get reminders to stay on track.",
              color: "text-pink-600",
            },
            {
              icon: ShieldCheck,
              title: "100% Private & Secure",
              desc: "Your data is encrypted, never sold, and only yours to control.",
              color: "text-yellow-600",
            },
            {
              icon: Smartphone,
              title: "Mobile Friendly",
              desc: "Designed to work perfectly on your phone — track finances on the go!",
              color: "text-indigo-600",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-[1.03] duration-300"
            >
              <h3
                className={`text-md font-semibold flex items-center gap-2 ${feature.color}`}
              >
                <feature.icon className="h-5 w-5" />
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Image
        src={IMG2}
        alt="Money Management"
        width={200}
        height={200}
        className="mx-auto rounded-lg mt-5 shadow-lg"
        placeholder="blur"
      />

      {/* How It Works Section */}
      <section className="mt-20 max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
          How It Works?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              step: "1. Add Transactions",
              detail:
                "Manually input or upload your daily expenses and incomes.",
            },
            {
              step: "2. Categorize",
              detail:
                "Organize entries into categories like food, travel, rent, etc.",
            },
            {
              step: "3. Analyze",
              detail:
                "Visualize your spending patterns and plan your budget wisely.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow hover:shadow-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
            >
              <h4 className="text-lg font-semibold text-indigo-500">
                {item.step}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-20 max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
          What Users Say?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Ayesha R.",
              feedback:
                "MyBudgetory has changed how I manage money. I love the clean interface!",
            },
            {
              name: "Rahul M.",
              feedback:
                "Finally found an app that makes expense tracking actually fun and useful.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border-l-4 border-indigo-400 dark:border-indigo-600"
            >
              <p className="text-gray-700 dark:text-gray-300 italic">
                “{t.feedback}”
              </p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-semibold">
                — {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Unique Selling Points */}
      <section className="mt-24 max-w-5xl mx-auto text-center space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
          Why Choose MyBudgetory?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Unlike other budget apps, we don’t just track numbers — we help you
          build smarter habits, take control of your spending, and feel
          confident about your money.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8 text-left">
          {/* Simplicity */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition space-y-1">
            <h3 className="text-md font-semibold text-green-500 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              Built for Simplicity
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No clutter. No confusing graphs. Just clean budgeting.
            </p>
          </div>

          {/* Fast and Secure */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition space-y-1">
            <h3 className="text-md font-semibold text-indigo-500 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fast and Secure
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Lightning-fast performance with full data security.
            </p>
          </div>

          {/* No Ads */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition space-y-1">
            <h3 className="text-md font-semibold text-pink-500 flex items-center gap-2">
              <VolumeOff className="h-5 w-5" />
              No Ads. No Noise.
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              100% focus on your financial goals. No distractions.
            </p>
          </div>

          {/* Encrypted Transactions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition space-y-1">
            <h3 className="text-md font-semibold text-yellow-500 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Encrypted Transactions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Every transaction is securely encrypted end-to-end.
            </p>
          </div>

          {/* Full Privacy */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition space-y-1">
            <h3 className="text-md font-semibold text-purple-500 flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Full Privacy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your data is private and never shared or sold.
            </p>
          </div>

          {/* Advanced AES Encryption */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:shadow-lg transition space-y-1">
            <h3 className="text-md font-semibold text-blue-500 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              AES-256 Encryption
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Military-grade AES-256 encryption secures all your sensitive data.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text mb-5 text-center">
          FAQs
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Is MyBudgetory free to use?",
              a: "Yes, it’s completely free. You can start tracking your expenses right away.",
            },
            {
              q: "Is my data safe?",
              a: "Absolutely. We use encrypted storage and don’t share your data with anyone.",
            },
            {
              q: "Can I access it from multiple devices?",
              a: "Yes. Your data is synced across devices as long as you're logged in.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow cursor-pointer"
            >
              <summary className="font-semibold text-indigo-600 dark:text-indigo-400">
                {item.q}
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 text-center" id="final-cta">
        <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center mb-6">
          Ready to master your finances?
        </h2>
        <a
          href="/dashboard"
          className="relative inline-flex items-center justify-center px-7 py-3 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          Go to Dashboard
        </a>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
