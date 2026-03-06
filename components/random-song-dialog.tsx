"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dices, Sparkles } from "lucide-react";
import type { Song } from "@/lib/content-data";
import { cn } from "@/lib/utils";
import { SongRequestInstructions } from "@/components/song-request-instructions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REEL_VISIBLE_ROWS = 5;
const REEL_CENTER_INDEX = Math.floor(REEL_VISIBLE_ROWS / 2);
const REEL_ROW_HEIGHT = 56;
const SPIN_TIME_SCALE = 0.7;

function scaleSpinTime(durationMs: number) {
  return Math.round(durationMs * SPIN_TIME_SCALE);
}

function pickRandomSong(songs: Song[], excludedSongIds: number[] = []): Song {
  if (songs.length === 1) {
    return songs[0];
  }

  const excludedIds = new Set(
    excludedSongIds.filter((songId) => songId != null),
  );
  let nextSong = songs[Math.floor(Math.random() * songs.length)];

  while (excludedIds.has(nextSong.id) && excludedIds.size < songs.length) {
    nextSong = songs[Math.floor(Math.random() * songs.length)];
  }

  return nextSong;
}

function buildSpinTrack(
  songs: Song[],
  finalSong: Song,
  sequenceLength: number,
) {
  const sequence: Song[] = [];
  let previousSongId: number | null = null;

  for (let index = 0; index < sequenceLength - 1; index += 1) {
    const excludedIds =
      index >= sequenceLength - 4
        ? [finalSong.id, previousSongId ?? -1]
        : [previousSongId ?? -1];
    const nextSong = pickRandomSong(songs, excludedIds);
    sequence.push(nextSong);
    previousSongId = nextSong.id;
  }

  sequence.push(finalSong);

  const prefix = [
    pickRandomSong(songs, [sequence[0]?.id ?? -1]),
    pickRandomSong(songs, [sequence[0]?.id ?? -1]),
  ];
  const suffix = [
    pickRandomSong(songs, [finalSong.id]),
    pickRandomSong(songs, [finalSong.id]),
  ];

  return {
    trackSongs: [...prefix, ...sequence, ...suffix],
    startIndex: prefix.length,
    finalIndex: prefix.length + sequence.length - 1,
  };
}

function createSpinDelays(stepCount: number) {
  return Array.from({ length: stepCount }, (_, index) => {
    const progress = stepCount <= 1 ? 1 : index / (stepCount - 1);
    return scaleSpinTime(Math.round(72 + 290 * Math.pow(progress, 1.9)));
  });
}

function buildReducedMotionTrack(songs: Song[], finalSong: Song) {
  const leadSong = pickRandomSong(songs, [finalSong.id]);
  const trailSong = pickRandomSong(songs, [finalSong.id]);

  return {
    trackSongs: [leadSong, leadSong, finalSong, trailSong, trailSong],
    startIndex: REEL_CENTER_INDEX,
  };
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

interface RandomSongDialogProps {
  open: boolean;
  songs: Song[];
  selectedSong: Song | null;
  rerollToken: number;
  songlistMarkdown?: string;
  aboutSectionsLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectedSongChange: (song: Song | null) => void;
  onReroll: () => void;
}

export function RandomSongDialog({
  open,
  songs,
  selectedSong,
  rerollToken,
  songlistMarkdown,
  aboutSectionsLoading = false,
  onOpenChange,
  onSelectedSongChange,
  onReroll,
}: RandomSongDialogProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [trackSongs, setTrackSongs] = useState<Song[]>([]);
  const [activeTrackIndex, setActiveTrackIndex] = useState(REEL_CENTER_INDEX);
  const [transitionMs, setTransitionMs] = useState(150);
  const [isSpinning, setIsSpinning] = useState(false);
  const [didLand, setDidLand] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const lastSelectedSongIdRef = useRef<number | null>(selectedSong?.id ?? null);

  useEffect(() => {
    lastSelectedSongIdRef.current = selectedSong?.id ?? null;
  }, [selectedSong?.id]);

  const clearSpinTimers = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const currentTrackSong = useMemo(
    () => trackSongs[activeTrackIndex] ?? selectedSong,
    [activeTrackIndex, selectedSong, trackSongs],
  );
  const rerollButtonLabel = isSpinning
    ? "随机中..."
    : didLand
      ? "再抽一次"
      : "准备开始";
  const shouldHighlightRerollButton = rerollButtonLabel === "再抽一次";

  const startSpin = useCallback(() => {
    clearSpinTimers();

    if (songs.length === 0) {
      setTrackSongs([]);
      setIsSpinning(false);
      setDidLand(false);
      onSelectedSongChange(null);
      return;
    }

    const finalSong = pickRandomSong(
      songs,
      lastSelectedSongIdRef.current != null
        ? [lastSelectedSongIdRef.current]
        : [],
    );
    onSelectedSongChange(null);
    setDidLand(false);

    if (prefersReducedMotion) {
      const reducedTrack = buildReducedMotionTrack(songs, finalSong);
      setTrackSongs(reducedTrack.trackSongs);
      setActiveTrackIndex(reducedTrack.startIndex);
      setTransitionMs(scaleSpinTime(180));
      setIsSpinning(false);

      const settleTimeout = window.setTimeout(() => {
        setDidLand(true);
        onSelectedSongChange(finalSong);
      }, scaleSpinTime(160));

      timeoutsRef.current.push(settleTimeout);
      return;
    }

    const sequenceLength = 18 + Math.floor(Math.random() * 5);
    const {
      trackSongs: nextTrackSongs,
      startIndex,
      finalIndex,
    } = buildSpinTrack(songs, finalSong, sequenceLength);

    setTrackSongs(nextTrackSongs);
    setActiveTrackIndex(startIndex);
    setTransitionMs(scaleSpinTime(120));
    setIsSpinning(true);

    const delays = createSpinDelays(finalIndex - startIndex);
    let elapsed = scaleSpinTime(110);

    for (let move = 1; move <= finalIndex - startIndex; move += 1) {
      const moveDelay = delays[move - 1];
      const nextIndex = startIndex + move;
      const moveTimeout = window.setTimeout(() => {
        setTransitionMs(
          Math.max(scaleSpinTime(90), moveDelay - scaleSpinTime(16)),
        );
        setActiveTrackIndex(nextIndex);

        if (nextIndex === finalIndex) {
          const finishTimeout = window.setTimeout(
            () => {
              setIsSpinning(false);
              setDidLand(true);
              onSelectedSongChange(finalSong);
            },
            Math.max(scaleSpinTime(90), moveDelay - scaleSpinTime(16)) +
              scaleSpinTime(70),
          );

          timeoutsRef.current.push(finishTimeout);
        }
      }, elapsed);

      timeoutsRef.current.push(moveTimeout);
      elapsed += moveDelay;
    }
  }, [clearSpinTimers, onSelectedSongChange, prefersReducedMotion, songs]);

  useEffect(() => {
    if (!open) {
      clearSpinTimers();
      setTrackSongs([]);
      setActiveTrackIndex(REEL_CENTER_INDEX);
      setTransitionMs(150);
      setIsSpinning(false);
      setDidLand(false);
      return;
    }

    startSpin();

    return clearSpinTimers;
  }, [clearSpinTimers, open, rerollToken, startSpin]);

  useEffect(() => clearSpinTimers, [clearSpinTimers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-0.75rem)] w-[calc(100%-0.75rem)] max-w-[calc(100%-0.75rem)] flex-col overflow-hidden border-primary/15 bg-background/95 p-0 shadow-2xl shadow-primary/10 sm:max-h-[90dvh] sm:max-w-2xl"
      >
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/12 via-primary/5 to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 top-6 h-24 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
            <div className="space-y-4 px-4 py-4 sm:space-y-6 sm:p-7">
              <DialogHeader className="space-y-3 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                  <Dices className="h-3.5 w-3.5" />
                  随机一首
                </div>
              </DialogHeader>

              <div className="music-surface rounded-[24px] p-3.5 sm:rounded-[28px] sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    哪首歌跟你有缘？
                  </p>
                  <Button
                    type="button"
                    variant={
                      shouldHighlightRerollButton ? "default" : "outline"
                    }
                    size="sm"
                    className={cn(
                      "h-auto rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
                      shouldHighlightRerollButton
                        ? "border-primary shadow-sm shadow-primary/25"
                        : "border-border/60 bg-background/80 text-muted-foreground shadow-none",
                    )}
                    onClick={onReroll}
                  >
                    <Sparkles
                      className={cn(
                        "h-3.5 w-3.5",
                        shouldHighlightRerollButton
                          ? "text-primary-foreground"
                          : "text-primary",
                      )}
                    />
                    {rerollButtonLabel}
                  </Button>
                </div>

                {trackSongs.length > 0 ? (
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/85 px-3 py-2 shadow-inner">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
                    >
                      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background/95" />
                    </div>
                    <div
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-x-2 top-1/2 h-14 -translate-y-1/2 rounded-2xl border border-primary/35 bg-primary/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-300",
                        didLand &&
                          "animate-slot-land border-primary/50 bg-primary/14",
                      )}
                    />
                    <div className="relative h-[280px] overflow-hidden">
                      <div
                        className="will-change-transform"
                        style={{
                          transform: `translateY(${(REEL_CENTER_INDEX - activeTrackIndex) * REEL_ROW_HEIGHT}px)`,
                          transition: `transform ${transitionMs}ms cubic-bezier(0.18, 0.84, 0.26, 1)`,
                        }}
                      >
                        {trackSongs.map((song, index) => {
                          const distance = Math.abs(index - activeTrackIndex);

                          return (
                            <div
                              key={`${song.id}-${index}`}
                              className={cn(
                                "flex h-14 items-center justify-between gap-3 rounded-xl px-4 text-sm transition-all duration-300",
                                distance === 0 &&
                                  "scale-[1.01] bg-primary/[0.07] font-semibold text-foreground",
                                distance === 1 &&
                                  "opacity-80 blur-[0.2px] text-foreground/85",
                                distance >= 2 &&
                                  "opacity-45 blur-[0.8px] text-muted-foreground",
                                isSpinning &&
                                  distance === 0 &&
                                  "tracking-[0.01em]",
                              )}
                            >
                              <div className="min-w-0">
                                <p className="truncate">{song.title}</p>
                                <p className="truncate text-xs font-normal text-muted-foreground">
                                  {song.artist}
                                </p>
                              </div>
                              <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-primary/70">
                                {distance === 0 ? "NOW" : ""}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/80 px-6 text-center text-sm text-muted-foreground">
                    歌单加载后就可以开始摇啦。
                  </div>
                )}

                <div
                  className={cn(
                    "mt-4 rounded-2xl border border-border/65 bg-background/85 p-4 transition-all duration-300",
                    didLand &&
                      "animate-slot-land border-primary/30 shadow-lg shadow-primary/10",
                  )}
                >
                  <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                    {didLand ? "Result" : "Spotlight"}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                      {currentTrackSong?.title ?? "正在挑选中"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentTrackSong?.artist ?? "灵感马上就来"}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {didLand
                      ? "点这首歌怎么样？如果不满意，可以点击上方按钮再抽一次"
                      : "准备好就可以开始抽了。"}
                  </p>
                </div>
              </div>

              <div className="music-surface rounded-[20px] p-4 sm:rounded-[24px] sm:p-5">
                <SongRequestInstructions
                  markdown={songlistMarkdown}
                  isLoading={aboutSectionsLoading}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border/70 bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur sm:px-7 sm:py-4 sm:pb-4">
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                关闭
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
