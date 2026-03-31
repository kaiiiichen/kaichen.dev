"use client";

import { usePathname } from "next/navigation";
import SpotifyBar from "./spotify-bar";

export default function SpotifyBarWrapper() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <SpotifyBar />;
}
