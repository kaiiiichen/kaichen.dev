# kaichen.dev

Personal website of Kai Chen. Built with Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript. Deployed on Vercel.

---

## Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **UI**: React 19, Tailwind CSS 4, TypeScript
- **Content**: MDX with KaTeX + syntax highlighting (`@next/mdx`, Webpack loader — see `next.config.ts`)
- **Fonts**: Nunito (identity / nav), Bitter (body copy), Geist Sans, Geist Mono, JetBrains Mono
- **Theme**: Light by default, dark mode toggle (persisted in `localStorage`)
- **Analytics**: Vercel Analytics + Speed Insights

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — identity card, Last.fm now playing, Berkeley weather, projects + GitHub stars, Substack posts (RSS) |
| `/about` | Education, experience, volunteering, current courses |
| `/projects` | Projects + contribution heatmap |
| `/notes` | Notes index; course pages use MDX (e.g. CS61A) |
| `/gallery` | Photo gallery — grid + lightbox, sourced from Supabase `gallery_photos` |
| `/admin` | Gallery upload (Supabase Auth); `/admin/gallery` redirects here |

**Blog** in the nav links to [Substack](https://substack.com/@kaiiiichen) — there is no `/blog` route in this repo.

---

## Architecture

```text
Browser (kaichen.dev)
  └── Vercel (Next.js 16)
        ├── /api/lastfm/now-playing    →  Last.fm API → iTunes art fallback → Supabase write
        ├── /api/github/contributions  →  GitHub GraphQL API
        ├── /api/github/stars          →  GitHub REST (repo star counts)
        ├── /api/weather               →  Open-Meteo API (no key required)
        └── /api/guestbook             →  Supabase (POST new entries)
```

**Key design choices:**

- Last.fm now-playing is CDN-cached (`s-maxage=10`), so all users share one API call per 10s polling interval
- While playing, polling updates Supabase `listening_history` + `listening_stats` (requires service role)
- Gallery photos are stored in Supabase Storage, metadata in `gallery_photos` table
- `useNowPlaying` hook polls every 10s and animates track transitions with a slide exit/enter effect
- `npm run dev` / `npm run build` use `--webpack` so MDX matches the Webpack-based `@mdx-js/loader` config

---

## External Integrations

| Service | Purpose |
| --- | --- |
| Last.fm API | Now playing / last played track detection |
| iTunes Search API | Album art fallback when Last.fm image unavailable |
| GitHub GraphQL API | Contribution calendar on `/projects` |
| GitHub REST API | Star counts (via `/api/github/stars`) |
| Open-Meteo | Berkeley weather — temperature, precipitation (free, no key) |
| Supabase | `listening_history`, `listening_stats`, `gallery_photos`, `guestbook` tables + storage |
| Substack RSS | Latest posts on the home page |

---

## Environment Variables

```bash
# Site URL (OAuth redirectTo — set production URL in Vercel)
NEXT_PUBLIC_SITE_URL=

# Supabase (listening_history, listening_stats, gallery_photos, guestbook + storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Last.fm (now playing)
LASTFM_API_KEY=

# GitHub (contributions API + star counts on /projects)
GITHUB_TOKEN=
```

See `.env.example` for the full template.

---

## Local Development

```bash
npm install
cp .env.example .env.local
# Fill in your keys
npm run dev
```

---

## Project Structure

```text
kaichen.dev/
├── app/
│   ├── page.tsx                      # Home — identity row, listening card, weather, projects, Substack
│   ├── about/page.tsx                # Education, experience, volunteering, courses
│   ├── projects/page.tsx             # Projects + GitHub activity
│   ├── notes/                        # Notes index + MDX course pages
│   ├── gallery/page.tsx              # Photo gallery with lightbox (Supabase)
│   ├── admin/page.tsx                # Photo upload admin (Auth)
│   ├── admin/gallery/                # Redirects to /admin
│   ├── auth/callback/                # Supabase OAuth callback
│   ├── api/
│   │   ├── lastfm/now-playing/       # Last.fm → iTunes art fallback → Supabase write
│   │   ├── github/                   # Contributions + star counts
│   │   ├── weather/                  # Open-Meteo weather
│   │   └── guestbook/                # Supabase guestbook POST
│   ├── components/
│   │   ├── nav.tsx                   # Fixed top nav (desktop + mobile menu)
│   │   ├── nav-wave-overlay.tsx      # Nav wave animation overlay
│   │   ├── avatar-card.tsx           # Profile photo card
│   │   ├── listening-card.tsx        # Last.fm now playing card
│   │   ├── listening-line.tsx        # Inline now-playing line for home bio
│   │   ├── weather-card.tsx          # Berkeley weather card
│   │   ├── project-stars.tsx         # GitHub star count badge
│   │   ├── GitHubActivity.tsx        # Contribution heatmap
│   │   ├── theme-toggle.tsx          # Dark/light mode toggle
│   │   └── subpage-enter.tsx         # Page transition wrapper
│   └── hooks/
│       └── use-now-playing.ts        # Last.fm polling hook (10s interval, slide animation)
├── components/notes/                 # MDX shortcodes (Theorem, Proof, …)
├── mdx-components.tsx                # Default MDX component mapping
├── lib/
│   ├── now-playing.ts                # NowPlayingResult + RecentTrack types
│   └── supabase.ts                   # Supabase anon client
└── .env.example
```

---

## Deploy

Auto-deploys to Vercel on push to `main` via the connected GitHub repo `kaiiiichen/kaichen.dev`. Set environment variables in the Vercel dashboard (including `NEXT_PUBLIC_SITE_URL` for production OAuth redirects).

Optional: `.github/workflows/auto-merge.yml` enables auto-merge (squash) on open PRs after the Vercel check run succeeds — useful for maintainers, unrelated to runtime behavior.

---

## Using this repo

Forks should replace copy, nav links, Last.fm username (currently `kaiiiichen` in the API route), Supabase project + `ALLOWED_EMAIL` in `app/admin/page.tsx`, GitHub user/token usage, and Substack feeds in `app/lib/substack.ts`. See `SECURITY.md` for reporting security issues.
