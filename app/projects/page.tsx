import ProjectStars from "../components/project-stars";
import GitHubActivity from "../components/GitHubActivity";

const PROJECTS = [
  {
    name: "kaichen.dev",
    desc: "Personal website and digital identity system.",
    href: "https://github.com/kaiiiichen/kaichen.dev",
    repo: "kaiiiichen/kaichen.dev",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    name: "SUSTech-Kai-Notes",
    desc: "Open lecture notes for 20+ math and CS courses.",
    href: "https://github.com/kaiiiichen/SUSTech-Kai-Notes",
    repo: "kaiiiichen/SUSTech-Kai-Notes",
    stack: ["LaTeX"],
  },
  {
    name: "SudoSodoku",
    desc: "Terminal-style Sudoku for iOS. Minimalist, focus-driven.",
    href: "https://github.com/kaiiiichen/SudoSodoku",
    repo: "kaiiiichen/SudoSodoku",
    stack: ["Swift", "SwiftUI"],
  },
  {
    name: "kai-chen.xyz",
    desc: "Previous personal website, v1. Static.",
    href: "https://github.com/kaiiiichen/kai-chen.xyz",
    repo: "kaiiiichen/kai-chen.xyz",
    stack: ["HTML", "CSS"],
  },
];

export default function Projects() {
  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-12 py-16">

      {/* Header */}
      <div className="mb-12 fade-up" style={{ animationDelay: "0ms" }}>
        <h1
          style={{ fontFamily: "'Nunito'", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          className="text-zinc-900 dark:text-zinc-100 text-[36px] md:text-[48px]"
        >
          Projects
        </h1>
        <p
          style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14, lineHeight: 1.8 }}
          className="text-zinc-400 dark:text-zinc-600 mt-3"
        >
          Things I&apos;ve built, maintained, or archived with love.
        </p>
        <div className="mt-6 w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up" style={{ animationDelay: "60ms" }}>
        {PROJECTS.map(({ name, desc, href, repo, stack }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mag-card block group no-underline"
            style={{ textDecoration: "none" }}
          >
            {/* Name row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span
                className="opacity-0 group-hover:opacity-100 text-[#C4894F] dark:text-[#D9A870] -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-xs shrink-0"
              >
                ↗
              </span>
              <p
                style={{ fontFamily: "'Bitter'", fontWeight: 600, fontSize: 20, fontStyle: "italic" }}
                className="text-zinc-800 dark:text-zinc-200 group-hover:text-[#C4894F] dark:group-hover:text-[#D9A870] transition-colors duration-150"
              >
                {name}
              </p>
              <ProjectStars repo={repo} />
            </div>

            {/* Description */}
            <p
              style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13, lineHeight: 1.7 }}
              className="text-zinc-500 dark:text-zinc-500 mb-3 pl-4"
            >
              {desc}
            </p>

            {/* Footer: stack + GitHub */}
            <div className="flex items-center justify-between pl-4">
              <div className="flex flex-wrap gap-1">
                {stack.map((tag) => (
                  <span
                    key={tag}
                    style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 10 }}
                    className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span
                style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 11 }}
                className="text-zinc-300 dark:text-zinc-700 group-hover:text-[#C4894F] dark:group-hover:text-[#D9A870] transition-colors duration-150 shrink-0 ml-2"
              >
                GitHub ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* GitHub Activity */}
      <div className="mt-14 fade-up" style={{ animationDelay: "120ms" }}>
        <div className="mag-label">GitHub Activity</div>
        <div className="overflow-x-auto">
          <GitHubActivity />
        </div>
      </div>

    </div>
  );
}
