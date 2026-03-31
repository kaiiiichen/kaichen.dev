"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { RecentAlbum } from "@/app/api/spotify/recent-albums/route";

export default function GalleryClient() {
  const [albums, setAlbums] = useState<RecentAlbum[]>([]);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/spotify/recent-albums")
      .then((r) => r.json())
      .then((d) => { if (d.albums) setAlbums(d.albums); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!row1) return;

    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = window.scrollY / maxScroll;

      // Row1: left → right (translateX goes 0 → -maxOffset)
      const max1 = Math.max(0, row1.scrollWidth - window.innerWidth);
      row1.style.transform = `translateX(${-progress * max1}px)`;

      // Row2: right → left (translateX goes -maxOffset → 0)
      if (row2) {
        const max2 = Math.max(0, row2.scrollWidth - window.innerWidth);
        row2.style.transform = `translateX(${-(1 - progress) * max2}px)`;
      }
    };

    // Row2 initial position: show right edge
    const initRow2 = () => {
      if (!row2) return;
      const max2 = Math.max(0, row2.scrollWidth - window.innerWidth);
      row2.style.transform = `translateX(${-max2}px)`;
    };

    initRow2();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { initRow2(); onScroll(); });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", initRow2);
    };
  }, [albums]);

  const row1 = albums.slice(0, 25);
  const row2 = albums.slice(25);

  return (
    <div style={{ height: "300vh" }} className="bg-[#f5f5f0] dark:bg-[#0a0a0a]">
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className="flex flex-col justify-center"
      >
        {/* Top-left: title */}
        <div style={{ position: "absolute", top: "2rem", left: "3rem" }}>
          <h1
            style={{ fontFamily: "var(--font-instrument-serif)", fontSize: 36, fontWeight: 400, lineHeight: 1.1, marginBottom: 4 }}
            className="text-zinc-900 dark:text-zinc-100"
          >
            Listening
          </h1>
          <p
            style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}
            className="text-zinc-400 dark:text-zinc-600"
          >
            Albums · Recently played
          </p>
        </div>

        {/* Top-right: back */}
        <div style={{ position: "absolute", top: "2rem", right: "3rem" }}>
          <Link
            href="/"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }}
            className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-200"
          >
            ← back
          </Link>
        </div>

        {/* Album rows */}
        <div className="flex flex-col gap-6">
          {row1.length > 0 && (
            <div
              ref={row1Ref}
              style={{ display: "flex", gap: 16, paddingLeft: "3rem", paddingRight: "3rem", willChange: "transform" }}
            >
              {row1.map((album) => <AlbumCard key={album.albumId} album={album} />)}
            </div>
          )}
          {row2.length > 0 && (
            <div
              ref={row2Ref}
              style={{ display: "flex", gap: 16, paddingLeft: "3rem", paddingRight: "3rem", willChange: "transform" }}
            >
              {row2.map((album) => <AlbumCard key={album.albumId} album={album} />)}
            </div>
          )}
        </div>

        {/* Bottom-left: hint */}
        <p
          style={{ position: "absolute", bottom: "2rem", left: "3rem", fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}
          className="text-zinc-300 dark:text-zinc-700"
        >
          scroll to explore
        </p>
      </div>
    </div>
  );
}

function AlbumCard({ album }: { album: RecentAlbum }) {
  return (
    <a href={album.albumUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, display: "block" }}>
      <div style={{ width: 180 }}>
        {album.albumArt ? (
          <Image
            src={album.albumArt}
            alt={album.albumName}
            width={180}
            height={180}
            style={{ borderRadius: 4, display: "block", transition: "transform 0.2s ease" }}
            className="hover:scale-[1.03]"
          />
        ) : (
          <div style={{ width: 180, height: 180, borderRadius: 4 }} className="bg-zinc-200 dark:bg-zinc-800" />
        )}
        <p
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, marginTop: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}
          className="text-zinc-900 dark:text-zinc-100"
        >
          {album.albumName}
        </p>
        <p
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}
          className="text-zinc-500 dark:text-zinc-500"
        >
          {album.artistName}
        </p>
      </div>
    </a>
  );
}
