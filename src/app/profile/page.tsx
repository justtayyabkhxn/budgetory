"use client";
import MenuButton from "@/components/Menu";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type User = {
  name: string;
  email: string;
  phone: string;
};

type DecodedToken = {
  email: string;
  // You can add more fields if needed, like name, id, etc.
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");

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

        const { data } = await axios.get("/api/user/profile", {
          params: { email: decoded.email },
        });

        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.post("/api/user/change-password", {
        email,
        oldPassword,
        newPassword,
      });

      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Failed to change password");
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
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Name</label>
            <input
              value={user?.name || ""}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          
        </div>

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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
