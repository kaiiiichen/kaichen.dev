# kaichen.dev

Second personal site for **Kai Chen** — Next.js App Router, deployed on Vercel.

**Live:** [kaichen.dev](https://kaichen.dev)

The first personal site was static: [kai-chen.xyz](https://kai-chen.xyz) ([repo](https://github.com/kaiiiichen/kai-chen.xyz)). **kaichen.dev** is the second iteration — dynamic APIs, third-party integrations, and this repository.

## Stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack build) |
| UI | React 19, [Tailwind CSS v4](https://tailwindcss.com) |
| Fonts | Geist, Geist Mono, Lora, Chiron GoRound TC (Chinese) |
| Data | [Supabase](https://supabase.com) (message form), GitHub GraphQL, Spotify Web API, Open-Meteo |
| Analytics | Vercel Analytics, Speed Insights |

## Features

- **Home** — Bio, local time, weather (Berkeley area via Open-Meteo), GitHub contribution grid, Spotify now playing / last played (with album art).
- **About / Projects** — Static content; projects page optionally shows GitHub star counts.
- **Message** (`/guestbook`) — Private contact form (POST only; no public feed). Persists rows in Supabase.
- **Theme** — Light / dark via `class` on `<html>`, `beforeInteractive` init script + client `ThemeProvider` (no `next-themes`).
- **Subpage entrance** — Non-home routes get a short gradient + fade-in animation.

## Repository layout

```
app/
  api/              # Route handlers
    guestbook/      # POST → Supabase insert
    github/         # Contributions + last commit (GraphQL)
    spotify/        # Now playing
    weather/        # Open-Meteo proxy
  components/       # Nav, theme-provider, subpage-enter, Spotify bar, Weather, …
  hooks/            # e.g. use-now-playing
  guestbook/        # “Message” page (URL remains /guestbook)
  about/ , projects/
lib/
  spotify.ts        # Token + currently-playing + recent track cache
  supabase.ts       # Supabase client (NEXT_PUBLIC_*)
```

## Scripts

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. On Vercel, add the same keys under **Project → Settings → Environment Variables** for Preview and Production.

| Variable | Required for | Notes |
|----------|----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Message form | Omit locally if you skip testing `/guestbook` POST |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Message form | RLS: allow anon **insert** on `guestbook` only if messages stay private |
| `SPOTIFY_CLIENT_ID` | Spotify (optional) | Without Spotify env, now-playing UI stays empty / idle |
| `SPOTIFY_CLIENT_SECRET` | Spotify | |
| `SPOTIFY_REFRESH_TOKEN` | Spotify | Scope: `user-read-currently-playing` |
| `GITHUB_TOKEN` | GitHub heatmap / API | Without it, `/api/github/contributions` errors and the home grid is hidden |

Weather uses the public Open-Meteo API only — **no API key**.

### Supabase: `guestbook` table

Example shape (adjust to match your migration):

| Column | Type |
|--------|------|
| `id` | `bigint` / `uuid`, primary key |
| `email` | `text` |
| `message` | `text` |
| `created_at` | `timestamptz`, default `now()` |

Configure RLS so anonymous clients can **insert** only (no public `select` if messages are private).

## Deployment

1. Connect the repo to Vercel.
2. Set environment variables for Production (and Preview if you test PRs).
3. `npm run build` must pass locally before merging.

## Docs for automation

- [`AGENTS.md`](./AGENTS.md) — Notes for AI coding agents (Next.js 16, layout of this repo).
- [`CLAUDE.md`](./CLAUDE.md) — Points editors at `AGENTS.md`.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Short PR / branch notes.
- [`SECURITY.md`](./SECURITY.md) — Secrets and reporting.

## License

Private / personal project unless you add an explicit license file.
