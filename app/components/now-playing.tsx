"use client";

import Image from "next/image";
import { useNowPlaying } from "@/app/hooks/use-now-playing";

export default function NowPlaying() {
  const { data, displayItem, dotPlaying, slideClass } = useNowPlaying();

  if (!data) {
    return <span className="text-zinc-400 dark:text-zinc-600">Loading…</span>;
  }

  if (!displayItem) {
    return (
      <span className="text-zinc-400 dark:text-zinc-600">Not playing</span>
    );
  }

  return (
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
  );
}
