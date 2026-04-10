# kaichen.dev

Personal website of Kai Chen. Built with Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript. Deployed on Vercel.

---

## Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **UI**: React 19, Tailwind CSS 4, TypeScript
- **Fonts**: Nunito (identity / nav), Bitter (body copy), Geist Sans, Geist Mono, JetBrains Mono
- **Theme**: Light by default, dark mode toggle (persisted in `localStorage`)
- **Analytics**: Vercel Analytics + Speed Insights

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — identity card, Last.fm now playing, Berkeley weather, projects list |
| `/about` | Education, experience, volunteering, current courses |
| `/projects` | Projects page |
| `/blog` | Blog (no posts yet) |
| `/gallery` | Photo gallery — grid + lightbox, sourced from Supabase `gallery_photos` |
| `/admin/gallery` | Admin page for uploading photos to Supabase |

---

## Architecture

```text
Browser (kaichen.dev)
  └── Vercel (Next.js 16)
        ├── /api/lastfm/now-playing    →  Last.fm API → iTunes art fallback → Supabase write
        ├── /api/github/contributions  →  GitHub GraphQL API
        ├── /api/weather               →  Open-Meteo API (no key required)
        └── /api/guestbook             →  Supabase
```

**Key design choices:**

- Last.fm now-playing is CDN-cached (`s-maxage=10`), so all users share one API call per 10s polling interval
- Each scrobble poll while playing writes to Supabase `listening_history` + `listening_stats`
- Gallery photos are stored in Supabase Storage, metadata in `gallery_photos` table
- `useNowPlaying` hook polls every 10s and animates track transitions with a slide exit/enter effect

---

## External Integrations

| Service | Purpose |
| --- | --- |
| Last.fm API | Now playing / last played track detection |
| iTunes Search API | Album art fallback when Last.fm image unavailable |
| GitHub GraphQL API | Star counts on /projects |
| Open-Meteo | Berkeley weather — temperature, precipitation (free, no key) |
| Supabase | `listening_history`, `listening_stats`, `gallery_photos` tables + storage |

---

## Environment Variables

```bash
# Supabase (listening_history, listening_stats, gallery_photos + storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Last.fm (now playing)
LASTFM_API_KEY=

# GitHub GraphQL (star counts on /projects)
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
│   ├── page.tsx                      # Home — identity row, listening card, weather, projects
│   ├── about/page.tsx                # Education, experience, volunteering, courses
│   ├── projects/page.tsx             # Projects
│   ├── blog/page.tsx                 # Blog (placeholder)
│   ├── gallery/page.tsx              # Photo gallery with lightbox (Supabase)
│   ├── admin/gallery/                # Photo upload admin
│   ├── api/
│   │   ├── lastfm/now-playing/       # Last.fm now-playing → iTunes art fallback → Supabase write
│   │   ├── github/                   # GitHub contributions + star counts
│   │   ├── weather/                  # Open-Meteo weather
│   │   └── guestbook/                # Supabase guestbook CRUD
│   ├── components/
│   │   ├── nav.tsx                   # Fixed top nav (desktop links + mobile hamburger)
│   │   ├── mobile-nav.tsx            # Slide-in drawer (mobile)
│   │   ├── left-ribbon.tsx           # Decorative left edge ribbon
│   │   ├── right-ribbon.tsx          # Decorative right edge ribbon
│   │   ├── nav-wave-overlay.tsx      # Nav wave animation overlay
│   │   ├── avatar-card.tsx           # Profile photo card
│   │   ├── listening-card.tsx        # Last.fm now playing card
│   │   ├── listening-line.tsx        # Inline now-playing line for home bio
│   │   ├── weather-card.tsx          # Berkeley weather card
│   │   ├── project-stars.tsx         # GitHub star count badge
│   │   ├── theme-toggle.tsx          # Dark/light mode toggle
│   │   └── subpage-enter.tsx         # Page transition wrapper
│   └── hooks/
│       └── use-now-playing.ts        # Last.fm polling hook (10s interval, slide animation)
├── lib/
│   ├── now-playing.ts                # NowPlayingResult + RecentTrack types
│   └── supabase.ts                   # Supabase anon client
└── .env.example
```

---

## Deploy

Auto-deploys to Vercel on push to `main` via the connected GitHub repo `kaiiiichen/kaichen.dev`.
