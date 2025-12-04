"use client";

import { redirect } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // IMPORTANT: allows httpOnly cookie from server
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      redirect("/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </form>

      {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
    </div>
  );
};

export default LoginPage;
