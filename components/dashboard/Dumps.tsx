"use client";

import { useEffect, useState } from "react";
import DumpCard from "@/components/dashboard/DumpCard";

interface Dump {
  id: string;
  content: string;
  mood: string | null;
  createdAt: string;
}

const Dumps = () => {
  const [dumps, setDumps] = useState<Dump[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDumps = async () => {
    const res = await fetch(`/api/dumps?page=${page}&limit=10`, {
      credentials: "include",
    });

    const data = await res.json();
    setDumps(data.dumps);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchDumps();
  }, [page]);

  return (
    <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dumps.length > 0 ? (
        dumps.map((dump) => (
          <DumpCard
            key={dump.id}
            content={dump.content}
            mood={dump.mood}
            createdAt={dump.createdAt}
          />
        ))
      ) : (
        <p className="text-gray-500">No dumps found 😶</p>
      )}

      {/* Pagination Buttons */}
      <div className="flex justify-center w-full col-span-full mt-4 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-2 rounded bg-gray-200 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700">
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-2 rounded bg-gray-200 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dumps;
