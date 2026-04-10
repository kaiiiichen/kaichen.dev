"use client";
import { useNowPlaying } from "@/app/hooks/use-now-playing";

export default function ListeningCard() {
  const { displayItem, dotPlaying } = useNowPlaying();

  return (
    <div className="space-y-3">
      {displayItem ? (
        <a
          href={displayItem.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 items-center group/track"
        >
          {displayItem.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayItem.albumArt}
              alt={displayItem.title}
              style={{ width: 44, height: 44, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{ width: 44, height: 44, borderRadius: 2, flexShrink: 0 }}
              className="bg-zinc-200 dark:bg-zinc-700"
            />
          )}
          <div className="min-w-0 flex-1">
            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 19, lineHeight: 1.3 }}
              className="text-zinc-800 dark:text-zinc-200 truncate group-hover/track:text-[#C4894F] dark:group-hover/track:text-[#D9A870] transition-colors duration-150"
            >
              {displayItem.title}
            </p>
            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 11 }}
              className="text-zinc-400 dark:text-zinc-500 truncate mt-0.5"
            >
              {displayItem.artist}
            </p>
          </div>
        </a>
      ) : (
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 12 }}
          className="text-zinc-400 dark:text-zinc-500"
        >
          Nothing playing right now.
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full bg-[#C4894F] transition-opacity ${
            dotPlaying ? "opacity-60 animate-pulse" : "opacity-25"
          }`}
        />
        <span
          style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10 }}
          className="text-zinc-400 dark:text-zinc-600 uppercase tracking-widest"
        >
          {dotPlaying ? "now playing" : "last played"}
        </span>
      </div>
    </div>
  );
}
