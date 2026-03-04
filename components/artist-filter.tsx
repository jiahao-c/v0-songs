"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useRef } from "react";

interface Artist {
  artist: string;
  song_count: string;
}

interface ArtistFilterProps {
  artists: Artist[];
  selectedArtist: string | null;
  onSelect: (artist: string | null) => void;
}

export function ArtistFilter({
  artists,
  selectedArtist,
  onSelect,
}: ArtistFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-border/80 bg-background/45 px-4 pb-3 pt-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          歌手筛选
        </p>
        {selectedArtist ? (
          <button
            onClick={() => onSelect(null)}
            className="group flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary transition-all hover:border-primary/50 hover:bg-primary/20 active:scale-95"
          >
            <span>已选：{selectedArtist}</span>
            <X className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
          </button>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {artists.length} 位歌手
          </span>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
            selectedArtist === null
              ? "border-primary/80 bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "border-border/70 bg-card/70 text-secondary-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          全部
        </button>
        {artists.map((a) => (
          <button
            key={a.artist}
            onClick={() =>
              onSelect(selectedArtist === a.artist ? null : a.artist)
            }
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
              selectedArtist === a.artist
                ? "border-primary/80 bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border-border/70 bg-card/70 text-secondary-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {a.artist}
            <span className="ml-1.5 rounded-full bg-background/35 px-1.5 py-0.5 text-[10px] opacity-80">
              {a.song_count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
