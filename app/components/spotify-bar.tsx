"use client";

import Image from "next/image";
import { useNowPlaying } from "@/app/hooks/use-now-playing";

export default function SpotifyBar() {
  const { data, displayItem, dotPlaying, slideClass } = useNowPlaying();

  if (!data || !displayItem) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[52px] flex items-center">
      <div className="max-w-2xl w-full mx-auto px-6">
        <div className={`flex items-center gap-2 min-w-0 ${slideClass}`}>
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
          <span className="text-[10px] font-medium tracking-widest text-zinc-400 dark:text-zinc-600 shrink-0 uppercase ml-1">
            Now Playing
          </span>
        </div>
      </div>
    </div>
  );
}
