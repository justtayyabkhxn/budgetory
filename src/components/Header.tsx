import Link from "next/link";

export default function Header() {
  return (
    <div>
      <span className="text-4xl">💰</span>
      <Link href="/">
      <span className="text-4xl md:text-5xl text-indigo-600 dark:text-indigo-400 font-extrabold tracking-tight border-b-4">
        MyBudgetory
      </span>
      </Link>
      <p className=" text-lg text-gray-300 font-bold mt-5">
        💳 Your Budget.📜 Your Story.
      </p>
    </div>
  );
}
