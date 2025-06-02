// components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-center mt-10 py-6 text-sm font-semibold text-gray-400  shadow-inner">
      © 2025 MyBudgetory. Built with ❤️ by{" "}
      <Link
        href="https://justtayyabkhan.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-400 hover:underline"
      >
        Tayyab Khan
      </Link>
    </footer>
  );
};

export default Footer;
