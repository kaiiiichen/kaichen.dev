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
