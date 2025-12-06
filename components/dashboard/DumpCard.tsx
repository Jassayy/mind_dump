import React from "react";
import { format } from "date-fns";

interface DumpCardProps {
  content: string;
  mood?: string | null;
  createdAt: string | Date;
}

const DumpCard: React.FC<DumpCardProps> = ({ content, mood, createdAt }) => {
  const formattedDate = format(new Date(createdAt), "dd MMM yyyy • hh:mm a");

  return (
    <div className="p-5 rounded-xl shadow-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-shadow cursor-pointer">
      <p className="text-gray-800 dark:text-gray-100 text-sm mb-3 line-clamp-3">
        {content}
      </p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
          {mood || "😐"}
        </span>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default DumpCard;
