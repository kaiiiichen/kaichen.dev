import AvatarCard from "./components/avatar-card";
import ListeningLine from "./components/listening-line";
import ListeningCard from "./components/listening-card";
import WeatherCard from "./components/weather-card";
import ProjectStars from "./components/project-stars";

const PROJECTS = [
  {
    name: "kaichen.dev",
    desc: "Personal website and digital identity system.",
    href: "https://github.com/kaiiiichen/kaichen.dev",
    repo: "kaiiiichen/kaichen.dev",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    name: "SUSTech Kai Notes",
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

export default function Home() {
  return (
    <div className="max-w-[1180px] mx-auto px-6 md:px-12 py-16 space-y-14">

      {/* ── Layer 1: Identity Row ───────────────────────────────── */}
      <div
        className="flex items-stretch gap-10 fade-up"
        style={{ animationDelay: "0ms" }}
      >
        {/* Photo in mag-card */}
        <div className="w-[40%] shrink-0 mag-card" style={{ padding: 0, minHeight: 320 }}>
          <AvatarCard
            src="/avatar.jpg"
            alt="Kai Chen"
            className="w-full h-full"
          />
        </div>

        {/* Name + content + social */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Identity */}
          <div>
            <h1
              style={{ fontFamily: "'Nunito'", fontWeight: 300, fontSize: 48, letterSpacing: "-0.02em", lineHeight: 1.1 }}
              className="text-zinc-900 dark:text-zinc-100"
            >
              Kai Chen{" "}
              <a
                href="https://www.givingwhatwecan.org/pledge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Giving What We Can"
                className="no-underline hover:opacity-70 transition-opacity duration-150"
              ><span style={{ fontSize: "0.75em" }}>🔸</span></a>
            </h1>
            <div style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 13, letterSpacing: "0.03em", lineHeight: 1.9 }} className="mt-2">
              <p className="text-zinc-500 dark:text-zinc-500">Visiting UC Berkeley 2026</p>
              <p className="text-zinc-500 dark:text-zinc-500">Maths at SUSTech · Fields Medal Honors Program</p>
            </div>
          </div>

          {/* Values */}
          <div style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 15, lineHeight: 1.9 }} className="text-zinc-700 dark:text-zinc-300">
            <p>Curious about everything, committed to a few things.</p>
            <p className="mt-1">Pledged to give 10% of my lifetime income — because some decisions are worth making early.</p>
          </div>

          {/* Divider */}
          <div style={{ width: 40, height: 1, margin: "0" }} className="bg-zinc-200 dark:bg-zinc-700" />

          {/* Personality / side */}
          <div style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 15, lineHeight: 1.9 }} className="text-zinc-700 dark:text-zinc-300">
            <p>Up before the city. Barely.</p>
            <p className="mt-1">Currently reading <a href="https://www.amazon.com/s?k=Thinking+Fast+and+Slow" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"><em>Thinking, Fast and Slow</em></a> and pretending I understand it.</p>
            <p className="mt-1"><ListeningLine /></p>
          </div>

          {/* Social links — icon row, pinned to bottom */}
          <div className="flex items-center gap-4 mt-auto">
            <a
              href="https://github.com/kaiiiichen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-zinc-700 dark:text-zinc-300 opacity-35 hover:opacity-100 transition-opacity duration-300 ease-out"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/kaiiiichen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-700 dark:text-zinc-300 opacity-35 hover:opacity-100 transition-opacity duration-300 ease-out"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="mailto:kaichen0728@gmail.com"
              aria-label="Email"
              className="text-zinc-700 dark:text-zinc-300 opacity-35 hover:opacity-100 transition-opacity duration-300 ease-out"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Layer 2: Status Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 fade-up" style={{ animationDelay: "60ms" }}>

        <div className="mag-card">
          <div className="mag-label">Listening</div>
          <ListeningCard />
        </div>

        <div className="mag-card">
          <div className="mag-label">Location</div>
          <WeatherCard />
        </div>
      </div>

      {/* ── Layer 3: Blog & Projects ────────────────────────────── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 fade-up"
        style={{ animationDelay: "120ms" }}
      >

        {/* Blog */}
        <div className="mag-card">
          <div className="mag-label">Blog</div>
          <p style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 14 }} className="text-zinc-300 dark:text-zinc-700">
            No posts yet.
          </p>
        </div>

        {/* Projects */}
        <div className="mag-card">
          <div className="mag-label">Projects</div>
          <div>
            {PROJECTS.map(({ name, desc, href, repo, stack }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-3 -mx-2 px-2 rounded-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all duration-150"
              >
                {/* Name row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="opacity-0 group-hover:opacity-100 text-[#C4894F] -translate-x-1 group-hover:translate-x-0 transition-all duration-150 text-xs shrink-0">
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
                  style={{ fontFamily: "'Bitter'", fontWeight: 400, fontSize: 11 }}
                  className="text-zinc-400 dark:text-zinc-500 mt-0.5 leading-snug pl-4"
                >
                  {desc}
                </p>

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-1 mt-1.5 pl-4">
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
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fade-up" style={{ animationDelay: "180ms" }}>
        <p style={{ fontFamily: "'Nunito'", fontWeight: 400, fontSize: 13 }} className="text-zinc-300 dark:text-zinc-700">
          © 2026 Kai Chen. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
