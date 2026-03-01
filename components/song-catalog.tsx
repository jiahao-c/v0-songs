"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import useSWR from "swr";
import { SongHeader } from "./song-header";
import { SearchBar } from "./search-bar";
import { ArtistFilter } from "./artist-filter";
import { SongList } from "./song-list";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AboutSection, Artist, Song } from "@/lib/content-data";

interface SongCatalogProps {
  initialSongs?: Song[];
  initialArtists?: Artist[];
  initialAboutSections?: AboutSection[];
}

const DEFAULT_SONGLIST_MARKDOWN = `欢迎大家点歌！点歌是免费的！

但如果你喜欢我的演唱，我会很感谢您的小费支持！希望我的歌声带给你美好的音乐体验！`;

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string;
    children?: ReactNode;
  }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

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

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SongHeader totalSongs={totalSongs} />
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
          songs={songs ?? []}
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

          <DialogHeader>
            <DialogTitle className="text-base">如何点歌</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {aboutSectionsLoading && !aboutSections ? (
              <p>正在加载点歌说明...</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {songlistMarkdown}
              </ReactMarkdown>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" className="w-full sm:w-auto">
                知道了
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
