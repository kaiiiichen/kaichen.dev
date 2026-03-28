"use client";

import { useEffect, useState } from "react";
import type { NowPlayingResult } from "@/lib/spotify";

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [progress, setProgress] = useState(0);

  // Poll API every 30s, seed local progress on each response
  useEffect(() => {
    const poll = () => {
      fetch("/api/spotify/now-playing")
        .then((res) => res.json())
        .then((d: NowPlayingResult) => {
          setData(d);
          if (d.isPlaying) setProgress(d.progress_ms);
        })
        .catch(() => setData({ isPlaying: false }));
    };

    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  // Tick progress locally every second
  useEffect(() => {
    if (!data?.isPlaying) return;
    const { duration_ms } = data;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 1000, duration_ms));
    }, 1000);
    return () => clearInterval(id);
  }, [data]);

  if (!data) {
    return <span className="text-zinc-400 dark:text-zinc-600">Loading…</span>;
  }

  if (!data.isPlaying) {
    return (
      <span className="text-zinc-400 dark:text-zinc-600">Not playing</span>
    );
  }

  const pct = Math.min((progress / data.duration_ms) * 100, 100);

  return (
    <div className="space-y-2">
      <span className="inline-flex items-center gap-2">
        <span className="relative inline-flex w-2 h-2 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: "#1DB954" }}
          />
          <span
            className="relative inline-flex w-2 h-2 rounded-full"
            style={{ backgroundColor: "#1DB954" }}
          />
        </span>
        <a
          href={data.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline underline-offset-4"
        >
          {data.title}
        </a>
        <span className="text-zinc-400 dark:text-zinc-600">{data.artist}</span>
      </span>

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
    </div>
  );
}
