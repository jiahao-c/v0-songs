"use client";

import { useState } from "react";
import { Trash2, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Song {
  id: number;
  artist: string;
  title: string;
}

interface ManageSongListProps {
  songs: Song[];
  onDeleted: () => void;
}

export function ManageSongList({ songs, onDeleted }: ManageSongListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase())
      )
    : songs;

  // Group by artist
  const grouped = filtered.reduce<Record<string, Song[]>>((acc, song) => {
    if (!acc[song.artist]) acc[song.artist] = [];
    acc[song.artist].push(song);
    return acc;
  }, {});

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const res = await fetch("/api/songs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        onDeleted();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索歌曲或歌手..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary/50 border-border pl-9 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        共 {filtered.length} 首歌曲
        {search && ` (搜索结果)`}
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-border">
        {Object.keys(grouped).length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            没有找到匹配的歌曲
          </div>
        )}
        {Object.entries(grouped).map(([artist, artistSongs]) => (
          <div key={artist}>
            <div className="border-b border-border bg-secondary/30 px-4 py-2">
              <span className="text-xs font-semibold text-primary">
                {artist}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {artistSongs.length}
              </span>
            </div>
            {artistSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between border-b border-border/50 px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {song.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(song.id)}
                  disabled={deletingId === song.id}
                  className="ml-3 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive disabled:opacity-50"
                  aria-label={`删除 ${song.title}`}
                >
                  {deletingId === song.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
