"use client";

import { useEffect, useState } from "react";

type Dump = {
     id: string;
     content: string;
     mood: string | null;
     createdAt: string;
     updatedAt: string;
     userId: string;
};

type DayInfo = {
     emoji: string;
     dumps: Dump[];
};

type CalendarData = Record<string, DayInfo>;

export default function MoodCalendar() {
     const [data, setData] = useState<CalendarData>({});
     const [currentMonth, setCurrentMonth] = useState(new Date());
     const [selectedDay, setSelectedDay] = useState<
          (DayInfo & { dateKey: string }) | null
     >(null);

     const fetchData = async () => {
          const month = currentMonth.toISOString().slice(0, 7);
          const res = await fetch(`/api/dumps/moods?month=${month}`, {
               credentials: "include",
          });
          const json = await res.json();
          console.log("API response:", json);
          setData(json);
     };

     useEffect(() => {
          fetchData();
     }, [currentMonth]);

     const year = currentMonth.getFullYear();
     const month = currentMonth.getMonth();
     const daysInMonth = new Date(year, month + 1, 0).getDate();
     const firstDayOfWeek = new Date(year, month, 1).getDay();

     const daysArray = [
          ...Array(firstDayOfWeek).fill(null),
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
     ];

     const goPrev = () => setCurrentMonth(new Date(year, month - 1, 1));
     const goNext = () => setCurrentMonth(new Date(year, month + 1, 1));

     return (
          <div className="p-4 border rounded-lg shadow bg-white dark:bg-zinc-900">
               {/* Header */}
               <div className="flex justify-between items-center mb-4">
                    <button onClick={goPrev}>⬅</button>
                    <h2 className="text-xl font-bold">
                         {currentMonth.toLocaleString("en-US", {
                              month: "long",
                              year: "numeric",
                         })}
                    </h2>
                    <button onClick={goNext}>➡</button>
               </div>

               {/* Week Row */}
               <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold opacity-70">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                         (d) => (
                              <div key={d}>{d}</div>
                         )
                    )}
               </div>

               {/* Days Grid */}
               <div className="grid grid-cols-7 gap-1 mt-2">
                    {daysArray.map((day, idx) => {
                         if (!day) return <div key={idx} />;

                         const dateKey = `${year}-${String(month + 1).padStart(
                              2,
                              "0"
                         )}-${String(day).padStart(2, "0")}`;
                         const info = data[dateKey];

                         return (
                              <div
                                   key={idx}
                                   className="relative border border-zinc-200 dark:border-zinc-700 rounded-md p-2 text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                   onClick={() =>
                                        setSelectedDay({
                                             dateKey,
                                             emoji: info?.emoji ?? "😐",
                                             dumps: info?.dumps ?? [],
                                        })
                                   }
                              >
                                   <span className="opacity-80">{day}</span>
                                   {info?.emoji && (
                                        <span className="absolute top-1 right-1 text-lg">
                                             {info.emoji}
                                        </span>
                                   )}
                              </div>
                         );
                    })}
               </div>

               {/* Modal */}
               {selectedDay && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-[9999]">
                         <div className="relative bg-white z-[10000] dark:bg-zinc-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 border border-zinc-200 dark:border-zinc-700">
                              {/* Close button */}
                              <button
                                   className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs"
                                   onClick={() => setSelectedDay(null)}
                              >
                                   Close
                              </button>

                              {/* Title */}
                              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                   Dumps on {selectedDay.dateKey}
                                   <span className="text-2xl">
                                        {selectedDay.emoji}
                                   </span>
                              </h3>

                              {/* Dump List */}
                              {selectedDay.dumps.length > 0 ? (
                                   <div className="space-y-3">
                                        {selectedDay.dumps.map((d) => (
                                             <div
                                                  key={d.id}
                                                  className="border-b border-zinc-200 dark:border-zinc-700 pb-2 text-sm leading-relaxed wrap-break-word dark:text-zinc-100"
                                                  dangerouslySetInnerHTML={{
                                                       __html: d.content,
                                                  }}
                                             />
                                        ))}
                                   </div>
                              ) : (
                                   <p className="text-sm text-gray-500 dark:text-gray-300">
                                        No dumps found for this day.
                                   </p>
                              )}
                         </div>
                    </div>
               )}
          </div>
     );
}
