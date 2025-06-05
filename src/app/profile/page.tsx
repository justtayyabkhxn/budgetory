"use client";
import MenuButton from "@/components/Menu";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { Upload } from "lucide-react";

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
  comment?: string;
}

type DecodedToken = {
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const [importMessageType, setImportMessageType] = useState<
    "success" | "error" | ""
  >("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleDeleteAllTransactions = async () => {
    if (deleteInput !== "delete") {
      setDeleteMessage("You must type 'delete' to confirm.");
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete transactions.");
        return;
      }

      const res = await axios.delete("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setDeleteMessage("✅ All transactions have been deleted.");
        setDeleteInput("");
        setShowDeleteConfirm(false);
        fetchTransactions();
      } else {
        setDeleteMessage("❌ Failed to delete transactions.");
      }
    } catch (err) {
      console.error(err);
      setDeleteMessage("❌ Error deleting transactions.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportMessage("Please select a JSON file to import.");
      setImportMessageType("error");
      return;
    }

    setIsImporting(true);
    try {
      const text = await importFile.text();
      const importedTxs: Omit<Transaction, "_id">[] = JSON.parse(text);

      const validTxs = importedTxs.filter(
        (tx) =>
          tx.title &&
          typeof tx.amount === "number" &&
          tx.category &&
          tx.type &&
          tx.date
      );

      if (validTxs.length === 0) {
        setImportMessage("No valid transactions found in the file.");
        setImportMessageType("error");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to import transactions.");
        return;
      }

      const response = await axios.post("/api/transactions/import", validTxs, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setImportMessage(
          `Successfully imported ${validTxs.length} transactions.`
        );
        setImportMessageType("success");
        setImportFile(null);
        fetchTransactions();
      } else {
        setImportMessage("Failed to import transactions.");
        setImportMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setImportMessage(
        "Failed to import transactions. Please check the file format."
      );
      setImportMessageType("error");
    } finally {
      setIsImporting(false);
    }
  };

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
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found. Please login.");
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);

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
  const handleDownloadData = () => {
    const data = txs;
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
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-[#F8FAFF] dark:from-[#1a1c2c] dark:to-[#0d0f1f] py-5 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#14162b] shadow-xl rounded-3xl p-4 md:p-10 mt-12">
        <div className="flex justify-end mb-4">
          <MenuButton />
        </div>
        <div className="flex items-center justify-center mb-4">
          <FaUserCircle className="text-6xl text-indigo-600 dark:text-indigo-400" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 mb-8">
          Your Profile
        </h1>

        {/* User Info */}
        <div className="space-y-5 mb-10">
          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Name
            </label>
            <input
              value={user?.name || "User"}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl  dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Email
            </label>
            <input
              value={user?.email || "user@gmail.com"}
              disabled
              className="w-full px-4 py-2 mt-1 rounded-xl  dark:bg-gray-800 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadData}
          className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl  shadow-md hover:shadow-lg transition-all duration-300 mb-10 cursor-pointer"
        >
          Download Your Data (JSON)
        </button>

        <div className="mb-6 text-white text-center">
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleImport}
            disabled={isImporting}
            className={`w-full mt-4 py-2 px-4 rounded-xl shadow text-white transition-all duration-300 ${
              isImporting
                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            }`}
          >
            {isImporting ? (
              "Importing..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Import Transactions
              </span>
            )}{" "}
          </button>

          {importMessage && (
            <p
              className={`mt-2 text-sm font-medium ${
                importMessageType === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {importMessage}
            </p>
          )}
        </div>

        <div className="mb-10">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 cursor-pointer text-white py-2 px-4 rounded-xl shadow hover:shadow-lg transition"
            >
              Delete All Transactions
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900 p-4 mt-4 rounded-xl shadow">
              <p className="text-sm font-semibold text-red-600 dark:text-red-300 mb-2">
                This action is irreversible. To confirm, type{" "}
                <strong>delete</strong> below:
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder='Type "delete" to confirm'
                className="w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 text-gray-800 dark:text-white mb-2"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAllTransactions}
                  disabled={isDeleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteInput("");
                    setDeleteMessage("");
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>

              {deleteMessage && (
                <p
                  className={`text-sm mt-3 text-center ${
                    deleteMessage.includes("✅")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-300"
                  }`}
                >
                  {deleteMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-4 py-2 rounded-xl  dark:bg-gray-800 text-gray-800 dark:text-white"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 rounded-xl  dark:bg-gray-800 text-gray-800 dark:text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 rounded-xl  dark:bg-gray-800 text-gray-800 dark:text-white"
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer font-semibold"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
