const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

// ── Token cache ──────────────────────────────────────────────────────────────
let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = data.access_token ?? null;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

// ── Spotify fetch ─────────────────────────────────────────────────────────────
let currentTrack = null;
let previousTrack = null;

async function fetchNowPlaying() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 429) {
    return { isPlaying: false, recentTrack: currentTrack ?? undefined };
  }
  if (res.status === 204 || res.status > 400) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  const data = await res.json();

  if (data?.currently_playing_type !== "track" || !data?.item) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  const incoming = {
    title: data.item.name,
    artist: data.item.artists.map((a) => a.name).join(", "),
    songUrl: data.item.external_urls.spotify,
    albumArt: data.item.album.images[0]?.url ?? "",
  };

  if (currentTrack?.songUrl !== incoming.songUrl) {
    previousTrack = currentTrack;
    currentTrack = incoming;
  }

  if (!data.is_playing) {
    return { isPlaying: false, recentTrack: currentTrack ?? previousTrack ?? undefined };
  }

  return {
    isPlaying: true,
    title: incoming.title,
    artist: incoming.artist,
    albumArt: incoming.albumArt,
    songUrl: incoming.songUrl,
    progress_ms: data.progress_ms ?? 0,
    duration_ms: data.item.duration_ms,
  };
}

// ── Polling loop ──────────────────────────────────────────────────────────────
let latestData = null;
const clients = new Set();

function broadcast() {
  if (!latestData) return;
  const msg = `data: ${JSON.stringify(latestData)}\n\n`;
  for (const res of clients) {
    res.write(msg);
  }
}

async function poll() {
  try {
    latestData = await fetchNowPlaying();
    broadcast();
  } catch (err) {
    console.error("[poll error]", err.message);
  }
}

// Fetch immediately on startup, then every 10 s
poll();
setInterval(poll, 1_000);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "https://kaichen.dev",
      "https://www.kaichen.dev",
      /^http:\/\/localhost(:\d+)?$/,
    ],
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/now-playing", (_req, res) => {
  res.json(latestData ?? { isPlaying: false });
});

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send current data immediately so the client doesn't wait up to 10 s
  if (latestData) {
    res.write(`data: ${JSON.stringify(latestData)}\n\n`);
  }

  clients.add(res);

  req.on("close", () => {
    clients.delete(res);
  });
});

app.listen(PORT, () => {
  console.log(`spotify-proxy listening on port ${PORT}`);
});
