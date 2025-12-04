"use client";
import { redirect } from "next/navigation";

const DashboardPage = () => {
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      redirect("/login");
    }
  };
  return (
    <div>
      Dashboard page
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
