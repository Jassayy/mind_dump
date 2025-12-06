"use client";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function LoginModal({ open, onClose }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;
  const handleLogin = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      onClose();
      toast("Login successful!", {
        description: "You have beed logged into MindDump",
      });
      redirect("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl w-[380px] flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2"
        />

        <Button className="w-full" onClick={handleLogin}>
          {loading ? <Loader className="animate-spin" /> : "Login"}
        </Button>

        <Button
          className="text-sm text-gray-600 hover:underline"
          onClick={onClose}
        >
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
}
