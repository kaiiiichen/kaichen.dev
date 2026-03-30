import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects — Kai Chen",
};

const projects = [
  {
    name: "kaichen.dev",
    description:
      "Personal website and living digital identity system. Built with Next.js, Supabase, and a Railway-hosted Spotify proxy for real-time now-playing.",
    tags: ["Next.js", "TypeScript", "Supabase", "Railway"],
    github: "https://github.com/kaiiiichen/kaichen-dev",
    repo: "kaiiiichen/kaichen-dev",
    demo: "https://kaichen.dev",
    status: "active",
  },
  {
    name: "SUSTech Kai Notes",
    description:
      "A personal notes initiative covering math and CS courses at SUSTech, inspired by Cambridge Notes. 20+ courses from 2024–2025.",
    tags: ["Math", "CS", "Open Source"],
    github: "https://github.com/kaiiiichen/SUSTech-Kai-Notes",
    repo: "kaiiiichen/SUSTech-Kai-Notes",
    status: "active",
  },
  {
    name: "SudoSodoku",
    description:
      "A terminal-style Sudoku experience for iOS. Minimalist, focus-driven, built for logical purists who want the Linux terminal aesthetic on their iPhone.",
    tags: ["iOS", "Swift", "Game"],
    github: "https://github.com/kaiiiichen/SudoSodoku",
    repo: "kaiiiichen/SudoSodoku",
    status: "active",
  },
  {
    name: "kai-chen.xyz",
    description: "Previous personal website, v1. Static.",
    tags: ["Web", "Personal"],
    github: "https://github.com/kaiiiichen/kai-chen.xyz",
    repo: "kaiiiichen/kai-chen.xyz",
    status: "archived",
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
  archived: "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600",
};

export default async function Projects() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  let stars: Record<string, number> = {};
  try {
    const res = await fetch(
      `${protocol}://${host}/api/github/contributions`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      stars = data.stars ?? {};
    }
  } catch {
    // stars stay empty; counts simply won't render
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl font-bold mb-4 tracking-tight">
        Projects
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-12 leading-relaxed">
        Things I&apos;ve built.
      </p>

      <div className="space-y-10">
        {projects.map((project) => (
          <div key={project.name} className="flex gap-4">
            <div className="w-24 shrink-0 pt-0.5 space-y-1">
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                GitHub ↗
              </Link>
              {"demo" in project && project.demo && (
                <Link
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Demo ↗
                </Link>
              )}
              {stars[project.repo.split("/")[1]] !== undefined && (
                <p className="font-mono text-xs text-zinc-300 dark:text-zinc-700">
                  ★ {stars[project.repo.split("/")[1]]}
                </p>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {project.name}
                </h2>
                <span
                  className={`font-mono rounded text-[11px] px-2 py-px ${statusStyles[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                {project.description}
              </p>
              <div className="flex gap-3 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs text-zinc-400 dark:text-zinc-600 uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
