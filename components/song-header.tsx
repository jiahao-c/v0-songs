"use client";

import Image from "next/image";
import Link from "next/link";

export function SongHeader({ totalSongs }: { totalSongs: number }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
      <Link href="/about" className="flex items-center gap-3 px-4 py-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40">
          <Image
            src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/photo.jpg"
            alt="王咚咚"
            fill
            className="object-cover"
            sizes="40px"
            priority
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            王咚咚
          </h1>
          <p className="text-xs text-muted-foreground">
            {totalSongs > 0 ? `${totalSongs} 首歌曲可点` : "加载中..."}
          </p>
        </div>
      </Link>
    </header>
  );
}
