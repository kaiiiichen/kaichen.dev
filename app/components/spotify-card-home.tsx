"use client";

import Image from "next/image";
import { useNowPlaying } from "@/app/hooks/use-now-playing";

export default function SpotifyCardHome() {
  const { data, displayItem, dotPlaying, slideClass } = useNowPlaying();

  return (
    <div
      style={{
        background: "white",
        border: "0.5px solid rgba(0,0,0,0.07)",
        borderRadius: 10,
        padding: "1rem",
        position: "relative",
      }}
      className="dark:!bg-[#12121a] dark:!border-white/[0.06]"
    >
      {!data || !displayItem ? (
        <p
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }}
          className="text-zinc-400"
        >
          Not playing
        </p>
      ) : (
        <div className={`flex items-center gap-3 ${slideClass}`}>
          {/* Album art — only shown when playing */}
          {data.isPlaying && displayItem.albumArt ? (
            <Image
              src={displayItem.albumArt}
              alt={displayItem.title}
              width={48}
              height={48}
              style={{ borderRadius: 6, flexShrink: 0 }}
            />
          ) : null}

          <div className="flex-1 min-w-0">
            {/* Dot + title */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative inline-flex w-2 h-2 shrink-0">
                <span
                  className="absolute inline-flex h-full w-full rounded-full animate-ping"
                  style={{
                    backgroundColor: "var(--accent)",
                    opacity: dotPlaying ? 0.6 : 0,
                    transition: "opacity 0.6s ease",
                  }}
                />
                <span
                  className="relative inline-flex w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: dotPlaying ? "var(--accent)" : "var(--dot-idle)",
                    transition: "background-color 0.6s ease",
                  }}
                />
              </span>
              <a
                href={displayItem.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, fontWeight: 500 }}
                className="text-zinc-900 dark:text-zinc-100 transition-colors truncate hover:opacity-70"
              >
                {displayItem.title}
              </a>
            </div>

            {/* Artist */}
            <p
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }}
              className="text-zinc-500 truncate"
            >
              {displayItem.artist}
            </p>
          </div>
        </div>
      )}
      {/* Apple Music logo */}
      <img
        src="/apple-music.svg"
        alt="Apple Music"
        width={20}
        height={20}
        style={{ position: "absolute", bottom: 10, right: 10 }}
      />
    </div>
  );
}
