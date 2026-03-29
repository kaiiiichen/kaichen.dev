"use client";

import { useEffect, useRef, useState } from "react";
import type { NowPlayingResult } from "@/lib/spotify";

export type DisplayItem = {
  title: string;
  artist: string;
  songUrl: string;
  albumArt?: string;
} | null;

export type UseNowPlayingReturn = {
  data: NowPlayingResult | null;
  displayItem: DisplayItem;
  dotPlaying: boolean;
  slideClass: string;
  progress: number;
  pct: number;
};

export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function useNowPlaying(): UseNowPlayingReturn {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [displayItem, setDisplayItem] = useState<DisplayItem>(null);
  const [dotPlaying, setDotPlaying] = useState(false);
  const [slideClass, setSlideClass] = useState("");
  const fallbackFetchRef = useRef<() => void>(() => {});
  const prevUrlRef = useRef<string | null>(null);
  const slideTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Connect to SSE stream; auto-reconnects via EventSource default behaviour
  useEffect(() => {
    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      es = new EventSource("/api/spotify/stream");
      es.onmessage = (e) => {
        try {
          const d: NowPlayingResult = JSON.parse(e.data as string);
          setData(d);
          if (d.isPlaying) setProgress(d.progress_ms);
        } catch {
          // ignore malformed frames
        }
      };
      es.onerror = () => {
        es?.close();
        es = null;
        // Manual reconnect after 3 s (browser default is also ~3 s but we
        // want explicit control so we can clean up properly)
        retryTimer = setTimeout(connect, 3_000);
      };
    }

    connect();

    // Fallback: called when the progress ticker detects track end
    fallbackFetchRef.current = () => {
      fetch("/api/spotify/now-playing")
        .then((r) => r.json())
        .then((d: NowPlayingResult) => {
          setData(d);
          if (d.isPlaying) setProgress(d.progress_ms);
        })
        .catch(() => {});
    };

    return () => {
      es?.close();
      if (retryTimer !== null) clearTimeout(retryTimer);
    };
  }, []);

  // Sync display state when data changes
  useEffect(() => {
    if (!data) return;

    setDotPlaying(data.isPlaying);

    const nextItem: DisplayItem = data.isPlaying
      ? { title: data.title, artist: data.artist, songUrl: data.songUrl, albumArt: data.albumArt }
      : (data.recentTrack ?? null);

    if (!nextItem) {
      setDisplayItem(null);
      prevUrlRef.current = null;
      return;
    }

    if (prevUrlRef.current === nextItem.songUrl) return;

    const hadContent = prevUrlRef.current !== null;
    prevUrlRef.current = nextItem.songUrl;

    if (!hadContent) {
      setDisplayItem(nextItem);
      return;
    }

    slideTimers.current.forEach(clearTimeout);
    slideTimers.current = [];
    setSlideClass("slide-exit");
    slideTimers.current.push(
      setTimeout(() => {
        setDisplayItem(nextItem);
        setSlideClass("slide-enter");
        slideTimers.current.push(setTimeout(() => setSlideClass(""), 250));
      }, 200)
    );
  }, [data]);

  // Tick progress locally; refetch when track ends
  useEffect(() => {
    if (!data?.isPlaying) return;
    const { duration_ms } = data;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + 1000 >= duration_ms) {
          fallbackFetchRef.current();
          return duration_ms;
        }
        return p + 1000;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [data]);

  const pct =
    data?.isPlaying && data.duration_ms > 0
      ? Math.min((progress / data.duration_ms) * 100, 100)
      : 0;

  return { data, displayItem, dotPlaying, slideClass, progress, pct };
}
