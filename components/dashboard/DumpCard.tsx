import React from "react";
import { format } from "date-fns";

interface DumpCardProps {
  content: string;
  mood?: string | null;
  createdAt: string | Date;
}

const DumpCard: React.FC<DumpCardProps> = ({ content, mood, createdAt }) => {
  const formattedDate = format(new Date(createdAt), "MMM dd, yyyy");
  const formattedTime = format(new Date(createdAt), "hh:mm a");

  return (
    <div className="group p-5 rounded-lg bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 cursor-pointer">
      <p className="text-zinc-800 dark:text-zinc-100 text-sm leading-relaxed mb-4 line-clamp-4 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-colors">
        {content}
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
          {mood || "😐"}
        </span>

        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {formattedDate}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-500">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DumpCard;
