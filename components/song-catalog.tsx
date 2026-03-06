"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { SongHeader } from "./song-header";
import { SearchBar } from "./search-bar";
import { ArtistFilter } from "./artist-filter";
import { SongList } from "./song-list";
import { RandomSongDialog } from "./random-song-dialog";
import {
  DEFAULT_SONGLIST_MARKDOWN,
  SongRequestInstructions,
} from "./song-request-instructions";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AboutSection, Artist, Song } from "@/lib/content-data";

interface SongCatalogProps {
  initialSongs?: Song[];
  initialArtists?: Artist[];
  initialAboutSections?: AboutSection[];
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export function SongCatalog({
  initialSongs,
  initialArtists,
  initialAboutSections,
}: SongCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSonglistModalOpen, setIsSonglistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isRandomSongModalOpen, setIsRandomSongModalOpen] = useState(false);
  const [randomSong, setRandomSong] = useState<Song | null>(null);
  const [randomSongRollToken, setRandomSongRollToken] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 260);

    return () => clearTimeout(timer);
  }, [search]);

  const songsQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set("sort", "artist");

    if (selectedArtist) {
      params.set("artist", selectedArtist);
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    return `/api/songs?${params.toString()}`;
  }, [debouncedSearch, selectedArtist]);

  const initialSongsQuery = "sort=artist";
  const shouldUseInitialSongs =
    songsQuery === `/api/songs?${initialSongsQuery}` && !!initialSongs;

  const { data: songs, isLoading: songsLoading, error: songsError } = useSWR<
    Song[]
  >(songsQuery, fetcher, {
    keepPreviousData: true,
    fallbackData: shouldUseInitialSongs ? initialSongs : undefined,
  });

  const {
    data: artists,
    isLoading: artistsLoading,
    error: artistsError,
  } = useSWR<Artist[]>("/api/artists", fetcher, {
    fallbackData: initialArtists,
  });
  const { data: aboutSections, isLoading: aboutSectionsLoading } = useSWR<
    AboutSection[]
  >("/api/about-sections", fetcher, {
    fallbackData: initialAboutSections,
  });

  const songlistMarkdown = useMemo(() => {
    return (
      aboutSections?.find((section) => section.section_key === "about_songlist")
        ?.content_markdown ?? DEFAULT_SONGLIST_MARKDOWN
    );
  }, [aboutSections]);

  const totalSongs = useMemo(
    () =>
      artists?.reduce((sum, artist) => sum + Number(artist.song_count || 0), 0) ??
      songs?.length ??
      0,
    [artists, songs]
  );

  const isInitialLoading = (songsLoading && !songs) || (artistsLoading && !artists);
  const hasError = songsError || artistsError;
  const groupedByArtist = !selectedArtist;
  const availableSongs = songs ?? [];
  const instructionsMarkdown = aboutSections ? songlistMarkdown : undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SongHeader
        totalSongs={totalSongs}
        onRandomSongClick={() => {
          setRandomSong(null);
          setIsRandomSongModalOpen(true);
          setRandomSongRollToken((token) => token + 1);
        }}
      />
      <SearchBar value={search} onChange={setSearch} />

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
          songs={availableSongs}
          showArtist={!selectedArtist}
          groupedByArtist={groupedByArtist}
          onSongClick={(song) => {
            setSelectedSong(song);
            setIsSonglistModalOpen(true);
          }}
        />
      )}

      <Dialog open={isSonglistModalOpen} onOpenChange={setIsSonglistModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[85vh] overflow-y-auto sm:max-w-xl"
        >
          {selectedSong && (
            <div className="space-y-1 border-b border-border pb-4">
              <p className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                {selectedSong.title}
              </p>
              <p className="text-sm text-muted-foreground">{selectedSong.artist}</p>
            </div>
          )}

          <SongRequestInstructions
            markdown={instructionsMarkdown}
            isLoading={aboutSectionsLoading && !aboutSections}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" className="w-full sm:w-auto">
                知道了
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RandomSongDialog
        open={isRandomSongModalOpen}
        songs={availableSongs}
        selectedSong={randomSong}
        rerollToken={randomSongRollToken}
        songlistMarkdown={instructionsMarkdown}
        aboutSectionsLoading={aboutSectionsLoading && !aboutSections}
        onOpenChange={(open) => {
          setIsRandomSongModalOpen(open);
          if (!open) {
            setRandomSong(null);
          }
        }}
        onSelectedSongChange={setRandomSong}
        onReroll={() => {
          setRandomSong(null);
          setRandomSongRollToken((token) => token + 1);
        }}
      />
    </div>
  );
}
