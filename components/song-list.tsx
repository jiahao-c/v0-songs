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
  groupedByArtist?: boolean;
}

function SongRow({
  song,
  index,
  showArtist,
}: {
  song: Song;
  index: number;
  showArtist: boolean;
}) {
  return (
    <div className="group flex items-center gap-4 border-b border-border/50 px-4 py-3 transition-[background-color,transform] duration-200 hover:bg-secondary/35 active:scale-[0.995] active:bg-secondary/60">
      <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {index}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {song.title}
        </span>
        {showArtist && (
          <span className="truncate text-xs text-muted-foreground">{song.artist}</span>
        )}
      </div>
    </div>
  );
}

export function SongList({
  songs,
  showArtist,
  groupedByArtist = true,
}: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-card/70 shadow-lg shadow-primary/10">
          <Mic2 className="h-6 w-6 text-primary/80" />
        </div>
        <p className="text-sm font-medium text-foreground">没有找到匹配的歌曲</p>
        <p className="text-xs text-muted-foreground">试试换个关键词或切换筛选条件</p>
      </div>
    );
  }

  if (!groupedByArtist) {
    return (
      <div className="flex flex-col pb-8">
        {songs.map((song, idx) => (
          <SongRow
            key={song.id}
            song={song}
            index={idx + 1}
            showArtist={showArtist}
          />
        ))}
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
          <div className="sticky top-[var(--song-group-sticky-top)] z-[5] border-b border-border/70 bg-background/85 px-4 py-2 backdrop-blur-md">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
              {artist}
              <span className="ml-2 text-muted-foreground">
                {grouped[artist].length}
              </span>
            </h2>
          </div>
          {grouped[artist].map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx + 1}
              showArtist={false}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
