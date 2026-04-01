import { createClient } from "@supabase/supabase-js";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type RecentTrack = {
  title: string;
  artist: string;
  songUrl: string;
  albumArt: string;
};

export type NowPlayingResult =
  | { isPlaying: false; recentTrack?: RecentTrack }
  | {
      isPlaying: true;
      title: string;
      artist: string;
      albumArt: string;
      songUrl: string;
      progress_ms: number;
      duration_ms: number;
    };

// Track history — survives across requests within the same server instance
let currentTrack: RecentTrack | null = null;
let previousTrack: RecentTrack | null = null;

// In-memory token cache — avoids redundant refresh calls within the same instance
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();

  cachedToken = (data.access_token as string) ?? null;
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  return cachedToken;
}

export async function getNowPlaying(): Promise<NowPlayingResult> {
  const accessToken = await getAccessToken();
  console.log("access token:", accessToken ? "exists" : "null");
  if (!accessToken) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log("spotify response status:", res.status);

  // 204 = nothing playing, 429 = rate limited, >400 = error
  if (res.status === 429) {
    return { isPlaying: false, recentTrack: currentTrack ?? undefined };
  }
  if (res.status === 204 || res.status > 400) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  const data = await res.json();
  console.log("spotify data is_playing:", data?.is_playing);
  console.log("currently_playing_type:", data?.currently_playing_type);

  if (data?.currently_playing_type !== "track" || !data?.item) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  const incoming: RecentTrack = {
    title: data.item.name,
    artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
    songUrl: data.item.external_urls.spotify,
    albumArt: data.item.album.images[0]?.url ?? "",
  };

  // Update track history when the song changes (covers playing and paused so we keep album art)
  if (currentTrack?.songUrl !== incoming.songUrl) {
    previousTrack = currentTrack;
    currentTrack = incoming;
  }

  if (!data.is_playing) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  // Record to Supabase (fire-and-forget, don't block the response)
  const trackId: string = data.item.id;
  const albumId: string = data.item.album.id;
  const albumName: string = data.item.album.name;

  void (async () => {
    try {
      const db = getServiceSupabase();
      await db.from("listening_history").insert({
        track_id: trackId,
        track_name: data.item.name,
        artist_name: incoming.artist,
        album_id: albumId,
        album_name: albumName,
        album_art: incoming.albumArt,
        song_url: incoming.songUrl,
      });
      const { data: existing } = await db
        .from("listening_stats")
        .select("play_count")
        .eq("track_id", trackId)
        .single();
      await db.from("listening_stats").upsert(
        {
          track_id: trackId,
          track_name: data.item.name,
          artist_name: incoming.artist,
          album_id: albumId,
          album_name: albumName,
          album_art: incoming.albumArt,
          song_url: incoming.songUrl,
          play_count: (existing?.play_count ?? 0) + 1,
          last_played_at: new Date().toISOString(),
        },
        { onConflict: "track_id" }
      );
    } catch {
      // Non-critical — silently ignore Supabase errors
    }
  })();

  return {
    isPlaying: true,
    title: data.item.name,
    artist: incoming.artist,
    albumArt: incoming.albumArt,
    songUrl: incoming.songUrl,
    progress_ms: data.progress_ms ?? 0,
    duration_ms: data.item.duration_ms,
  };
}
