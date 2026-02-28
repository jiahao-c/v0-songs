"use client";

import { Mic2 } from "lucide-react";

interface Song {
  id: number;
  artist: string;
  title: string;
}

interface SongListProps {
  songs: Song[];
  showArtist: boolean;
}

export function SongList({ songs, showArtist }: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Mic2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">没有找到匹配的歌曲</p>
      </div>
    );
  }

  // Group songs by artist
  const grouped = songs.reduce<Record<string, Song[]>>((acc, song) => {
    if (!acc[song.artist]) acc[song.artist] = [];
    acc[song.artist].push(song);
    return acc;
  }, {});

  const artists = Object.keys(grouped);

  return (
    <div className="flex flex-col pb-8">
      {artists.map((artist) => (
        <div key={artist}>
          {showArtist && (
            <div className="sticky top-[129px] z-[5] border-b border-border bg-background/90 px-4 py-2 backdrop-blur-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
                {artist}
                <span className="ml-2 text-muted-foreground">
                  {grouped[artist].length}
                </span>
              </h2>
            </div>
          )}
          {grouped[artist].map((song, idx) => (
            <div
              key={song.id}
              className="flex items-center gap-4 border-b border-border/50 px-4 py-3 transition-colors active:bg-secondary/50"
            >
              <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {idx + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {song.title}
                </span>
                {!showArtist && (
                  <span className="truncate text-xs text-muted-foreground">
                    {song.artist}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
