export type LastFmImageEntry = { size: string; "#text": string };

export type LastFmTrackPlayingInput = {
  "@attr"?: { nowplaying?: string };
  date?: { uts?: string };
};

const PLACEHOLDER_HASH = "2a96cbd8b46e442fc41c2b86b821562f";

const PLAYING_WINDOW_MS = 5 * 60 * 1000;

/** Last.fm "now playing" OR scrobbled within the last 5 minutes (same window as route). */
export function isLastFmTrackPlaying(track: LastFmTrackPlayingInput, now: Date): boolean {
  const isNowPlaying = track["@attr"]?.nowplaying === "true";
  const lastScrobbleTime = track.date?.uts ? parseInt(track.date.uts, 10) * 1000 : 0;
  const isRecentlyPlayed = lastScrobbleTime > now.getTime() - PLAYING_WINDOW_MS;
  return isNowPlaying || isRecentlyPlayed;
}

/** Picks best Last.fm image size and strips known placeholder art URL. */
export function pickAlbumArtFromLastFmImages(images: LastFmImageEntry[] | undefined): string {
  let albumArt =
    images?.find((i) => i.size === "extralarge")?.["#text"] ||
    images?.find((i) => i.size === "large")?.["#text"] ||
    images?.find((i) => i.size === "medium")?.["#text"] ||
    "";
  if (albumArt.includes(PLACEHOLDER_HASH)) albumArt = "";
  return albumArt;
}
