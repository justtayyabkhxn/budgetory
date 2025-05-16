"use client"
import MenuButton from "@/components/Menu";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const user = {
    name: "Tayyab Khan",
    email: "tayyab@example.com",
    phone: "8279961679",
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    // TODO: Send change password API request
    alert("Password changed successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-5 px-4">
      <div className="max-w-2xl mx-auto bg-gradient-to-br bg-white dark:bg-gray-800 dark:to-gray-950 shadow-2xl rounded-3xl p-4 md:p-10">
        {/* Top-right Menu Button */}
      <div className="flex justify-end mb-0">
        <MenuButton />
      </div>
        <div className="flex items-center justify-center mb-4">
          <FaUserCircle className="text-6xl text-indigo-600 dark:text-indigo-400" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-center bg-gradient-to-r text-white bg-clip-text mb-8">
          Your Profile
        </h1>

        {/* User Info Section */}
        <div className="space-y-5 mb-10">
          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Name</label>
            <input
              value={user.name}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">Phone</label>
            <input
              value={user.phone}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
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
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
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
