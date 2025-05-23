"use client";
import Header from "@/components/Header";
import Image from "next/image";
import EventHero from "../../../public/event-hero.png";
import BudgetIcon from "../../../public/event-hero.png";

import {
  CalendarDays,
  DollarSign,
  Users,
  ClipboardCheck,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const iconColors = [
  "bg-orange-100 dark:bg-orange-500/10",
  "bg-teal-100 dark:bg-teal-500/10",
  "bg-blue-100 dark:bg-blue-500/10",
  "bg-purple-100 dark:bg-purple-500/10",
  "bg-pink-100 dark:bg-pink-500/10",
  "bg-yellow-100 dark:bg-yellow-500/10",
];

export default function EventBudgetingLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white dark:from-gray-900 dark:via-black dark:to-black text-gray-800 dark:text-gray-200 px-6 py-5 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mt-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Plan Events Smarter! With{" "}
          <span className="text-orange-500 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text ">
            MyBudgetory
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Our Event Budgeting Tool helps you manage event costs, collaborate
          with your team, and stay on top of every detail.
        </p>
        <Image
          src={EventHero}
          alt="Event Planning"
          className="mx-auto h-64 w-64 drop-shadow-l"
        />
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() =>
              document
                .getElementById("bottom")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-orange-900 rounded-lg hover:brightness-110 transition text-lg"
          >
            Start Planning
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 max-w-5xl mx-auto text-center">
        <hr className=" text-orange-400 mb-5"></hr>
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text mb-10">
          Why Use Our Tool?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              icon: CalendarDays,
              title: "Event Timeline",
              desc: "Manage your event schedule and important deadlines effortlessly.",
            },
            {
              icon: DollarSign,
              title: "Budget Tracking",
              desc: "Track every expense and stay within budget with ease.",
            },
            {
              icon: Users,
              title: "Team Collaboration",
              desc: "Invite team members and assign roles for seamless coordination.",
            },
            {
              icon: ClipboardCheck,
              title: "Task Management",
              desc: "Organize tasks, set priorities, and get notified of pending actions.",
            },
            {
              icon: ShieldCheck,
              title: "Data Security",
              desc: "Your event data is encrypted and completely secure.",
            },
            {
              icon: Smartphone,
              title: "Mobile Ready",
              desc: "Plan on-the-go with our responsive mobile-first design.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-[1.03] duration-300"
            >
              <div
                className={`${
                  iconColors[i % iconColors.length]
                } w-fit p-3 rounded-full mb-4`}
              >
                <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-20 max-w-4xl mx-auto text-center space-y-10">
        <hr className=" text-orange-400 mb-5"></hr>

        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text">
          How It Works?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              step: "1. Set Budget",
              detail:
                "Define your event’s overall budget and allocate to categories.",
            },
            {
              step: "2. Track Spending",
              detail:
                "Log actual costs and get instant feedback on over/under spending.",
            },
            {
              step: "3. Share & Collaborate",
              detail:
                "Invite your team to view, edit, and manage event plans together.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-md hover:bg-orange-50 dark:hover:bg-gray-700 transition"
            >
              <h4 className="text-lg font-semibold text-orange-500">
                {item.step}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 max-w-4xl mx-auto text-center space-y-10">
        <hr className=" text-orange-400 mb-5"></hr>

        <h2 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text mb-8">
          Ready to host your best event?
        </h2>
        <a
          id="bottom"
          href="/event-dashboard"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:brightness-110 transition text-lg font-bold"
        >
          Go to Dashboard
        </a>
      </section>

      <footer className="text-center text-sm text-gray-400 dark:text-gray-600 mt-20">
        © {new Date().getFullYear()} EventBudget. All rights reserved.
      </footer>

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
