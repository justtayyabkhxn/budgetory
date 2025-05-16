"use client";
import MenuButton from "@/components/Menu";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

type User = {
  name: string;
  email: string;
  phone: string;
};

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
  comment: string;
}

type DecodedToken = {
  email: string;
  // You can add more fields if needed, like name, id, etc.
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // ⬅️ Assuming JWT is stored as 'token'
        if (!token) {
          alert("No token found. Please login.");
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);
        setEmail(decoded.email);
        console.log(email);
        const { data } = await axios.get("/api/user/profile", {
          params: { email: decoded.email },
        });

        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile" + err);
      }
    };
    fetchTransactions();
    fetchProfile();
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [txs, setTxs] = useState<Transaction[]>([]);

  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTxs(data.transactions);
      })
      .catch(console.error);
  };

  const handleDownloadData = async () => {
    
      const data=txs;
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "transactions.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
     
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      setMessageType("error");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/update-password", {
        email: user?.email,
        oldPassword,
        newPassword,
      });

      setMessage(data.message || "Password changed successfully!");
      setMessageType("success");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setMessage(error.response?.data?.message || "Failed to change password.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-5 px-4 ">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-4 md:p-10 mt-15">
        <div className="flex justify-end mb-0">
          <MenuButton />
        </div>
        <div className="flex items-center justify-center mb-4">
          <FaUserCircle className="text-6xl text-indigo-600 dark:text-indigo-400" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-center  bg-clip-text bg-gradient-to-r text-white mb-8">
          Your Profile
        </h1>

        {/* User Info Section */}
        <div className="space-y-5 mb-10">
          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Name
            </label>
            <input
              value={user?.name || "User"}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Email
            </label>
            <input
              value={user?.email || "user@gmail.com"}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={handleDownloadData}
          className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 mb-10 cursor-pointer"
        >
          Download Your Data (JSON)
        </button>

        {/* Password Change Section */}
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {message && (
            <p
              className={`text-sm font-medium ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
