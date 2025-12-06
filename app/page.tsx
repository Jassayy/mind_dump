import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Nav from "@/components/landing/Nav";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      redirect("/dashboard"); //  send logged in users to dashboard
    } catch {}
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col">
      <Nav />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
