"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

interface ReactQuillWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  modules?: any;
  theme?: string;
}

export default function ReactQuillWrapper({
  value,
  onChange,
  placeholder,
  className,
  modules,
  theme = "snow",
}: ReactQuillWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <ReactQuill
      theme={theme}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      modules={modules}
    />
  );
}

