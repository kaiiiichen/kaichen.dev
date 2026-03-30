"use client";

import Image from "next/image";
import { useNowPlaying, formatMs } from "@/app/hooks/use-now-playing";

export default function SpotifyCardHome() {
  const { data, displayItem, dotPlaying, slideClass, progress, pct } =
    useNowPlaying();

  return (
    <div
      style={{
        background: "white",
        border: "0.5px solid rgba(0,0,0,0.07)",
        borderRadius: 10,
        padding: "1rem",
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
        <div className={`flex items-start gap-3 ${slideClass}`}>
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
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 15,
                  fontWeight: 500,
                }}
                className="text-zinc-900 dark:text-zinc-100 transition-colors truncate hover:opacity-70"
              >
                {displayItem.title}
              </a>
            </div>

            {/* Artist */}
            <p
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }}
              className="text-zinc-500 truncate mb-2"
            >
              {displayItem.artist}
            </p>

            {/* Progress bar (playing only) */}
            {data.isPlaying ? (
              <div>
                <div
                  className="h-[3px] rounded-full mb-1"
                  style={{ background: "#e5e7eb" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
                  />
                </div>
                <div
                  className="flex justify-between"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: 11,
                  }}
                >
                  <span className="text-zinc-400">{formatMs(progress)}</span>
                  <span className="text-zinc-400">
                    {formatMs(data.duration_ms)}
                  </span>
                </div>
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 11,
                }}
                className="text-zinc-400"
              >
                last played
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
