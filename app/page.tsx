import Link from "next/link";
import { headers } from "next/headers";
import GitHubActivity from "./components/GitHubActivity";
import Weather from "./components/Weather";
import MouseHalo from "./components/mouse-halo";
import SpotifyCardHome from "./components/spotify-card-home";
import HomeNavClient from "./components/home-nav-client";
import MessageForm from "./components/Guestbook";
import GalleryPreview from "./components/gallery-preview";

// ── Project data (source of truth for the home page) ─────────────────────────
const PROJECTS = [
  {
    name: "kaichen.dev",
    description:
      "Personal website and living digital identity system. Built with Next.js, Supabase, and real-time Spotify integration.",
    tags: ["Next.js", "TypeScript", "Supabase", "Vercel"],
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
  { date: "Spring 26", title: "CS61A", desc: "Structure and Interpretation of Computer Programs", url: "https://cs61a.org/" },
  { date: "Spring 26", title: "Data100", desc: "Principles and Techniques of Data Science", url: "https://ds100.org/sp26/" },
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

      <div className="max-w-[1180px] mx-auto px-6 py-12 md:px-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
        {/* ── LEFT COLUMN (sticky) ──────────────────────────────── */}
        <aside className="md:sticky md:top-20">
          {/* Name */}
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            className="text-[40px] md:text-[52px] text-zinc-900 dark:text-zinc-100 mb-1"
          >
            Kai Chen
          </h1>
          <p
            style={{ fontFamily: "var(--font-instrument-serif)", fontSize: 20 }}
            className="text-zinc-400 dark:text-zinc-500 mb-3"
          >
            陈恺
          </p>

          {/* Tagline */}
          <p
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--accent)" }}
            className="mb-3"
          >
            Builder, tinkerer, sometimes writer.
          </p>

          {/* Bio */}
          <p
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, lineHeight: 1.75, maxWidth: 300 }}
            className="text-zinc-500 dark:text-zinc-400 mb-5"
          >
            I work on software and think about how technology could do the most good.
          </p>

          {/* Social links */}
          <div className="flex gap-5 mb-4">
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
                className="text-zinc-400 dark:text-zinc-500 hover:text-[#2d8c78] dark:text-[#3aaa90] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Weather */}
          <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13 }} className="text-zinc-500 dark:text-zinc-400 mb-8">
            <Weather />
          </div>

          {/* Anchor nav with IntersectionObserver */}
          <HomeNavClient />

          {/* Now Playing */}
          <div className="mb-6">
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-3">
              Now Playing
            </p>
            <SpotifyCardHome />
          </div>

          {/* Gallery */}
          <div>
            <Link
              href="/gallery"
              style={LABEL_STYLE}
              className="uppercase text-zinc-400 dark:text-zinc-600 hover:text-[#2d8c78] dark:text-[#3aaa90] [transition:color_0.15s_ease] mb-3 block"
            >
              Gallery
            </Link>
            <GalleryPreview />
          </div>
        </aside>

        {/* ── RIGHT COLUMN (scrollable) ─────────────────────────── */}
        <main className="space-y-20">

          {/* Currently thinking about */}
          <section
            style={{
              borderRadius: "0 8px 8px 0",
              padding: "1rem 1.25rem",
            }}
            className="
              bg-[#e8f5f0] border-l-[2.5px] border-[var(--accent)]
              dark:bg-[#0a1a14] dark:border-[#1a4a3a]
            "
          >
            <p
              style={{ ...LABEL_STYLE, textTransform: "uppercase", marginBottom: 8 }}
              className="text-[var(--accent)] dark:text-[#4a9a7a]"
            >
              Currently Thinking About
            </p>
            <p
              style={{ fontFamily: "var(--font-instrument-serif)", fontSize: 19, fontStyle: "italic", lineHeight: 1.6, color: "#374151" }}
              className="dark:text-zinc-400"
            >
              How data shapes who gets seen, who gets heard, and who gets left out.
            </p>
          </section>

          {/* ── ABOUT ─────────────────────────────────────────────── */}
          <section id="about" className="scroll-mt-24 space-y-8">
            {/* Background */}
            <div>
              <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
                About
              </p>
              <p
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, lineHeight: 1.85 }}
                className="text-zinc-600 dark:text-zinc-400"
              >
                Mathematics major (Fields Medal
                Honors Program) at Southern University of Science and
                Technology (SUSTech), currently visiting UC Berkeley (2026).
                Previously attended a summer program in Deep
                Unsupervised Learning at the University of Oxford (2025).
              </p>
            </div>

            {/* Experience */}
            <div id="experience" className="scroll-mt-24">
              <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
                Experience
              </p>
              <div className="space-y-3">
                {(() => {
                  const SUSTECH = "https://www.sustech.edu.cn/";
                  const linkCls = "no-underline hover:text-[#2d8c78] dark:text-[#3aaa90] transition-colors duration-150";
                  const expItems = [
                    { role: "Member", org: "Project Reboot", period: "2026–present", url: "https://www.projectreboot.club/" },
                    { role: "Member", org: "Effective Altruism at UC Berkeley", period: "2026–present", url: "https://eaberkeley.com/" },
                    { role: "Peer Mentor", org: "Southern University of Science and Technology", period: "2024–2025", url: SUSTECH },
                    { role: "President", org: "SUSTech Psychology Society", period: "2024–2025" },
                    { role: "Teaching Assistant", org: "Lingnan University", period: "2024", url: "https://www.ln.edu.hk/" },
                    { role: "Student Organization Coordinator", org: "Zhicheng College, SUSTech", period: "2023–2024" },
                  ];
                  const orgCls = "transition-colors duration-150";
                  const renderOrg = (item: { org: string; url?: string }) => {
                    if (item.url) return <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkCls}>{item.org}</a>;
                    if (!item.org.includes("SUSTech")) return <span className={orgCls}>{item.org}</span>;
                    const parts = item.org.split("SUSTech");
                    return <span className={orgCls}>{parts.map((part, i) => (
                      <span key={i}>{part}{i < parts.length - 1 && <a href={SUSTECH} target="_blank" rel="noopener noreferrer" className={linkCls}>SUSTech</a>}</span>
                    ))}</span>;
                  };
                  return expItems.map((item) => (
                    <div key={`${item.role}-${item.org}`} className="group flex gap-4 px-2 py-1.5 rounded-md hover:bg-[rgba(45,140,120,0.04)] transition-colors duration-150 ease">
                      <span
                        style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, minWidth: 80 }}
                        className="text-zinc-400 dark:text-zinc-600 shrink-0 pt-0.5"
                      >
                        {item.period}
                      </span>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, lineHeight: 1.7 }} className="text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium text-[#2d8c78] dark:text-[#3aaa90]">{item.role}</span>
                        {", "}
                        {renderOrg(item)}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Volunteering */}

            <div id="volunteering" className="scroll-mt-24">
              <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
                Volunteering
              </p>
              <div className="space-y-3">
                {[
                  { role: "Member #10986", org: "Giving What We Can", period: "2026–present", url: "https://www.givingwhatwecan.org/" },
                  { role: "First Aider", org: "SUSTech Emergency Rescue Association", period: "2023–2025" },
                ].map((item) => (
                  <div key={`${item.role}-${item.org}`} className="group flex gap-4 px-2 py-1.5 rounded-md hover:bg-[rgba(45,140,120,0.04)] transition-colors duration-150 ease">
                    <span
                      style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, minWidth: 80 }}
                      className="text-zinc-400 dark:text-zinc-600 shrink-0 pt-0.5"
                    >
                      {item.period}
                    </span>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, lineHeight: 1.7 }} className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-[#2d8c78] dark:text-[#3aaa90]">{item.role}</span>
                      {", "}
                      {"url" in item && item.url
                        ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-[#2d8c78] dark:text-[#3aaa90] transition-colors duration-150">{item.org}</a>
                        : <span>{item.org}</span>
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FOCUS ─────────────────────────────────────────────── */}
          <section id="focus" className="scroll-mt-24">
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
              Focus
            </p>
            <div className="space-y-1">
              {COURSES.map(({ date, title, desc, url }) => (
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
                      className="text-[#2d8c78] dark:text-[#3aaa90] font-medium"
                    >
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline"
                        >
                          {title}
                        </a>
                      ) : title}
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
                  <div key={project.name} className="group flex gap-4 px-2 py-2 rounded-md hover:bg-[rgba(45,140,120,0.04)] transition-colors duration-150 ease">
                    {/* Left: links + stars */}
                    <div className="w-20 shrink-0 pt-0.5 space-y-1">
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }}
                        className="block text-zinc-400 dark:text-zinc-600 hover:text-[#2d8c78] dark:text-[#3aaa90] transition-colors"
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
                        <h3 style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14 }} className="font-medium text-[#2d8c78] dark:text-[#3aaa90]">
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
          <section id="github" className="scroll-mt-24">
            <p style={LABEL_STYLE} className="uppercase text-zinc-400 dark:text-zinc-600 mb-4">
              GitHub Activity
            </p>
            <div className="overflow-x-auto -mx-2 px-2">
              <GitHubActivity />
            </div>
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
