import Link from "next/link";
import { headers } from "next/headers";
import GitHubActivity from "./components/GitHubActivity";
import LocalTime from "./components/local-time";
import Weather from "./components/Weather";
import MouseHalo from "./components/mouse-halo";
import SpotifyCardHome from "./components/spotify-card-home";
import HomeNavClient from "./components/home-nav-client";
import MessageForm from "./components/Guestbook";

// ── Project data (source of truth for the home page) ─────────────────────────
const PROJECTS = [
  {
    name: "kaichen.dev",
    description:
      "Personal website and living digital identity system. Built with Next.js, Supabase, and a Railway-hosted Spotify proxy for real-time now-playing.",
    tags: ["Next.js", "TypeScript", "Supabase", "Railway"],
    github: "https://github.com/kaiiiichen/kaichen.dev",
    repo: "kaiiiichen/kaichen.dev",
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

const STATUS_STYLES: Record<string, string> = {
  active: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
  archived: "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600",
};

const COURSES = [
  { date: "Spring 26", title: "CS61A", desc: "Structure and Interpretation of Computer Programs" },
  { date: "Spring 26", title: "Data100", desc: "Principles and Techniques of Data Science" },
  { date: "Spring 26", title: "CogSci175", desc: "Mind, Machine and Meaning" },
];

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono)",
  fontSize: 11,
  letterSpacing: "0.1em",
};

// ── Page (async server component — fetches stars) ─────────────────────────────
export default async function Home() {
  // Fetch stars from the same contributions endpoint the projects page uses
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  let stars: Record<string, number> = {};
  try {
    const res = await fetch(`${protocol}://${host}/api/github/contributions`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      stars = data.stars ?? {};
    }
  } catch {
    // stars stay empty
  }

  return (
    <>
      <MouseHalo />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "5rem 3rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
      >
        {/* ── LEFT COLUMN (sticky) ──────────────────────────────── */}
        <aside style={{ position: "sticky", top: "5rem" }}>
          {/* Name */}
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontSize: 52,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            className="text-zinc-900 dark:text-zinc-100 mb-1"
          >
            Kai Chen
          </h1>
          <p
            style={{ fontFamily: "var(--font-instrument-serif)", fontSize: 20, fontStyle: "italic" }}
            className="text-zinc-400 dark:text-zinc-500 mb-3"
          >
            陈恺
          </p>

          {/* Tagline */}
          <p
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--accent)" }}
            className="mb-5"
          >
            Builder, tinkerer, sometimes writer.
          </p>

          {/* Bio */}
          <p
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, lineHeight: 1.75, maxWidth: 320 }}
            className="text-zinc-500 dark:text-zinc-400 mb-10"
          >
            I work on software and think about how technology shapes the way we
            pay attention. Based in Berkeley, CA.
          </p>

          {/* Anchor nav with IntersectionObserver */}
          <HomeNavClient />

          {/* Social links */}
          <div className="flex gap-5 mb-10">
            {[
              { href: "https://github.com/kaiiiichen", label: "GitHub" },
              { href: "https://linkedin.com/in/kaiiiichen", label: "LinkedIn" },
              { href: "mailto:kaichen0728@gmail.com", label: "Email" },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }}
                className="text-zinc-400 dark:text-zinc-500 hover:text-[var(--accent)] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Weather */}
          <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }} className="text-zinc-500 dark:text-zinc-400">
            <Weather />
          </div>
        </aside>

        {/* ── RIGHT COLUMN (scrollable) ─────────────────────────── */}
        <main className="space-y-20">

          {/* Currently thinking about */}
          <section
            style={{
              borderLeft: "2.5px solid var(--accent)",
              borderRadius: "0 8px 8px 0",
              padding: "1rem 1.25rem",
              background: "#e8f5f0",
            }}
            className="dark:bg-[#152620]"
          >
            <p style={{ ...LABEL_STYLE, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
              Currently Thinking About
            </p>
            <p
              style={{ fontFamily: "var(--font-instrument-serif)", fontSize: 19, fontStyle: "italic", lineHeight: 1.6, color: "#374151" }}
              className="dark:text-zinc-300"
            >
              AI governance, what it means to do research that matters.
            </p>
          </section>

          {/* ── ABOUT ─────────────────────────────────────────────── */}
          <section id="about" className="scroll-mt-24">
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
              About
            </p>
            <div
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, lineHeight: 1.85 }}
              className="text-zinc-600 dark:text-zinc-400 space-y-4"
            >
              <p>
                I&apos;m a visiting student at UC Berkeley, working at the intersection of
                software engineering and the social implications of AI. I build things
                to understand them.
              </p>
              <p>
                Previously at SUSTech (Shenzhen), studying computer science and
                mathematics. This site is where I keep notes on what I&apos;m building and
                thinking about.
              </p>
            </div>

            {/* Local time */}
            <div className="mt-6">
              <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-2">
                Local Time
              </p>
              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13 }} className="text-zinc-600 dark:text-zinc-400">
                <LocalTime />
              </div>
            </div>
          </section>

          {/* ── NOW PLAYING ───────────────────────────────────────── */}
          <section>
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-3">
              Now Playing
            </p>
            <SpotifyCardHome />
          </section>

          {/* ── FOCUS ─────────────────────────────────────────────── */}
          <section>
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
              Focus
            </p>
            <div className="space-y-1">
              {COURSES.map(({ date, title, desc }) => (
                <div
                  key={title}
                  className="group flex gap-6 px-2 py-2 rounded-md hover:bg-[rgba(45,140,120,0.04)] transition-colors duration-200"
                >
                  <span
                    style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, minWidth: 72 }}
                    className="text-zinc-400 dark:text-zinc-600 shrink-0 pt-0.5"
                  >
                    {date}
                  </span>
                  <div>
                    <p
                      style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14 }}
                      className="text-zinc-800 dark:text-zinc-200 font-medium group-hover:text-[var(--accent)] transition-colors duration-200"
                    >
                      {title}
                    </p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }} className="text-zinc-500">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── PROJECTS ──────────────────────────────────────────── */}
          <section id="projects" className="scroll-mt-24">
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-6">
              Projects
            </p>
            <div className="space-y-8">
              {PROJECTS.map((project) => {
                const repoShort = project.repo.split("/")[1];
                const starCount = stars[repoShort];
                return (
                  <div key={project.name} className="flex gap-4">
                    {/* Left: links + stars */}
                    <div className="w-20 shrink-0 pt-0.5 space-y-1">
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }}
                        className="block text-zinc-400 dark:text-zinc-600 hover:text-[var(--accent)] transition-colors"
                      >
                        GitHub ↗
                      </Link>
                      {starCount !== undefined && (
                        <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }} className="text-zinc-300 dark:text-zinc-700">
                          ★ {starCount}
                        </p>
                      )}
                    </div>
                    {/* Right: name + status + description + tags */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14 }} className="font-medium text-zinc-900 dark:text-zinc-100">
                          {project.name}
                        </h3>
                        <span
                          style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10 }}
                          className={`rounded px-2 py-px ${STATUS_STYLES[project.status]}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, lineHeight: 1.7 }} className="text-zinc-600 dark:text-zinc-400 mb-2">
                        {project.description}
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, letterSpacing: "0.08em" }}
                            className="uppercase text-zinc-400 dark:text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── GITHUB ────────────────────────────────────────────── */}
          <section>
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
              GitHub Activity
            </p>
            <GitHubActivity />
          </section>

          {/* ── GUESTBOOK ─────────────────────────────────────────── */}
          <section id="guestbook" className="scroll-mt-24">
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-2">
              Message
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14 }} className="text-zinc-500 dark:text-zinc-400 mb-6">
              Send me a note — I read every message.
            </p>
            <MessageForm />
          </section>

          {/* Footer */}
          <footer>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12 }} className="text-zinc-400 dark:text-zinc-600">
              Built with Next.js and Tailwind CSS. Deployed on Vercel.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
