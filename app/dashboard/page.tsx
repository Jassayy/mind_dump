"use client";
import Dumps from "@/components/dashboard/Dumps";
import Search from "@/components/dashboard/Search";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Plus } from "lucide-react";
import { toast } from "sonner";
import { sniglet } from "@/fonts/fonts";
import AIChat from "@/components/dashboard/AIChat";
import MoodCalendar from "@/components/dashboard/MoodCalendar";

const DashboardPage = () => {
     const router = useRouter();
     const [userName, setUserName] = useState<string>("");
     const [loading, setLoading] = useState(true);
     const [searchQuery, setSearchQuery] = useState("");

     useEffect(() => {
          const fetchUser = async () => {
               try {
                    const res = await fetch("/api/auth/me", {
                         credentials: "include",
                    });
                    if (res.ok) {
                         const data = await res.json();
                         setUserName(data.user?.name || "User");
                    }
               } catch (error) {
                    console.error("Error fetching user:", error);
               } finally {
                    setLoading(false);
               }
          };
          fetchUser();
     }, []);

     const handleLogout = async () => {
          const res = await fetch("/api/auth/logout", {
               method: "POST",
               credentials: "include",
          });

          if (res.ok) {
               toast("Logged out successfully", {
                    description: "You have been logged out",
               });
               router.push("/login");
          } else {
               toast("Error", {
                    description: "Failed to log out",
               });
          }
     };

     return (
          <div className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
               {/* Header */}
               <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg shadow-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex h-16 items-center justify-between">
                              <h1
                                   className={`${sniglet.className} text-2xl font-extrabold`}
                              >
                                   MindDump
                              </h1>

                              <div className="flex items-center gap-4">
                                   {!loading && (
                                        <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                             <User className="h-4 w-4" />
                                             <span className="font-medium">
                                                  {userName}
                                             </span>
                                        </div>
                                   )}

                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="gap-2"
                                   >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                   </Button>
                              </div>
                         </div>
                    </div>
               </header>

               {/* Main */}
               <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                    {/* Welcome */}
                    <section>
                         <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                              Welcome back{userName ? `, ${userName}` : ""}! 👋
                         </h2>
                         <p className="text-zinc-600 dark:text-zinc-400">
                              Your thoughts matter. Manage them here 🧠✨
                         </p>
                    </section>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                         {/* LEFT SIDE */}
                         <div className="space-y-6 xl:sticky xl:top-28 self-start">
                              {/* Calendar Card */}
                              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                                   <h3 className="text-xl font-semibold mb-4">
                                        Mood Calendar 📅
                                        <p className="text-red-500 text-xs">
                                             This calendar is not for show but
                                             the feature is yet to be
                                             implemented correctly. Hang tight!
                                        </p>
                                   </h3>
                                   <MoodCalendar />
                              </div>

                              {/* AI Chat Card */}
                              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                                   <AIChat />
                              </div>
                         </div>

                         {/* RIGHT SIDE — Dumps */}
                         <div className="xl:col-span-2 space-y-6">
                              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
                                   <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                             Your Dumps 💭
                                        </h3>
                                        <Button
                                             onClick={() =>
                                                  router.push(
                                                       "/dashboard/dump/create"
                                                  )
                                             }
                                             className="gap-2"
                                        >
                                             <Plus className="h-4 w-4" />
                                             New Dump
                                        </Button>
                                   </div>

                                   {/* Search */}
                                   <Search
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                   />

                                   {/* List */}
                                   <div className="mt-4">
                                        <Dumps searchQuery={searchQuery} />
                                   </div>
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
};

export default DashboardPage;
