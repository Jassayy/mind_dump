"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Search from "./Search";
import { getMoodEmoji } from "@/lib/mood-emoji";

interface Dump {
  id: string;
  content: string;
  mood: string | null;
  createdAt: string;
}

interface DumpsProps {
  searchQuery?: string;
}

const Dumps = ({ searchQuery = "" }: DumpsProps) => {
  const router = useRouter();
  const [allDumps, setAllDumps] = useState<Dump[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchAllDumps = async () => {
    setLoading(true);
    try {
      // Fetch all dumps for search functionality
      const allDumpsData: Dump[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(`/api/dumps?page=${currentPage}&limit=100`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.dumps && data.dumps.length > 0) {
          allDumpsData.push(...data.dumps);
          currentPage++;
          hasMore = currentPage <= data.totalPages;
        } else {
          hasMore = false;
        }
      }

      setAllDumps(allDumpsData);
      setTotalPages(Math.ceil(allDumpsData.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching dumps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDumps();
  }, []);

  // Filter dumps based on search query
  const filteredDumps = useMemo(() => {
    if (!searchQuery.trim()) {
      return allDumps;
    }
    const query = searchQuery.toLowerCase();
    return allDumps.filter(
      (dump) =>
        dump.content.toLowerCase().includes(query) ||
        (dump.mood && dump.mood.toLowerCase().includes(query))
    );
  }, [allDumps, searchQuery]);

  // Paginate filtered dumps
  const paginatedDumps = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredDumps.slice(start, end);
  }, [filteredDumps, page, itemsPerPage]);

  // Update total pages based on filtered results
  useEffect(() => {
    const newTotalPages = Math.max(
      1,
      Math.ceil(filteredDumps.length / itemsPerPage)
    );
    setTotalPages(newTotalPages);
    // Reset to first page when search changes
    setPage(1);
  }, [searchQuery, itemsPerPage]);

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") {
      // Server-side: simple regex to remove HTML tags
      return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div>
      {filteredDumps.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Content</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDumps.map((dump) => {
                  const plainContent = stripHtml(dump.content);
                  const preview =
                    plainContent.length > 100
                      ? plainContent.substring(0, 100) + "..."
                      : plainContent;

                  return (
                    <TableRow
                      key={dump.id}
                      className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      onClick={() => router.push(`/dashboard/dumps/${dump.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="max-w-md">{preview}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
                          {getMoodEmoji(dump.mood)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                        {format(new Date(dump.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/dumps/${dump.id}`);
                          }}
                          className="gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {page} of {totalPages || 1} • {filteredDumps.length} dump
              {filteredDumps.length !== 1 ? "s" : ""} found
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || totalPages === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {searchQuery ? "No dumps found" : "No dumps yet"}
          </h4>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
            {searchQuery
              ? "Try adjusting your search query"
              : "Start your journey by creating your first mind dump. Let your thoughts flow freely!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dumps;
