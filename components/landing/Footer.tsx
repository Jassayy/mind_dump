"use client";

import { sniglet } from "@/fonts/fonts";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50  py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h2 className={`text-xl font-semibold ${sniglet.className}`}>
            MindDump
          </h2>
          <p className="text-sm text-gray-400">Rant freely. Feel lighter.</p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-6 text-sm">
          <Link href="#features" className="underline">
            Features
          </Link>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-300   mt-6 pt-4">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} MindDump — All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
