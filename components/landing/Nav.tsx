"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { sniglet } from "@/fonts/fonts";

const Nav = () => {
  return (
    <nav className="w-full fixed top-0 left-0 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md bg-white/40 shadow-sm z-50">
      {/* Logo */}
      <Link href="/" className={`text-2xl font-bold ${sniglet.className}`}>
        MindDump
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="#features" className="hover:text-gray-700">
          Features
        </Link>

        {/* CTA - shows login/signup for now */}
        <Link href="/login">
          <Button
            size="sm"
            className="rounded-full hover:scale-105 hover:cursor-pointer"
          >
            Login
          </Button>
        </Link>
      </div>

      {/* Mobile Menu (will add functionality later) */}
      <div className="md:hidden">
        <Button variant="outline" size="icon">
          ☰
        </Button>
      </div>
    </nav>
  );
};

export default Nav;
