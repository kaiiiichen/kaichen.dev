# kaichen.dev

Personal website of Kai Chen — [kaichen.dev](https://kaichen.dev). Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, and **TypeScript**. Deployed on **Vercel**.

| Resource | URL |
| --- | --- |
| Production | https://kaichen.dev |
| Repository | https://github.com/kaiiiichen/kaichen.dev |

---

## Quick start

```bash
git clone https://github.com/kaiiiichen/kaichen.dev.git
cd kaichen.dev
npm install
cp .env.example .env.local
# Edit .env.local — see [Environment variables](#environment-variables)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server uses **`--webpack`** so MDX matches the production Webpack loader (see [Development notes](#development-notes)).

---

## npm scripts

| Script | Command | When to use |
| --- | --- | --- |
| `dev` | `next dev --webpack` | Local development |
| `build` | `next build --webpack` | Production bundle (run before `start` or in CI) |
| `start` | `next start` | Serve the last `build` output locally |
| `lint` | `eslint` | Lint the whole repo |
| `typecheck` | `tsc --noEmit` | Type-check without emitting JS |
| `test` | `vitest run` | Unit tests once (CI uses this) |
| `test:watch` | `vitest` | Unit tests in watch mode |

Before pushing, run the same sequence as CI: `npm run lint` → `npm run typecheck` → `npm run test` → `npm run build`.

---

## Tech stack

- **Framework**: Next.js 16.2 (App Router)
- **UI**: React 19, Tailwind CSS 4, TypeScript
- **Content**: MDX with KaTeX + syntax highlighting (`@mdx-js/loader` in `next.config.ts`)
- **Fonts**: Nunito, Bitter, Geist Sans / Mono, JetBrains Mono (`@fontsource/*`, `geist`)
- **Theme**: Light default; dark mode via `ThemeProvider` + `localStorage`
- **Analytics**: Vercel Analytics + Speed Insights
- **Errors / performance**: Sentry (`@sentry/nextjs`) — optional; see [Environment variables](#environment-variables)

---

## Pages & routes

| Route | Description |
| --- | --- |
| `/` | Home — identity, Last.fm, Berkeley weather, projects + GitHub stars, Substack RSS |
| `/about` | Education, experience, volunteering, courses |
| `/projects` | Projects + GitHub contribution heatmap |
| `/notes` | Notes index; nested routes use MDX (e.g. CS61A) |
| `/gallery` | Photo grid + lightbox (Supabase `gallery_photos` + Storage) |
| `/admin` | Gallery upload (Supabase Auth); `/admin/gallery` redirects here |

The nav **Blog** link points to [Substack](https://substack.com/@kaiiiichen); there is no `/blog` route in this repo.

---

## API routes (`app/api/`)

| Path | Role |
| --- | --- |
| `GET /api/lastfm/now-playing` | Last.fm → optional iTunes art → optional Supabase `listening_*` writes |
| `GET /api/github/contributions` | GitHub GraphQL contribution calendar |
| `GET /api/github/stars` | GitHub REST star counts for listed repos |
| `GET /api/weather` | Open-Meteo (Berkeley), no API key |
| `POST /api/guestbook` | Inserts into Supabase `guestbook` |

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill values. **Never commit** `.env.local` or tokens.

### Core (most site features)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site origin; used for Supabase OAuth `redirectTo` (set production URL on Vercel) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser + server routes using `getSupabaseAnon()`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; Last.fm route writes to `listening_history` / `listening_stats` |
| `LASTFM_API_KEY` | Last.fm API |
| `GITHUB_TOKEN` | GitHub GraphQL + REST (contributions + stars) |

### Sentry (optional)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | Client SDK; also fallback for server/edge if `SENTRY_DSN` is unset |
| `SENTRY_DSN` | Optional separate DSN for Node/Edge |
| `SENTRY_AUTH_TOKEN` | **Build-only** — upload source maps (secret; store in Vercel) |
| `SENTRY_ORG` | Sentry organization **slug** |
| `SENTRY_PROJECT` | Sentry project **slug** |

Use **no spaces** around `=` in `.env.local` (e.g. `SENTRY_ORG=my-org`). Runtime reporting works with DSN only; **readable stack traces** in Sentry need `SENTRY_AUTH_TOKEN` + org + project on the machine that runs `next build` (e.g. Vercel Production).

[`app/global-error.tsx`](app/global-error.tsx) reports uncaught root React render errors to Sentry when DSN is set.

### Compare with Vercel

To pull remote env into a **local scratch file** (optional):

```bash
vercel env pull .env.vercel.check
```

That file is ignored by git (see `.gitignore`). Do not commit it.

---

## Development notes

- **MDX**: `next dev` / `next build` use **`--webpack`** so the custom `webpack()` block (MDX loader + `remark-gfm` / `remark-math` / `rehype-katex` / `rehype-highlight`) matches production.
- **Last.fm**: Responses use `Cache-Control: public, s-maxage=10` so the CDN can coalesce polls. The `useNowPlaying` hook polls every **10s** with slide transitions.
- **Supabase in CI**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml) sets **placeholder** `NEXT_PUBLIC_SUPABASE_*` values so `next build` can prerender pages that call `createBrowserClient` at module scope. They are not real keys.
- **Guestbook**: [`lib/supabase.ts`](lib/supabase.ts) exposes `getSupabaseAnon()` — lazy init so builds without Supabase env do not fail at import time.

---

## External integrations

| Service | Purpose |
| --- | --- |
| Last.fm API | Now playing / last played |
| iTunes Search API | Album art fallback when Last.fm has no art |
| GitHub GraphQL API | Contribution calendar on `/projects` |
| GitHub REST API | Star counts (`/api/github/stars`) |
| Open-Meteo | Berkeley weather (no key) |
| Supabase | `listening_history`, `listening_stats`, `gallery_photos`, `guestbook`, Storage |
| Substack RSS | Latest posts on the home page |

---

## Testing

Unit tests live under `lib/*.test.ts` (Vitest): Substack RSS parsing, Open-Meteo mapping, Last.fm helpers.

```bash
npm run test        # once
npm run test:watch  # watch mode
```

---

## CI & automation

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): on every **push** and **pull_request** to `main` — `npm ci` → `lint` → `typecheck` → `test` → `build` (Node 20, `ubuntu-latest`).
- **Dependabot** ([`.github/dependabot.yml`](.github/dependabot.yml)): weekly updates for **npm** and **GitHub Actions**.
- **Auto-merge** ([`.github/workflows/auto-merge.yml`](.github/workflows/auto-merge.yml)): optional squash merge after checks — maintainer convenience only.

---

## Deploy

- **Vercel**: Connect the GitHub repo; pushes to `main` trigger production deploys. Configure env vars in the Vercel dashboard (especially `NEXT_PUBLIC_SITE_URL` for OAuth).
- **Manual CLI** (after `vercel link`): `vercel --prod`.

---

## Project structure

```text
kaichen.dev/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── global-error.tsx              # Root error UI + Sentry.captureException
│   ├── about/, projects/, notes/, gallery/, admin/
│   ├── api/                          # lastfm, github, weather, guestbook
│   ├── auth/callback/                # Supabase OAuth
│   ├── components/                   # nav, cards, theme, weather, listening, …
│   ├── hooks/use-now-playing.ts
│   ├── lib/substack.ts, og.tsx
│   └── notes/                        # MDX course content
├── components/notes/                 # MDX shortcodes (Theorem, Proof, …)
├── lib/
│   ├── supabase.ts                   # getSupabaseAnon() — lazy singleton
│   ├── now-playing.ts                # Types for Last.fm API
│   ├── weather-open-meteo.ts         # Open-Meteo → API payload (tested)
│   ├── lastfm-now-playing-helpers.ts
│   └── *.test.ts                     # Vitest
├── mdx-components.tsx
├── instrumentation.ts                # Sentry server/edge registration
├── instrumentation-client.ts         # Sentry browser + router transitions
├── sentry.server.config.ts, sentry.edge.config.ts
├── next.config.ts                    # MDX webpack + withSentryConfig
├── vitest.config.ts
├── .github/workflows/ci.yml, auto-merge.yml
├── .github/dependabot.yml
├── .env.example
└── SECURITY.md
```

---

## Forking this repo

Replace copy, nav links, Last.fm username in [`app/api/lastfm/now-playing/route.ts`](app/api/lastfm/now-playing/route.ts), Supabase project + allowed emails in [`app/admin/page.tsx`](app/admin/page.tsx), GitHub usage, and Substack feeds in [`app/lib/substack.ts`](app/lib/substack.ts).

---

## Security

See [`SECURITY.md`](SECURITY.md) for how to report issues responsibly.
