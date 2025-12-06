"use client";
import Calender from "@/components/dashboard/Calender";
import Dumps from "@/components/dashboard/Dumps";
import { redirect } from "next/navigation";

const DashboardPage = () => {
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      redirect("/login");
    }
  };

  return (
    <div>
      Dashboard page
      <Calender />
      <Dumps />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
