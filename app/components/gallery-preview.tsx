"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RecentAlbum } from "@/app/api/spotify/recent-albums/route";

export default function GalleryPreview() {
  const [albums, setAlbums] = useState<RecentAlbum[]>([]);

  useEffect(() => {
    fetch("/api/spotify/recent-albums")
      .then((r) => r.json())
      .then((d) => { if (d.albums) setAlbums(d.albums.slice(0, 5)); })
      .catch(() => {});
  }, []);

  if (albums.length === 0) return null;

  return (
    <Link
      href="/gallery"
      className="group flex items-center gap-1 w-fit px-1 py-1 -mx-1 rounded-md hover:bg-[rgba(45,140,120,0.04)] [transition:background-color_0.3s_ease]"
    >
      {albums.map((album) => (
        <Image
          key={album.albumUrl}
          src={album.albumArt}
          alt={album.albumName}
          width={32}
          height={32}
          style={{ borderRadius: 4, flexShrink: 0 }}
          className="opacity-50 group-hover:opacity-100 [transition:opacity_0.6s_ease]"
        />
      ))}
    </Link>
  );
}
