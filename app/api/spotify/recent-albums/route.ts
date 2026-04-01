import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export type RecentAlbum = {
  albumId: string;
  albumName: string;
  artistName: string;
  albumArt: string;
  albumUrl: string;
};

export async function GET() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await db
    .from("listening_stats")
    .select("track_id, track_name, artist_name, album_id, album_name, album_art, song_url, play_count")
    .order("play_count", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Deduplicate by album_id — keep the track with highest play_count per album
  const seen = new Set<string>();
  const albums: RecentAlbum[] = [];

  for (const row of data ?? []) {
    if (seen.has(row.album_id)) continue;
    seen.add(row.album_id);
    albums.push({
      albumId: row.album_id,
      albumName: row.album_name,
      artistName: row.artist_name,
      albumArt: row.album_art,
      albumUrl: row.song_url,
    });
    if (albums.length >= 50) break;
  }

  return NextResponse.json({ albums }, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
  });
}
