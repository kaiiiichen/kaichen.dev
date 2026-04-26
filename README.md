# kaichen.dev

<p align="center">
  <!-- Automation & checks -->
  <a aria-label="GitHub Actions CI" href="https://github.com/kaiiiichen/kaichen.dev/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/kaiiiichen/kaichen.dev/ci.yml?branch=main&label=CI&logo=github&logoColor=white" alt="CI" />
  </a>
  <a aria-label="Vitest" href="https://github.com/kaiiiichen/kaichen.dev/blob/main/vitest.config.ts">
    <img src="https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  </a>
  <a aria-label="ESLint" href="https://github.com/kaiiiichen/kaichen.dev/blob/main/eslint.config.mjs">
    <img src="https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
  </a>
  <br />
  <!-- Stack versions -->
  <a aria-label="Next.js" href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  </a>
  <a aria-label="React" href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  </a>
  <a aria-label="TypeScript" href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  </a>
  <a aria-label="Tailwind CSS" href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  </a>
  <a aria-label="Node.js" href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/node.js-20.x-339933?logo=nodedotjs&logoColor=white" alt="Node.js 20" />
  </a>
  <br />
  <!-- Meta -->
  <a aria-label="Deploy" href="https://vercel.com/">
    <img src="https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  </a>
  <a aria-label="License" href="https://github.com/kaiiiichen/kaichen.dev/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-GPL_3.0-blue.svg" alt="License GPL-3.0" />
  </a>
  <a aria-label="Dependabot" href="https://github.com/kaiiiichen/kaichen.dev/network/updates">
    <img src="https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot&logoColor=white" alt="Dependabot" />
  </a>
  <a aria-label="Website" href="https://kaichen.dev/">
    <img src="https://img.shields.io/badge/site-kaichen.dev-C4894F?logo=googlechrome&logoColor=white" alt="kaichen.dev" />
  </a>
</p>

Personal website of **Kai Chen** — production: [kaichen.dev](https://kaichen.dev).

This repository is a **[Next.js 16](https://nextjs.org/)** application using the **App Router**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. It is deployed on **[Vercel](https://vercel.com/)**.

| Resource | URL |
| --- | --- |
| Production site | https://kaichen.dev |
| Source | https://github.com/kaiiiichen/kaichen.dev |

---

## Table of contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Quick start](#quick-start)
4. [npm scripts](#npm-scripts)
5. [Repository layout](#repository-layout)
6. [Technology stack](#technology-stack)
7. [Routes and features](#routes-and-features)
8. [API routes](#api-routes)
9. [Environment variables](#environment-variables)
10. [MDX lecture notes](#mdx-lecture-notes)
11. [External integrations](#external-integrations)
12. [Local development](#local-development)
13. [Testing](#testing)
14. [CI, Dependabot, and auto-merge](#ci-dependabot-and-auto-merge)
15. [Git hooks](#git-hooks)
16. [Deployment](#deployment)
17. [Documentation map](#documentation-map)
18. [Forking this project](#forking-this-project)
19. [License](#license)

---

## Overview

The site combines:

- A **marketing-style home page** (identity, listening status, weather, **GitHub pinned repositories** via GraphQL with a static fallback, Substack headlines, and links to **news.kaichen.dev** and the **Berkeley library hours** page).
- **Dynamic data** from Last.fm, GitHub, Open-Meteo, optional Supabase-backed listening history, and **UC Berkeley library hours** scraped from the official hours page (cached, JSON API available).
- **MDX-powered notes** under `/notes` with math (KaTeX), GitHub-flavored Markdown, and syntax-highlighted code blocks — multiple course segments (UC Berkeley and SUSTech); see [MDX lecture notes](#mdx-lecture-notes).
- **Optional observability** via Sentry (client, server, edge) and Vercel Analytics / Speed Insights.

A single `proxy.ts` (the Next.js 16 successor to `middleware.ts`) lives at the repo root. It does two things:

1. Refreshes the Supabase auth cookie on every request (required for `/clip` server components).
2. Rewrites the `clip.kaichen.dev` subdomain into the `/clip/*` path tree so one project serves both `kaichen.dev/clip` and `clip.kaichen.dev`.

Public marketing routes are unaffected.

---

## Requirements

| Tool | Version / notes |
| --- | --- |
| **Node.js** | **20.x** (matches [CI](.github/workflows/ci.yml) and `@types/node`) |
| **npm** | 9+; lockfile is `package-lock.json` — use `npm ci` for reproducible installs |

---

## Quick start

```bash
git clone https://github.com/kaiiiichen/kaichen.dev.git
cd kaichen.dev
npm install
cp .env.example .env.local
```

Edit `.env.local` following [Environment variables](#environment-variables). You do **not** need every key to run the app locally; missing keys typically degrade or hide features rather than crash the build (exceptions: pages that import Supabase at module scope use **placeholder** values in CI — see below).

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Important:** `dev` and `build` both pass **`--webpack`** to Next.js. MDX is wired through a **custom `webpack()` block** in [`next.config.ts`](next.config.ts) (`@mdx-js/loader` + remark/rehype plugins). Using Webpack for dev/build keeps MDX behavior aligned with production. Do not assume Turbopack-only behavior for `.mdx` files.

---

## npm scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev --webpack` | Local development with Webpack (MDX-compatible). |
| `build` | `next build --webpack` | Production bundle (also runs type checking as part of Next). |
| `start` | `next start` | Serve the last `build` output (run `build` first). |
| `lint` | `eslint` | ESLint across the repo ([`eslint.config.mjs`](eslint.config.mjs)). |
| `typecheck` | `tsc --noEmit` | TypeScript without emitting JS. |
| `test` | `vitest run` | Unit tests once (CI uses this). |
| `test:watch` | `vitest` | Vitest in watch mode. |
| `postinstall` | `git config core.hooksPath .githooks …` | Points Git at [`.githooks/`](.githooks) so the [prepare-commit-msg](.githooks/prepare-commit-msg) hook runs after `npm install` (see [Git hooks](#git-hooks)). |

**Before opening a PR**, run the same sequence as CI:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

---

## Repository layout

High-level map (not every file):

```text
kaichen.dev/
├── app/                          # App Router
│   ├── layout.tsx                # Root layout: fonts, theme script, Nav, Providers, Analytics
│   ├── page.tsx                  # Home
│   ├── globals.css
│   ├── global-error.tsx          # Root error boundary + Sentry
│   ├── opengraph-image.tsx       # OG image for /
│   ├── about/                    # Bio / CV-style page + OG
│   ├── projects/                 # Projects + GitHub heatmap + OG
│   ├── notes/                    # Notes index, course pages, MDX note routes
│   ├── api/                      # Route handlers (Last.fm, GitHub, weather, UCB libraries)
│   ├── berkeley-libraries/       # UC Berkeley library hours (HTML from lib.berkeley.edu)
│   ├── components/               # UI: nav, cards, theme, weather, listening, GitHub heatmap, …
│   ├── hooks/                    # e.g. use-now-playing.ts
│   └── lib/                      # og.tsx, substack RSS, GitHub pinned repos (GraphQL)
├── components/notes/             # MDX shortcodes: Theorem, Proof, Definition, Example, NoteBlock
├── lib/                          # Shared server-oriented helpers + Vitest tests
│   ├── now-playing.ts            # Types for Last.fm payload
│   ├── lastfm-now-playing-helpers.ts
│   ├── ucb-library-hours.ts      # Fetch + parse lib.berkeley.edu/hours (Cheerio)
│   ├── weather-open-meteo.ts
│   └── *.test.ts
├── mdx-components.tsx            # MDX element mapping + shortcode registration
├── next.config.ts                # MDX webpack rule + withSentryConfig
├── instrumentation.ts            # Sentry Node/Edge registration
├── instrumentation-client.ts     # Sentry browser + router transition hooks
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── .githooks/                    # Git hooks (co-author trailer)
├── .github/
│   ├── workflows/                # ci.yml, auto-merge.yml
│   ├── dependabot.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .env.example
├── AGENTS.md                     # AI agent / automation git rules
├── CLAUDE.md                     # Short context for Claude Code (points here + AGENTS)
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── LICENSE                       # GPL-3.0
```

---

## Technology stack

| Layer | Choices |
| --- | --- |
| Framework | Next.js **16.2** (App Router), React **19**, TypeScript **5** |
| Styling | Tailwind CSS **4** (`@tailwindcss/postcss`), custom CSS in `app/globals.css` |
| Content | **MDX** via `@mdx-js/loader` + `remark-gfm`, `remark-math`, `rehype-katex`, `rehype-highlight` |
| Scraping | **cheerio** — parses UC Berkeley library hours HTML server-side |
| Fonts | `@fontsource/*` (Nunito, Bitter, JetBrains Mono), `geist` (sans/mono CSS variables) |
| Data | Supabase (`@supabase/supabase-js`) — optional listening history DB writes (service role) for `/api/lastfm/now-playing` |
| Monitoring | `@sentry/nextjs` (optional DSN), Vercel Analytics + Speed Insights |
| Testing | Vitest **3** |

Pinned versions are in [`package.json`](package.json).

---

## Routes and features

| Route | What it does |
| --- | --- |
| `/` | Identity block, Last.fm line + card, Berkeley weather, **pinned GitHub repos** (GraphQL + fallback list), Substack RSS snippets, links to **news.kaichen.dev** and **`/berkeley-libraries`** |
| `/about` | Education, experience, courses, volunteering |
| `/projects` | Project cards + **GitHub contribution calendar** (client component, data from `/api/github/contributions`) |
| `/notes` | Index of courses (see [MDX lecture notes](#mdx-lecture-notes)); links to external [SUSTech-Kai-Notes](https://github.com/kaiiiichen/SUSTech-Kai-Notes) for broader collections |
| `/notes/...` | Nested segments per course (e.g. `cs61a`, `data100`, `cs217`, `ma121`–`ma337`); individual notes are `page.mdx` |
| `/berkeley-libraries` | UC Berkeley library **open/closed** status and hours, parsed from [lib.berkeley.edu/hours](https://www.lib.berkeley.edu/hours); data revalidates every **15 minutes** |
| `/clip` | **Clipboard Sync** — Google sign-in (Supabase Auth), lists rooms the user belongs to. Also reachable as the root of `clip.kaichen.dev` via middleware rewrite. |
| `/clip/board/[id]` | Single clipboard room: history list on the left, editor + selected entry on the right. Live-syncs new entries via Supabase Realtime (`postgres_changes` on `clipboard_entries`). |
| `/clip/admin` | Admin panel (only emails in `ADMIN_EMAILS`): list signed-up users, create/delete rooms, add/remove members with `read` / `write` roles. |
| `GET /auth/callback` | Supabase OAuth code exchange — set `https://clip.kaichen.dev/auth/callback` (and `https://kaichen.dev/auth/callback`) as redirect URLs in Supabase Auth. |
| `POST /auth/sign-out` | Server-side sign-out for Clipboard Sync. |

**External nav (no in-app route):** the main nav includes **News** → [news.kaichen.dev](https://news.kaichen.dev) and **Blog** → [Substack](https://kaiiiichen.substack.com/); there is no `/blog` or `/news` route in this repo.

**Open Graph:** several routes ship `opengraph-image` route handlers for social previews. Set [`metadataBase`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase) in `app/layout.tsx` if you see build warnings about resolving OG image URLs.

---

## API routes

All handlers live under `app/api/`.

| Method & path | Behavior | Caching / notes |
| --- | --- | --- |
| `GET /api/lastfm/now-playing` | Last.fm `user.getrecenttracks`; optional iTunes artwork fallback; optional **service-role** writes to `listening_history` / `listening_stats` when a track is “now playing” | `Cache-Control: public, s-maxage=10, stale-while-revalidate=5`; uses `LASTFM_API_KEY`; in-memory `lastKnownTrack` fallback |
| `GET /api/github/contributions` | GraphQL contribution calendar + REST search for latest commit + REST repo metadata for star counts | `dynamic = force-dynamic`; `Cache-Control: no-store`; requires `GITHUB_TOKEN` |
| `GET /api/github/stars?repo=owner/name` | Returns `stargazers_count` and `archived` for a repo | `revalidate = 3600`; optional `GITHUB_TOKEN` for rate limits |
| `GET /api/weather` | Open-Meteo forecast for fixed Berkeley coordinates | `fetch` with `next.revalidate = 600` |
| `GET /api/ucb-libraries` | Same payload as `/berkeley-libraries`: JSON with `libraries`, `fetchedAt`, `sourceUrl`, or `ok: false` + `error` | Uses `getUCBLibraryHours()`; upstream fetch `revalidate: 900` (15 minutes) |

**Berkeley libraries:** parsing depends on the HTML structure of lib.berkeley.edu. If the upstream page changes, [`lib/ucb-library-hours.ts`](lib/ucb-library-hours.ts) may need updates (see error responses when zero libraries parse).

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. **Never commit** real secrets.

### Always safe to document (names only)

| Variable | Role |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Used by `/api/lastfm/now-playing` (service-role writes) and Clipboard Sync (`/clip`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for cookie-based auth + RLS-scoped reads/writes from `/clip`. Required for Clipboard Sync; safe to expose. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Used by `/api/lastfm/now-playing` and the `/clip/admin` panel (creating rooms, listing users, managing members). Keep off the client bundle. |
| `ADMIN_EMAILS` | Comma-separated emails allowed to use `/clip/admin` (case-insensitive). Compared against the signed-in Supabase session email. |
| `LASTFM_API_KEY` | Last.fm API. If unset, the now-playing API returns a graceful “not playing” / DB fallback without calling Last.fm. |
| `GITHUB_TOKEN` | Fine-grained or classic PAT for GitHub API (contributions + stars + **pinned repos** on the home page). If missing, contribution/stars features may error or return empty data; pinned projects fall back to a **static list** in [`app/lib/github-pinned.ts`](app/lib/github-pinned.ts). |
| `GITHUB_LOGIN` | Optional. GitHub username for **pinned repositories** and related API calls (defaults to `kaiiiichen` if unset). Set when forking so the home page shows your pins. |

### Sentry (optional)

| Variable | Role |
| --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | Error reporting; see [`instrumentation.ts`](instrumentation.ts) and Sentry configs. |
| `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | **Build-time** source map upload for readable stack traces in Sentry (configure on Vercel, not in git). |

### Vercel CLI (optional)

```bash
vercel env pull .env.vercel.check
```

That path is gitignored — do not commit it.

### CI

CI does not need any real Supabase keys to build — every Supabase client in this repo is constructed lazily inside a function body, so `next build` succeeds without `NEXT_PUBLIC_SUPABASE_*` set. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml). The `/clip` routes are `force-dynamic`, so they aren't statically pre-rendered at build time either.

---

## MDX lecture notes

- Notes are **route segments** with `page.mdx` files (e.g. `app/notes/cs61a/scheme-quote/page.mdx`), not a separate `content/` directory.
- The index at [`/notes`](app/notes/page.tsx) lists courses by code (examples: **CS61A**, **Data 100**, **CS217**, **MA121**–**MA337**). Each course has a `page.tsx` hub and nested folders for individual notes.
- Shared layout: [`app/notes/layout.tsx`](app/notes/layout.tsx) (imports KaTeX CSS, width/padding).
- MDX components and typography are centralized in [`mdx-components.tsx`](mdx-components.tsx).
- Custom shortcodes (Theorem, Definition, Proof, Example, NoteBlock) live in [`components/notes/`](components/notes/) and are registered globally for MDX.
- Metadata in MDX files often uses `export const metadata = { title, description }` (Next.js metadata), not always YAML frontmatter.
- Large PDFs or archives for a course may live under `public/notes/...` and be linked from MDX; keep binary paths in sync if you move files.

To add a new course: add a card on the notes index, create `app/notes/<slug>/page.tsx` plus note folders with `page.mdx`, match existing note headers (breadcrumb, title block) for visual consistency, and run `npm run build` to validate the MDX pipeline.

---

## External integrations

| Service | Use in this repo |
| --- | --- |
| **Last.fm** | Recent / now-playing track |
| **Apple iTunes Search API** | Album art fallback |
| **GitHub GraphQL** | Contribution calendar |
| **GitHub REST** | Repo stars, commit search |
| **Open-Meteo** | Weather (no API key) |
| **Supabase** | Optional `listening_history` / `listening_stats` writes (service role) for the now-playing route |
| **Substack RSS** | Home page “latest posts” (`app/lib/substack.ts`) |
| **lib.berkeley.edu** | Library hours HTML (scraped server-side; not an official API) |
| **Supabase Auth (Google)** | Sign-in for `/clip` Clipboard Sync (cookie-based session via `@supabase/ssr`) |
| **Supabase Realtime** | `clipboard_entries` `INSERT` events broadcast to room subscribers in `/clip/board/[id]` |

---

## Local development

- **Node 20**, **npm install** then **`npm run dev`**.
- If MDX fails to compile, confirm you did not remove the `--webpack` flag from scripts.
- **Supabase:** only `/api/lastfm/now-playing` uses Supabase (service role) for the optional listening history. The site builds and serves every page without any Supabase env set; the route just falls back to live Last.fm + in-memory cache when the DB is unreachable.

### Common issues

| Symptom | Things to check |
| --- | --- |
| MDX differs between dev and prod | Ensure both use Webpack (`--webpack`). |
| GitHub widgets empty | `GITHUB_TOKEN` set and not expired; API rate limits. |
| "Recently played" never persists across deploys | `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` set; tables `listening_history` / `listening_stats` exist with the expected columns. |
| Sentry noisy locally | DSN unset disables reporting; or lower sample rate in `instrumentation-client.ts`. |

---

## Testing

Unit tests use **Vitest** and live next to helpers under `lib/*.test.ts` (RSS parsing, weather mapping, Last.fm helpers).

```bash
npm run test
npm run test:watch
```

There are currently **no** Playwright/E2E tests in this repo; manual browser checks matter for layout and visual polish.

---

## CI, Dependabot, and auto-merge

### CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))

Triggers on **push** and **pull_request** to `main`:

`npm ci` → `lint` → `typecheck` → `test` → `build` on `ubuntu-latest`, **Node 20**, with npm cache.

### Dependabot ([`.github/dependabot.yml`](.github/dependabot.yml))

- **npm** and **github-actions** ecosystems, **weekly** (Monday 09:00 America/Los_Angeles).
- **Grouped** updates (fonts, Sentry, Supabase, MDX-related, Vercel, types, catch-all minor/patch).
- **Ignored** semver-**major** bumps for core tooling (`next`, `react`, `eslint`, `typescript`, `tailwindcss`, …) so those upgrades stay manual.

### Auto-merge ([`.github/workflows/auto-merge.yml`](.github/workflows/auto-merge.yml))

Runs only when the PR author is **`dependabot[bot]`**:

1. Reads semver classification via `dependabot/fetch-metadata`.
2. For **patch** and **minor** updates: enables **`gh pr merge --auto --squash`** (respects branch protection when checks pass).
3. On **open** / **reopen**, posts an **idempotent** PR comment that includes the official **`@dependabot squash and merge`** line (documentation + redundancy; primary merge path is still GitHub auto-merge).

`pull_request` types include **`synchronize`** so Dependabot force-pushes re-enable auto-merge. **Concurrency** is scoped per PR number to avoid overlapping runs.

---

## Git hooks

After `npm install`, `postinstall` runs:

```bash
git config core.hooksPath .githooks
```

[`.githooks/prepare-commit-msg`](.githooks/prepare-commit-msg) appends:

`Co-authored-by: Claude <noreply@anthropic.com>`

to non-merge commits via `git interpret-trailers` (idempotent). Automation that cannot run hooks should add the same trailer manually — see [`AGENTS.md`](AGENTS.md).

---

## Deployment

1. Connect the GitHub repository to **Vercel**.
2. Set environment variables in the Vercel project (production + preview as needed), especially `GITHUB_TOKEN`, `LASTFM_API_KEY`, the Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), and `ADMIN_EMAILS` for Clipboard Sync.
3. Pushes to `main` typically deploy production; preview deployments use PR branches.

### Clipboard Sync (`clip.kaichen.dev`)

Once the env vars above are set:

1. **Vercel:** add `clip.kaichen.dev` as a domain on the same project. The middleware rewrites `clip.kaichen.dev` → `/clip` so no extra routing is needed.
2. **Supabase Auth → URL configuration:** add both `https://kaichen.dev/auth/callback` and `https://clip.kaichen.dev/auth/callback` (plus `http://localhost:3000/auth/callback` for dev) to the redirect URL allowlist; enable the **Google** provider.
3. **Supabase tables:** the schema (`clipboards`, `clipboard_members`, `clipboard_entries`) is created manually — see the project brief / migrations. Enable **Realtime** on `clipboard_entries` and configure RLS so users can only see rooms they belong to (the app relies on RLS for `SELECT`/`INSERT` from the browser).

Manual CLI (after `vercel link`):

```bash
vercel --prod
```

---

## Documentation map

| File | Audience | Contents |
| --- | --- | --- |
| **README.md** (this file) | Everyone | Setup, architecture, APIs, env, CI |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Human contributors | How to PR, conventions, CI parity |
| [`AGENTS.md`](AGENTS.md) | AI agents / automation | Branch + PR only, co-author trailer, secrets |
| [`CLAUDE.md`](CLAUDE.md) | Claude Code | Short pointer + stack summary |
| [`SECURITY.md`](SECURITY.md) | Security researchers | How to report issues responsibly |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Contributors | Contributor Covenant |
| [`.env.example`](.env.example) | Developers | Variable names and brief comments |
| [`.github/pull_request_template.md`](.github/pull_request_template.md) | PR authors | Checklist |

Cursor-specific rules live under [`.cursor/rules/`](.cursor/rules/) (IDE-only, not required reading for all contributors).

---

## Forking this project

Replace at minimum:

| Area | Where to look |
| --- | --- |
| Copy, links, projects list | `app/page.tsx`, `app/projects/page.tsx`, `app/about/page.tsx` |
| Last.fm username | `app/api/lastfm/now-playing/route.ts` |
| GitHub login / repos / pins | `app/api/github/contributions/route.ts`, `app/components/project-stars.tsx`, [`app/lib/github-pinned.ts`](app/lib/github-pinned.ts), env `GITHUB_LOGIN` |
| Berkeley library page | `lib/ucb-library-hours.ts`, `app/berkeley-libraries/page.tsx`, `app/api/ucb-libraries/route.ts` |
| Supabase tables | `app/api/lastfm/now-playing/route.ts`, Supabase dashboard (`listening_history`, `listening_stats`) |
| Substack feeds | `app/lib/substack.ts` |
| Weather location | `app/api/weather/route.ts`, weather UI components |
| Theme / fonts | `app/layout.tsx`, `app/globals.css`, `app/components/theme-provider.tsx` |

Keep **LICENSE** compliance if you redistribute (GPL-3.0).

---

## License

This project is licensed under the **GNU General Public License v3.0** — see [`LICENSE`](LICENSE).

---

## Security

Please read [`SECURITY.md`](SECURITY.md) before reporting vulnerabilities.
