'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout'); // Optional: if you have logout logic on server
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.email || 'User'} 👋</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card title="Total Inflow" amount="₹ 15,000" color="text-green-400" />
          <Card title="Total Expenses" amount="₹ 7,200" color="text-red-400" />
          <Card title="Balance" amount="₹ 7,800" color="text-yellow-300" />
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  amount,
  color,
}: {
  title: string;
  amount: string;
  color: string;
}) {
  return (
    <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-base font-medium text-gray-300 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{amount}</p>
    </div>
  );
}
