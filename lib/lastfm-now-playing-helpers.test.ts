import { describe, expect, it } from "vitest";
import {
  isLastFmTrackPlaying,
  pickAlbumArtFromLastFmImages,
} from "@/lib/lastfm-now-playing-helpers";

describe("lastfm now-playing helpers", () => {
  it("treats explicit now playing or a scrobble within 5 minutes as playing", () => {
    const now = new Date("2026-01-01T12:00:00.000Z");
    expect(isLastFmTrackPlaying({ "@attr": { nowplaying: "true" } }, now)).toBe(true);
    const uts = String(Math.floor(now.getTime() / 1000) - 60);
    expect(isLastFmTrackPlaying({ date: { uts } }, now)).toBe(true);
  });

  it("picks best image size and strips Last.fm placeholder art", () => {
    const hash = "2a96cbd8b46e442fc41c2b86b821562f";
    expect(
      pickAlbumArtFromLastFmImages([
        { size: "medium", "#text": "https://ok/m.jpg" },
        { size: "extralarge", "#text": `https://lastfm.freetls.fastly.net/i/u/300x300/${hash}` },
      ])
    ).toBe("");
    expect(
      pickAlbumArtFromLastFmImages([
        { size: "small", "#text": "https://x/s.jpg" },
        { size: "large", "#text": "https://x/l.jpg" },
      ])
    ).toBe("https://x/l.jpg");
  });
});
