"use client";

import { cn } from "@/lib/utils";
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
    <div className="border-b border-border bg-background/60">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
            selectedArtist === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              selectedArtist === a.artist
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {a.artist}
            <span className="ml-1 opacity-60">{a.song_count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
