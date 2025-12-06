"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchProps {
     value: string;
     onChange: (value: string) => void;
     placeholder?: string;
}

const Search = ({
     value,
     onChange,
     placeholder = "Search dumps...",
}: SearchProps) => {
     return (
          <div className="relative">
               <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
               <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 w-full"
               />
          </div>
     );
};

export default Search;
