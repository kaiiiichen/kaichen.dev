"use client";

import Image from "next/image";
import { useNowPlaying } from "@/app/hooks/use-now-playing";

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function NowPlaying() {
  const { data, displayItem, dotPlaying, slideClass, progress, pct } =
    useNowPlaying();

  if (!data) {
    return <span className="text-zinc-400 dark:text-zinc-600">Loading…</span>;
  }

  if (!displayItem) {
    return (
      <span className="text-zinc-400 dark:text-zinc-600">Not playing</span>
    );
  }

  return (
    <div className="space-y-2">
      <span className={`inline-flex items-center gap-2 ${slideClass}`}>
        {displayItem.albumArt && (
          <Image
            src={displayItem.albumArt}
            alt={displayItem.title}
            width={32}
            height={32}
            className="shrink-0 rounded-[4px]"
          />
        )}
        <span className="relative inline-flex w-2 h-2 shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full animate-ping"
            style={{
              backgroundColor: "#1DB954",
              opacity: dotPlaying ? 0.75 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
          <span
            className="relative inline-flex w-2 h-2 rounded-full"
            style={{
              backgroundColor: dotPlaying ? "#1DB954" : "var(--dot-idle)",
              transition: "background-color 0.6s ease",
            }}
          />
        </span>
        <a
          href={displayItem.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline underline-offset-4"
        >
          {displayItem.title}
        </a>
        <span className="text-zinc-400 dark:text-zinc-600">
          {displayItem.artist}
        </span>
      </span>

      {data.isPlaying ? (
        <div className="space-y-1">
          <div className="h-0.5 w-48 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${pct}%`, backgroundColor: "#1DB954" }}
            />
          </div>
          <div className="flex gap-1 font-mono text-xs text-zinc-400 dark:text-zinc-600">
            <span>{formatMs(progress)}</span>
            <span>/</span>
            <span>{formatMs(data.duration_ms)}</span>
          </div>
        </div>
      ) : (
        <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
          last played
        </p>
      )}
    </div>
  );
}
