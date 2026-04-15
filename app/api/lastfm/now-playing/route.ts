import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { NowPlayingResult } from "@/lib/now-playing";
import {
  isLastFmTrackPlaying,
  pickAlbumArtFromLastFmImages,
  type LastFmImageEntry,
} from "@/lib/lastfm-now-playing-helpers";

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getLastPlayedFromDb() {
  try {
    const db = getServiceSupabase();
    const { data } = await db
      .from("listening_stats")
      .select("track_name, artist_name, album_art, song_url")
      .order("last_played_at", { ascending: false })
      .limit(1)
      .single();
    if (!data) return undefined;
    return {
      title: data.track_name,
      artist: data.artist_name,
      albumArt: data.album_art,
      songUrl: data.song_url,
    };
  } catch {
    return undefined;
  }
}

// In-memory fallback — survives across requests within the same server instance
let lastKnownTrack: { title: string; artist: string; albumArt: string; songUrl: string } | null = null;

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY;

  const notPlayingResponse = async (): Promise<NowPlayingResult> => ({
    isPlaying: false,
    recentTrack: lastKnownTrack ?? (await getLastPlayedFromDb()),
  });

  if (!apiKey) {
    return NextResponse.json(await notPlayingResponse(), {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" },
    });
  }

  let res: Response;
  try {
    res = await fetch(
      `${LASTFM_API_URL}?method=user.getrecenttracks&user=kaiiiichen&api_key=${apiKey}&format=json&limit=1`,
      { cache: "no-store" }
    );
  } catch {
    return NextResponse.json(await notPlayingResponse(), {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" },
    });
  }

  if (!res.ok) {
    return NextResponse.json(await notPlayingResponse(), {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" },
    });
  }

  const json = await res.json();
  const tracks = json?.recenttracks?.track;
  if (!tracks || tracks.length === 0) {
    return NextResponse.json(await notPlayingResponse(), {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" },
    });
  }

  const track = tracks[0];

  const isPlaying: boolean = isLastFmTrackPlaying(track, new Date());

  const title: string = track.name ?? "";
  const artist: string = track.artist?.["#text"] ?? track.artist ?? "";
  const album: string = track.album?.["#text"] ?? "";
  const images: LastFmImageEntry[] = track.image || [];
  let albumArt: string = pickAlbumArtFromLastFmImages(images);

  // Fallback: fetch album art from iTunes Search API
  if (!albumArt) {
    try {
      const itunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${title}`)}&media=music&limit=1`,
        { cache: "no-store" }
      );
      if (itunesRes.ok) {
        const itunesData = await itunesRes.json();
        const art100: string = itunesData?.results?.[0]?.artworkUrl100 ?? "";
        if (art100) albumArt = art100.replace("100x100", "600x600");
      }
    } catch {
      // Non-critical
    }
  }

  const songUrl = `https://music.apple.com/search?term=${encodeURIComponent(`${title} ${artist}`)}`;

  lastKnownTrack = { title, artist, albumArt, songUrl };

  if (!isPlaying) {
    return NextResponse.json(
      { isPlaying: false, recentTrack: { title, artist, albumArt, songUrl } } satisfies NowPlayingResult,
      { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" } }
    );
  }

  // Fire-and-forget Supabase write
  const trackId: string = track.mbid || `${artist}::${title}`;
  const albumId: string = track.album?.mbid || `album::${artist}::${album}`;

  void (async () => {
    try {
      const db = getServiceSupabase();
      await db.from("listening_history").insert({
        track_id: trackId,
        track_name: title,
        artist_name: artist,
        album_id: albumId,
        album_name: album,
        album_art: albumArt,
        song_url: songUrl,
      });
      const { data: existing } = await db
        .from("listening_stats")
        .select("play_count")
        .eq("track_id", trackId)
        .single();
      await db.from("listening_stats").upsert(
        {
          track_id: trackId,
          track_name: title,
          artist_name: artist,
          album_id: albumId,
          album_name: album,
          album_art: albumArt,
          song_url: songUrl,
          play_count: (existing?.play_count ?? 0) + 1,
          last_played_at: new Date().toISOString(),
        },
        { onConflict: "track_id" }
      );
    } catch {
      // Non-critical
    }
  })();

  return NextResponse.json(
    {
      isPlaying: true,
      title,
      artist,
      albumArt,
      songUrl,
      progress_ms: 0,
      duration_ms: 0,
    } satisfies NowPlayingResult,
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5" } }
  );
}
