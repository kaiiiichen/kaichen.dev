const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

// Module-level cache — survives across requests within the same server instance
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

async function getAccessToken(): Promise<string | null> {
  // Return cached token if it has more than 60s left
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
  });

  if (!res.ok) return null;
  const data = await res.json();

  cachedToken = (data.access_token as string) ?? null;
  // Spotify returns expires_in in seconds (typically 3600)
  tokenExpiresAt = Date.now() + (data.expires_in as number) * 1000;

  return cachedToken;
}

export type NowPlayingResult =
  | { isPlaying: false }
  | {
      isPlaying: true;
      title: string;
      artist: string;
      albumArt: string;
      songUrl: string;
      progress_ms: number;
      duration_ms: number;
    };

export async function getNowPlaying(): Promise<NowPlayingResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { isPlaying: false };

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // 204 = nothing playing, >400 = error
  if (res.status === 204 || res.status > 400) return { isPlaying: false };

  const data = await res.json();

  if (!data?.is_playing || data?.currently_playing_type !== "track") {
    return { isPlaying: false };
  }

  return {
    isPlaying: true,
    title: data.item.name,
    artist: data.item.artists
      .map((a: { name: string }) => a.name)
      .join(", "),
    albumArt: data.item.album.images[0]?.url ?? "",
    songUrl: data.item.external_urls.spotify,
    progress_ms: data.progress_ms ?? 0,
    duration_ms: data.item.duration_ms,
  };
}
