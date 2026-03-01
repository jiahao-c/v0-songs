"use client";

import Image from "next/image";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SongHeader({ totalSongs }: { totalSongs: number }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 12% -40%, oklch(0.75 0.18 55 / 0.26), transparent 60%)",
        }}
      />
      <div className="relative flex items-center gap-3 px-4 py-3">
        <Link
          href="/about"
          className="group flex flex-1 shrink-0 items-center gap-3 rounded-xl px-1 py-0.5 transition-colors hover:bg-secondary/45"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/photo.jpg"
              alt="王咚咚"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground">
              王咚咚
            </h1>
            <p className="truncate text-[11px] text-muted-foreground">
              原创音乐人 · {totalSongs > 0 ? `${totalSongs} 首可点` : "加载中..."}
            </p>
          </div>
        </Link>

        <ThemeToggle />
        <Link
          href="/manage"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/75 px-3 text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:text-primary"
          aria-label="内容管理"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">管理</span>
        </Link>
      </div>
    </header>
  );
}
