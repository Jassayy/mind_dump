"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "./button";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add CSS for placeholder
    const style = document.createElement("style");
    style.id = "rich-text-editor-placeholder";
    style.textContent = `
      [contenteditable][data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
      }
    `;
    if (!document.getElementById("rich-text-editor-placeholder")) {
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && mounted) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, mounted]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // Strip empty tags and check if there's actual content
      const textContent = editorRef.current.textContent || "";
      if (textContent.trim() === "" && html === "<br>") {
        onChange("");
      } else {
        onChange(html);
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const isActive = (command: string) => {
    return document.queryCommandState(command);
  };

  if (!mounted) {
    return (
      <div className={`min-h-[400px] border border-zinc-200 dark:border-zinc-800 rounded-md p-4 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-zinc-400">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("bold")}
          className={`h-8 w-8 p-0 ${isActive("bold") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("italic")}
          className={`h-8 w-8 p-0 ${isActive("italic") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("underline")}
          className={`h-8 w-8 p-0 ${isActive("underline") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyLeft")}
          className={`h-8 w-8 p-0 ${isActive("justifyLeft") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyCenter")}
          className={`h-8 w-8 p-0 ${isActive("justifyCenter") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("justifyRight")}
          className={`h-8 w-8 p-0 ${isActive("justifyRight") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className={`h-8 w-8 p-0 ${isActive("insertUnorderedList") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className={`h-8 w-8 p-0 ${isActive("insertOrderedList") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <select
          onChange={(e) => {
            if (e.target.value) {
              execCommand("formatBlock", e.target.value);
            }
          }}
          className="h-8 px-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          title="Heading"
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const color = prompt("Enter color (e.g., #ff0000 or red):");
            if (color) execCommand("foreColor", color);
          }}
          className="h-8 px-2 text-sm"
          title="Text Color"
        >
          A
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCommand("createLink", url);
          }}
          className="h-8 px-2 text-sm"
          title="Insert Link"
        >
          Link
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[400px] p-4 focus:outline-none prose prose-zinc dark:prose-invert max-w-none"
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}

// CSS for placeholder will be added via useEffect

