"use client";

import { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddSongFormProps {
  onAdded: () => void;
  existingArtists: string[];
}

export function AddSongForm({ onAdded, existingArtists }: AddSongFormProps) {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const filtered = artist.trim()
    ? existingArtists.filter((a) =>
        a.toLowerCase().includes(artist.trim().toLowerCase())
      )
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!artist.trim() || !title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist: artist.trim(), title: title.trim() }),
      });

      if (res.ok) {
        setTitle("");
        titleRef.current?.focus();
        onAdded();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <Input
          placeholder="歌手名"
          value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <div className="max-h-40 overflow-y-auto">
              {filtered.slice(0, 8).map((a) => (
                <button
                  key={a}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary/80"
                  onMouseDown={() => {
                    setArtist(a);
                    setShowSuggestions(false);
                    titleRef.current?.focus();
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Input
        ref={titleRef}
        placeholder="歌曲名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
      />

      <Button
        type="submit"
        disabled={loading || !artist.trim() || !title.trim()}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        添加歌曲
      </Button>
    </form>
  );
}
