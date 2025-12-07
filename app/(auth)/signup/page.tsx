"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      toast(res.statusText, {
        description: data.error || "Sign-up failed",
      });
      setEmail("");
      setPassword("");
      return;
    }
    setLoading(false);
    toast("Sign-up successful!", {
      description: "You have beed logged into MindDump",
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-100 dark:bg-black px-4">
      <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          Welcome!
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="border border-gray-300 dark:border-zinc-700 bg-transparent text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 dark:border-zinc-700 bg-transparent text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 dark:border-zinc-700 bg-transparent text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            className="w-full py-3 text-lg hover:cursor-pointer"
            type="submit"
          >
            {loading ? <Loader className="animate-spin" /> : "Sign-up"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
