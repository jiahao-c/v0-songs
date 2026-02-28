"use client";

import { Music } from "lucide-react";

export function SongHeader({ totalSongs }: { totalSongs: number }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Music className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            LiveStage
          </h1>
          <p className="text-xs text-muted-foreground">
            {totalSongs > 0 ? `${totalSongs} 首歌曲可点` : "加载中..."}
          </p>
        </div>
      </div>
    </header>
  );
}
