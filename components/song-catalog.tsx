"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { SongHeader } from "./song-header";
import { SearchBar } from "./search-bar";
import { ArtistFilter } from "./artist-filter";
import { SongList } from "./song-list";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Song {
  id: number;
  artist: string;
  title: string;
}

interface Artist {
  artist: string;
  song_count: string;
}

type SortMode = "artist" | "title" | "newest";

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: "artist", label: "按歌手" },
  { value: "title", label: "按歌名" },
  { value: "newest", label: "最新添加" },
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export function SongCatalog() {
  const [search, setSearch] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("artist");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 260);

    return () => clearTimeout(timer);
  }, [search]);

  const songsQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set("sort", sortMode);

    if (selectedArtist) {
      params.set("artist", selectedArtist);
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    return `/api/songs?${params.toString()}`;
  }, [debouncedSearch, selectedArtist, sortMode]);

  const { data: songs, isLoading: songsLoading, error: songsError } = useSWR<
    Song[]
  >(songsQuery, fetcher, {
    keepPreviousData: true,
  });

  const {
    data: artists,
    isLoading: artistsLoading,
    error: artistsError,
  } = useSWR<Artist[]>("/api/artists", fetcher);

  const totalSongs = useMemo(
    () =>
      artists?.reduce((sum, artist) => sum + Number(artist.song_count || 0), 0) ??
      songs?.length ??
      0,
    [artists, songs]
  );

  const isInitialLoading = (songsLoading && !songs) || (artistsLoading && !artists);
  const hasError = songsError || artistsError;
  const groupedByArtist = sortMode === "artist" && !selectedArtist;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SongHeader totalSongs={totalSongs} />
      <SearchBar value={search} onChange={setSearch} />

      <div className="border-b border-border/80 bg-background/45 px-4 pb-3">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          排序方式
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSortMode(option.value)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                sortMode === option.value
                  ? "border-primary/80 bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border-border/70 bg-card/70 text-secondary-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!artistsLoading && artists && (
        <ArtistFilter
          artists={artists}
          selectedArtist={selectedArtist}
          onSelect={(artist) => {
            setSelectedArtist(artist);
          }}
        />
      )}

      {hasError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-20 text-center">
          <p className="text-sm font-medium text-foreground">加载失败</p>
          <p className="text-xs text-muted-foreground">
            请稍后刷新页面重试
          </p>
        </div>
      ) : isInitialLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">正在加载歌单...</p>
        </div>
      ) : (
        <SongList
          songs={songs ?? []}
          showArtist={!selectedArtist}
          groupedByArtist={groupedByArtist}
        />
      )}
    </div>
  );
}
