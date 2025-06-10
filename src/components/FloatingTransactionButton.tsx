"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingTransactionButton() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [showModal]);

  const fetchTransactions = () => {
    console.log("test")
  };

  

  return (
    <>
      {/* Floating + Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-green-400  text-white p-4 rounded-full shadow-lg hover:scale-105 hover:brightness-110 transition-transform"
        aria-label="Add Transaction"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Modal Overlay with Animation */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative bg-[#111]/80 rounded-xl  shadow-lg w-full max-w-260"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-1 right-1 fot text-gray-300 hover:text-red-500 transition"
                aria-label="Close"
              >
                <X size={25}/>
              </button>

              {/* Transaction Form */}
              <AddTransactionForm
                onAdd={() => {
                  fetchTransactions();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
