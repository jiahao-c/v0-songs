"use client";

import { useState } from "react";
import { Trash2, Loader2, Search, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Song {
  id: number;
  artist: string;
  title: string;
}

interface ManageSongListProps {
  songs: Song[];
  onDeleted: () => void;
}

export function ManageSongList({ songs, onDeleted }: ManageSongListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase())
      )
    : songs;

  // Group by artist
  const grouped = filtered.reduce<Record<string, Song[]>>((acc, song) => {
    if (!acc[song.artist]) acc[song.artist] = [];
    acc[song.artist].push(song);
    return acc;
  }, {});

  async function handleDelete(song: Song) {
    setDeletingId(song.id);
    try {
      const res = await fetch("/api/songs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: song.id }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.error || "删除失败，请稍后重试");
        return;
      }

      onDeleted();
      toast.success(`已删除《${song.title}》`);
    } catch {
      toast.error("网络异常，请稍后重试");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(song: Song) {
    setEditingId(song.id);
    setEditingTitle(song.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function handleSaveTitle(songId: number) {
    const title = editingTitle.trim();
    if (!title) {
      toast.error("歌名不能为空");
      return;
    }

    setSavingId(songId);
    try {
      const res = await fetch("/api/songs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: songId, title }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.error || "保存失败，请稍后重试");
        return;
      }

      cancelEdit();
      onDeleted();
      toast.success("歌曲名称已更新");
    } catch {
      toast.error("网络异常，请稍后重试");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索歌曲或歌手..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary/50 border-border pl-9 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        共 {filtered.length} 首歌曲
        {search && ` (搜索结果)`}
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-border">
        {Object.keys(grouped).length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            没有找到匹配的歌曲
          </div>
        )}
        {Object.entries(grouped).map(([artist, artistSongs]) => (
          <div key={artist}>
            <div className="border-b border-border bg-secondary/30 px-4 py-2">
              <span className="text-xs font-semibold text-primary">
                {artist}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {artistSongs.length}
              </span>
            </div>
            {artistSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between border-b border-border/50 px-4 py-2.5"
              >
                {editingId === song.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="h-8 min-w-0 flex-1 bg-secondary/50 text-sm"
                  />
                ) : (
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {song.title}
                  </span>
                )}

                <div className="ml-3 flex shrink-0 items-center gap-1">
                  {editingId === song.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveTitle(song.id)}
                        disabled={savingId === song.id || !editingTitle.trim()}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary disabled:opacity-50"
                        aria-label={`保存 ${song.title}`}
                      >
                        {savingId === song.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={savingId === song.id}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary/80"
                        aria-label={`取消编辑 ${song.title}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(song)}
                      disabled={deletingId === song.id}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
                      aria-label={`编辑 ${song.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(song)}
                    disabled={deletingId === song.id || savingId === song.id}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive disabled:opacity-50"
                    aria-label={`删除 ${song.title}`}
                  >
                    {deletingId === song.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
