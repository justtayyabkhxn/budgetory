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
} from "lucide-react";

const iconColors = [
  "bg-pink-100 dark:bg-pink-500/10",
  "bg-yellow-100 dark:bg-yellow-500/10",
  "bg-green-100 dark:bg-green-500/10",
  "bg-blue-100 dark:bg-blue-500/10",
  "bg-purple-100 dark:bg-purple-500/10",
  "bg-red-100 dark:bg-red-500/10",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-white dark:from-gray-900 dark:via-black dark:to-black text-gray-800 dark:text-gray-200 px-6 py-5 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mt-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Track Budget Efficiently! With{" "}
          <span className="text-green-500 bg-gradient-to-r from-green-400 to-green-500 bg-clip-text ">
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
            className="px-6 py-3 font-bold bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white rounded-lg hover:brightness-110 transition text-lg"
          >
            Start Managing
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 max-w-5xl mx-auto text-center">
        
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text mb-10">
          Why You&apos;ll Love MyBudgetory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: Wallet,
              title: "Track Daily Expenses",
              desc: "Log your income and expenses daily with simple category-based inputs.",
            },
            {
              icon: PieChart,
              title: "Visual Reports",
              desc: "Understand your habits with clear weekly, monthly, and yearly charts.",
            },
            {
              icon: Cloud,
              title: "Cloud Synced",
              desc: "Secure cloud storage lets you access data across devices, any time.",
            },
            {
              icon: CalendarCheck,
              title: "Budget Reminders",
              desc: "Set monthly spending goals and get reminders to stay on track.",
            },
            {
              icon: ShieldCheck,
              title: "100% Private & Secure",
              desc: "Your data is encrypted, never sold, and only yours to control.",
            },
            {
              icon: Smartphone,
              title: "Mobile Friendly",
              desc: "Designed to work perfectly on your phone — track finances on the go!",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-[1.03] duration-300`}
            >
              <div
                className={`${
                  iconColors[i % iconColors.length]
                } w-fit p-3 rounded-full mb-4`}
              >
                <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
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
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
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
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-md hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
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
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
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
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-indigo-400 dark:border-indigo-600"
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
        <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
          Why Choose MyBudgetory?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Unlike other budget apps, we don’t just track numbers — we help you
          build smarter habits, take control of your spending, and feel
          confident about your money.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-gradient-to-tr from-green-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow w-full md:w-1/3">
            <h3 className="text-xl font-semibold text-green-500">
              Built for Simplicity
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              No clutter. No confusing graphs. Just clean budgeting.
            </p>
          </div>
          <div className="bg-gradient-to-tr from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow w-full md:w-1/3">
            <h3 className="text-xl font-semibold text-indigo-500">
              Fast and Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Lightning-fast performance with full data security.
            </p>
          </div>
          <div className="bg-gradient-to-tr from-pink-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow w-full md:w-1/3">
            <h3 className="text-xl font-semibold text-pink-500">
              No Ads. No Noise.
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              100% focus on your financial goals. No distractions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight text-center mb-5">
          Frequently Asked Questions
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
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow cursor-pointer"
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
        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text mb-8">
          Ready to master your finances?
        </h2>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:brightness-110 transition text-lg font-bold"
        >
          Go to Dashboard
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center mt-20 text-sm text-gray-500 font-semibold">
        © 2025 💰MyBudgetory. Built with ❤️ by{" "}
        <a
          href="https://justtayyabkhan.vercel.app"
          target="_blank"
          className="text-orange-400 hover:underline"
        >
          Tayyab Khan
        </a>
      </footer>
    </main>
  );
}
