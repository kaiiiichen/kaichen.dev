"use client";

import Image from "next/image";
import { useNowPlaying, formatMs } from "@/app/hooks/use-now-playing";

export default function SpotifyBar() {
  const { data, displayItem, dotPlaying, slideClass, progress, pct } =
    useNowPlaying();

  // Hide bar until there's something to show
  if (!data || !displayItem) return null;

  const isPlaying = data.isPlaying;
  const duration = isPlaying ? data.duration_ms : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[52px] flex items-center">
      <div className="max-w-2xl w-full mx-auto px-6 flex items-center gap-6">
        {/* Left: dot + title + artist */}
        <div
          className={`flex items-center gap-2 min-w-0 flex-1 ${slideClass}`}
        >
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
          {displayItem.albumArt && (
            <Image
              src={displayItem.albumArt}
              alt={displayItem.title}
              width={20}
              height={20}
              className="shrink-0 rounded-[3px]"
            />
          )}
          <a
            href={displayItem.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm truncate flex-1 min-w-0 hover:underline underline-offset-4"
          >
            {displayItem.title}
          </a>
          <span className="text-sm text-zinc-400 dark:text-zinc-600 truncate shrink-0">
            {displayItem.artist}
          </span>
        </div>

        {/* Center: progress bar */}
        <div className="w-[120px] shrink-0 h-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${pct}%`,
              backgroundColor: "#1DB954",
            }}
          />
        </div>

        {/* Right: time */}
        <div className="font-mono text-xs text-zinc-400 dark:text-zinc-600 shrink-0 w-20 text-right">
          {isPlaying ? (
            <>
              {formatMs(progress)}
              <span className="mx-1">/</span>
              {formatMs(duration)}
            </>
          ) : (
            <span>last played</span>
          )}
        </div>
      </div>
    </div>
  );
}
