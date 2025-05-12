"use client";
import Header from "@/components/Header";
import IMG2 from "../../public/img2.png";
import Image from "next/image";
import Piggy from "../../public/piggy.png";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200 px-6 py-5 transition-colors duration-300">
      <Header />
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mt-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Take{" "}
          <span className="text-green-500 ">
            Control !
          </span>
          
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          MyBudgetory helps you track your expenses, analyze spending habits,
          and stay financially organized — all in one place.
        </p>
        <Image
          src={Piggy}
          alt="Money Management"
          className="mx-auto w-full max-w-sm"
         
        />
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              document
                .getElementById("final-cta")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition text-lg cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            title: "Track Daily Expenses",
            desc: "Enter daily spends with categories like food, outing, bills, etc.",
          },
          {
            title: "Visual Reports",
            desc: "See weekly, monthly, and yearly charts to understand your spending habits.",
          },
          {
            title: "Cloud Synced",
            desc: "All your data is saved securely and can be accessed anytime.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>
      <Image
        src={IMG2}
        alt="Money Management"
        width={200} // adjust as needed
        height={200} // maintain aspect ratio
        className="mx-auto rounded-lg mt-5" // optional styling
        placeholder="blur"
      />
      {/* How It Works Section */}
      <section className="mt-20 max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-3xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
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
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-md"
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
        <h2 className="text-3xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
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
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-left"
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
      {/* FAQs */}
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
        <h2 className="text-3xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight mb-8">
          Ready to master your finances?
        </h2>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition text-lg font-bold"
        >
          Start Now – It&apos;s Free
        </a>
      </section>
      {/* Footer */}
      <footer className="text-center mt-20 bottom-4 text-sm text-gray-500 font-semibold">
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
