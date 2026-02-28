"use client";

import useSWR from "swr";
import Link from "next/link";
import { ArrowLeft, Music, Loader2 } from "lucide-react";
import { AddSongForm } from "@/components/add-song-form";
import { ManageSongList } from "@/components/manage-song-list";

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

export default function ManagePage() {
  const {
    data: songs,
    isLoading,
    mutate: mutateSongs,
  } = useSWR<Song[]>("/api/songs", fetcher);

  const { data: artists, mutate: mutateArtists } = useSWR<Artist[]>(
    "/api/artists",
    fetcher
  );

  const existingArtists = artists?.map((a) => a.artist) ?? [];

  function refresh() {
    mutateSongs();
    mutateArtists();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
            aria-label="返回歌单"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">歌单管理</h1>
          </div>
          {songs && (
            <span className="ml-auto text-xs text-muted-foreground">
              共 {songs.length} 首
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-5">
        {/* Add Song Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            添加歌曲
          </h2>
          <AddSongForm onAdded={refresh} existingArtists={existingArtists} />
        </section>

        {/* Song List Section */}
        <section className="flex flex-1 flex-col">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            歌曲列表
          </h2>
          {isLoading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">正在加载...</p>
            </div>
          ) : songs ? (
            <ManageSongList songs={songs} onDeleted={refresh} />
          ) : null}
        </section>
      </main>
    </div>
  );
}
