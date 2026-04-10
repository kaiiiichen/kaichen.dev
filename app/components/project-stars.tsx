"use client";
import { useEffect, useState } from "react";

type RepoMeta = { stars: number; archived: boolean };

export default function ProjectStars({ repo }: { repo: string }) {
  const [meta, setMeta] = useState<RepoMeta | null>(null);

  useEffect(() => {
    fetch(`/api/github/stars?repo=${encodeURIComponent(repo)}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.stars === "number") {
          setMeta({ stars: d.stars, archived: d.archived ?? false });
        }
      })
      .catch(() => {});
  }, [repo]);

  if (meta === null) return null;

  return (
    <>
      {meta.archived && (
        <span
          style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10 }}
          className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
        >
          archived
        </span>
      )}
      <span className="flex items-center gap-0.5 text-zinc-400 dark:text-zinc-600">
        <span style={{ fontSize: 17, lineHeight: 1 }}>★</span>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }}>{meta.stars}</span>
      </span>
    </>
  );
}
