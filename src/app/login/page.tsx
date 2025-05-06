// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem('token', data.token); // Store token
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      {/* Header */}
      <Link href="/" className="mb-10 text-center hover:opacity-80 transition">
        <div className="inline-flex items-center ">
          <span className="text-4xl">💰</span>
          <span className="text-4xl text-indigo-400 font-extrabold tracking-tight">💰MyBudgetory</span>
        </div>
        <p className="mt-2 text-lg text-gray-300 font-bold">
        💳 Your Budget.📜 Your Story.
        </p>
      </Link>

      {/* Login Card */}
      <div className="text-center w-full max-w-md bg-[#111111]/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold inline-block">
          Welcome Back
        </h1>
        <p className="mt-3 text-gray-300">
          Log in to continue your journey!
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-normal"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-800 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-normal"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-2 rounded font-semibold text-white cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm font-bold">
        Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>

        </p>
      </div>
    </div>
  );
}
