"use client";

import { Search, X } from "lucide-react";
import { useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky top-[var(--header-height)] z-20 border-b border-border/80 bg-background/70 px-4 py-3 backdrop-blur-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索歌曲或歌手（支持拼音）..."
          className="h-11 w-full rounded-xl border border-border/80 bg-card/70 pl-11 pr-10 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary/80 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            aria-label="清除搜索"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
