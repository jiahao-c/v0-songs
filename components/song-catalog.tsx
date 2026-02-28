"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { SongHeader } from "./song-header";
import { SearchBar } from "./search-bar";
import { ArtistFilter } from "./artist-filter";
import { SongList } from "./song-list";
import { Loader2 } from "lucide-react";

interface Song {
  id: number;
  artist: string;
  title: string;
}

interface Artist {
  artist: string;
  song_count: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SongCatalog() {
  const [search, setSearch] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const { data: allSongs, isLoading: songsLoading } = useSWR<Song[]>(
    "/api/songs",
    fetcher
  );

  const { data: artists, isLoading: artistsLoading } = useSWR<Artist[]>(
    "/api/artists",
    fetcher
  );

  const filteredSongs = useMemo(() => {
    if (!allSongs) return [];

    let result = allSongs;

    if (selectedArtist) {
      result = result.filter((s) => s.artist === selectedArtist);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allSongs, selectedArtist, search]);

  const isLoading = songsLoading || artistsLoading;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SongHeader totalSongs={allSongs?.length ?? 0} />
      <SearchBar value={search} onChange={setSearch} />
      {!isLoading && artists && (
        <ArtistFilter
          artists={artists}
          selectedArtist={selectedArtist}
          onSelect={(artist) => {
            setSelectedArtist(artist);
            setSearch("");
          }}
        />
      )}
      {isLoading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">正在加载歌单...</p>
        </div>
      ) : (
        <SongList
          songs={filteredSongs}
          showArtist={!selectedArtist && !search}
        />
      )}
    </div>
  );
}
