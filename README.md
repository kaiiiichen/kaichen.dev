# kaichen.dev

Personal website of Kai Chen — a living, dynamic digital identity system.

> Not just a résumé. Not just a blog. A real-time interface to my intellectual and creative trajectory.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Theme**: Dark / Light mode with system preference detection + manual toggle

### Backend & APIs
- **Hosting**: Vercel (serverless)
- **Database**: Supabase (PostgreSQL)
  - `guestbook` — public guestbook
  - `listening_history` — every Spotify fetch recorded (proxy for listening duration)
  - `listening_stats` — unique tracks with play_count, used for Gallery ranking
- **Spotify**: Vercel serverless function (`/api/spotify/now-playing`)
  - Token refresh with in-memory cache
  - Writes to Supabase on every fetch when isPlaying is true
- **GitHub API**: GraphQL — contribution graph & last commit
- **Weather API**: Open-Meteo (free, no API key required)

### Mobile & Responsive
- **Layout**: Single-column on mobile (`grid-cols-1`), two-column on desktop (`md:grid-cols-2`)
- **Navigation**: Desktop section nav (`hidden md:flex`) replaced by hamburger menu on mobile
- **Mobile nav drawer**: Slides in from the left, backdrop blur overlay, body scroll locked while open, staggered link entrance animation (40ms delay per item), instant exit

### External Integrations
- **Spotify Web API** — real-time now playing, album art, playback progress
- **GitHub GraphQL API** — contribution graph (past year), last commit info
- **Open-Meteo API** — Berkeley weather, temperature, precipitation forecast

---

## Architecture

```
Browser (kaichen.dev)
  └── Vercel (Next.js)
        ├── /api/github/contributions  →  GitHub GraphQL API
        ├── /api/weather               →  Open-Meteo API
        ├── /api/guestbook             →  Supabase (guestbook table)
        ├── /api/spotify/now-playing   →  Spotify API → Supabase (listening_history + listening_stats)
        └── /api/spotify/recent-albums →  Supabase (listening_stats, sorted by play_count)
```

Key design decision: every Spotify fetch is recorded in Supabase. listening_history approximates listening duration (each record = one 10s polling interval). listening_stats powers the Gallery, ranked by play_count.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — live status, Spotify now playing, GitHub activity, weather, guestbook preview |
| `/about` | Background, experience, contact |
| `/projects` | Projects with active/archived status tags |
| `/guestbook` | Public guestbook powered by Supabase |
| `/gallery` | Scroll-driven album gallery, ranked by personal play count from Supabase |

---

## Deploy

### Vercel (Main Site)
- Connected to GitHub repo `kaiiiichen/kaichen-dev`
- Auto-deploys on push to `main`

**Environment variables required:**

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GITHUB_TOKEN=
```

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your own keys

# Run dev server
npm run dev
```

---

## Project Structure

```
kaichen-dev/
├── app/
│   ├── page.tsx                  # Home page
│   ├── gallery/page.tsx          # Scroll-driven album gallery
│   ├── about/page.tsx            # About page
│   ├── projects/page.tsx         # Projects page
│   ├── guestbook/page.tsx        # Guestbook page
│   ├── api/
│   │   ├── spotify/
│   │   │   ├── now-playing/      # Fetches Spotify + writes to Supabase
│   │   │   └── recent-albums/    # Reads from listening_stats
│   │   ├── github/               # GitHub contributions & last commit
│   │   ├── weather/              # Weather data from Open-Meteo
│   │   └── guestbook/            # Guestbook CRUD via Supabase
│   └── layout.tsx                # Root layout (nav, SpotifyBar, providers)
├── components/
│   ├── SpotifyBar.tsx            # Global bottom Spotify bar (non-home pages)
│   ├── GitHubActivity.tsx        # Contribution graph + last commit
│   ├── ThemeToggle.tsx           # Dark/light mode toggle
│   ├── mobile-nav.tsx            # Hamburger + slide-in drawer (mobile only)
│   ├── home-nav-client.tsx       # Section anchor nav (desktop only, hidden md:flex)
│   └── ...
├── lib/
│   ├── spotify.ts                # Token refresh, Supabase write on fetch
│   └── supabase.ts               # Supabase anon client
├── app/hooks/
│   └── use-now-playing.ts        # Spotify polling hook (10s interval)
├── .env.example                  # Environment variable template
└── README.md
```

---

## Guiding Principles

- Don't overbuild early — ship first, polish later
- Separate experimentation from production
- The site should reflect life, not just achievements
- Every data point on the page should be real and live
