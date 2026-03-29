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
- **Database**: Supabase (PostgreSQL) — guestbook
- **Spotify Proxy**: Railway (persistent Node.js process)
  - Polls Spotify API every 1 second
  - Serves `/now-playing` and `/stream` endpoints
  - Prevents rate limiting by centralizing all Spotify requests
- **GitHub API**: GraphQL — contribution graph & last commit
- **Weather API**: Open-Meteo (free, no API key required)

### External Integrations
- **Spotify Web API** — real-time now playing, album art, playback progress
- **GitHub GraphQL API** — contribution graph (past year), last commit info
- **Open-Meteo API** — Berkeley weather, temperature, precipitation forecast

---

## Architecture

```
Browser (kaichen.dev)
  ├── Vercel (Next.js)
  │     ├── /api/github/contributions  →  GitHub GraphQL API
  │     ├── /api/weather               →  Open-Meteo API
  │     ├── /api/guestbook             →  Supabase (PostgreSQL)
  │     └── /api/spotify/now-playing   →  fallback only
  │
  └── Railway (spotify-proxy)
        └── polls Spotify API every 1s
              └── serves /now-playing to browser directly
```

Key design decision: the Spotify proxy runs as a **persistent Node.js process** on Railway, not a serverless function. This allows a single polling loop to serve all visitors, keeping Spotify API usage constant regardless of traffic.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — live status, Spotify now playing, GitHub activity, weather, guestbook preview |
| `/about` | Background, experience, contact |
| `/projects` | Projects with active/archived status tags |
| `/guestbook` | Public guestbook powered by Supabase |

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
GITHUB_TOKEN=
NEXT_PUBLIC_SPOTIFY_PROXY_URL=
```

### Railway (Spotify Proxy)
- Root directory: `spotify-proxy/`
- Auto-deploys on push to `main`
- Live at: `https://kaichendev-production.up.railway.app`

**Environment variables required:**

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
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

# Run Spotify proxy locally (separate terminal)
cd spotify-proxy
npm install
SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=xxx SPOTIFY_REFRESH_TOKEN=xxx node index.js
```

---

## Project Structure

```
kaichen-dev/
├── app/
│   ├── page.tsx                  # Home page
│   ├── about/page.tsx            # About page
│   ├── projects/page.tsx         # Projects page
│   ├── guestbook/page.tsx        # Guestbook page
│   ├── api/
│   │   ├── spotify/              # Spotify API routes (fallback)
│   │   ├── github/               # GitHub contributions & last commit
│   │   ├── weather/              # Weather data from Open-Meteo
│   │   └── guestbook/            # Guestbook CRUD via Supabase
│   └── layout.tsx                # Root layout (nav, SpotifyBar, providers)
├── components/
│   ├── SpotifyBar.tsx            # Global bottom Spotify bar (non-home pages)
│   ├── GitHubActivity.tsx        # Contribution graph + last commit
│   ├── ThemeToggle.tsx           # Dark/light mode toggle
│   └── ...
├── lib/
│   ├── spotify.ts                # Spotify token refresh & API helpers
│   └── supabase.ts               # Supabase client
├── hooks/
│   └── use-now-playing.ts        # Spotify polling hook (1s interval)
├── spotify-proxy/                # Railway service (separate Node.js app)
│   ├── index.js                  # Persistent polling server
│   └── package.json
├── .env.example                  # Environment variable template
└── README.md
```

---

## Guiding Principles

- Don't overbuild early — ship first, polish later
- Separate experimentation from production
- The site should reflect life, not just achievements
- Every data point on the page should be real and live
