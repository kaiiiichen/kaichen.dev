const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

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

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  // Cache token in Next.js Data Cache for 50 minutes (tokens last 1 hour)
  // This survives across serverless cold starts on Vercel
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
    next: { revalidate: 3000 }, // 50 minutes
  });

  if (!res.ok) return null;
  const data = await res.json();

  return (data.access_token as string) ?? null;
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
