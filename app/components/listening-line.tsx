"use client";

import { useNowPlaying } from "@/app/hooks/use-now-playing";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function ListeningLine() {
  const { displayItem, dotPlaying } = useNowPlaying();

  if (!displayItem) {
    return <>Listening to whatever is playing right now.</>;
  }

  const title = truncate(displayItem.title, 30);

  return (
    <>
      Listening to{" "}
      <a
        href={displayItem.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-150"
      >
        <em>{title}</em>
        {displayItem.artist ? ` by ${displayItem.artist}` : ""}
      </a>
      {dotPlaying ? " right now." : " recently."}
    </>
  );
}
