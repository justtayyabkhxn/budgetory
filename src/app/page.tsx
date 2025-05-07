import Header from "@/components/Header";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200 px-6 py-12 transition-colors duration-300">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mx-auto space-y-6">
       <Header/>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/dashboard"
            className="px-4 py-3 text-shadow-lg/10 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition text-lg"
          >
            Get Started
          </a>
          {/* <a
            href="/login"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition text-lg"
          >
            Login
          </a> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-15 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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

      {/* Footer */}
      <footer className="text-center mt-10 bottom-4 text-sm text-gray-500 font-semibold">
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
