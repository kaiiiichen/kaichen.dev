"use client";
import { useEffect, useState } from "react";

type RepoMeta = {
  stars: number;
  archived: boolean;
  visibility?: "public" | "private";
};

export default function ProjectStars({ repo }: { repo: string }) {
  const [meta, setMeta] = useState<RepoMeta | null>(null);

  useEffect(() => {
    fetch(`/api/github/stars?repo=${encodeURIComponent(repo)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.stars === "number") {
          const vis = d.visibility;
          setMeta({
            stars: d.stars,
            archived: d.archived ?? false,
            ...(vis === "public" || vis === "private" ? { visibility: vis } : {}),
          });
        }
      })
      .catch(() => {});
  }, [repo]);

  if (meta === null) return null;

  const badgeClass =
    "px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500";

  return (
    <>
      {meta.visibility === "public" && (
        <span style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10 }} className={badgeClass}>
          public
        </span>
      )}
      {meta.visibility === "private" && (
        <span style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10 }} className={badgeClass}>
          private
        </span>
      )}
      {meta.archived && (
        <span style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10 }} className={badgeClass}>
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
