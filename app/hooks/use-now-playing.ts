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
};

export function useNowPlaying(): UseNowPlayingReturn {
  const [data, setData] = useState<NowPlayingResult | null>(null);
  const [displayItem, setDisplayItem] = useState<DisplayItem>(null);
  const [dotPlaying, setDotPlaying] = useState(false);
  const [slideClass, setSlideClass] = useState("");
  const prevUrlRef = useRef<string | null>(null);
  const slideTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const poll = () => {
      fetch("/api/spotify/now-playing")
        .then((r) => r.json())
        .then((d: NowPlayingResult) => setData(d))
        .catch(() => setData({ isPlaying: false }));
    };

    poll();
    const id = setInterval(poll, 10_000);
    return () => clearInterval(id);
  }, []);

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

  return { data, displayItem, dotPlaying, slideClass };
}
