import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <Link href="/">
        <span className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight">
        💰 MyBudgetory
        </span>
      </Link>
      <p className="text-lg text-gray-500 dark:text-gray-300 font-bold mt-2">
        💳 Your Budget. 📜 Your Story.
      </p>
    </div>
  );
}
