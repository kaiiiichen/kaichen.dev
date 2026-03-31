import { NextResponse } from "next/server";

export type RecentAlbum = {
  albumId: string;
  albumName: string;
  artistName: string;
  albumArt: string;
  albumUrl: string;
};

export async function GET() {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "token error" }, { status: 500 });
  }

  const { access_token } = await tokenRes.json();

  const res = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "spotify error" }, { status: 502 });
  }

  const data = await res.json();
  const seen = new Set<string>();
  const albums: RecentAlbum[] = [];

  for (const item of data.items ?? []) {
    const album = item.track?.album;
    if (!album) continue;
    if (seen.has(album.id)) continue;
    seen.add(album.id);
    albums.push({
      albumId: album.id,
      albumName: album.name,
      artistName: item.track.artists
        .map((a: { name: string }) => a.name)
        .join(", "),
      albumArt: album.images[0]?.url ?? "",
      albumUrl: album.external_urls?.spotify ?? "",
    });
    if (albums.length >= 50) break;
  }

  return NextResponse.json({ albums }, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
  });
}
