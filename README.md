# kaichen.dev

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

- A **marketing-style home page** (identity, listening status, weather, projects, Substack headlines).
- **Dynamic data** from Last.fm, GitHub, Open-Meteo, and optional Supabase-backed gallery and listening history.
- **MDX-powered notes** under `/notes` with math (KaTeX), GitHub-flavored Markdown, and syntax-highlighted code blocks.
- **Optional observability** via Sentry (client, server, edge) and Vercel Analytics / Speed Insights.

There is **no** `middleware.ts` in this repo; auth for admin flows uses Supabase OAuth and route handlers under `app/auth/`.

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
│   ├── gallery/                  # Public gallery + OG
│   ├── admin/                    # Supabase-auth gallery admin; /admin/gallery → redirect /admin
│   ├── api/                      # Route handlers (Last.fm, GitHub, weather, guestbook)
│   ├── auth/callback/            # Supabase OAuth exchange → redirect
│   ├── components/               # UI: nav, cards, theme, weather, listening, GitHub heatmap, …
│   ├── hooks/                    # e.g. use-now-playing.ts
│   └── lib/                      # og.tsx, substack RSS helpers
├── components/notes/             # MDX shortcodes: Theorem, Proof, Definition, Example, NoteBlock
├── lib/                          # Shared server-oriented helpers + Vitest tests
│   ├── supabase.ts               # Lazy anon Supabase client (getSupabaseAnon)
│   ├── now-playing.ts            # Types for Last.fm payload
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
| Fonts | `@fontsource/*` (Nunito, Bitter, JetBrains Mono), `geist` (sans/mono CSS variables) |
| Auth / data | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) for OAuth, gallery, optional listening DB writes |
| Monitoring | `@sentry/nextjs` (optional DSN), Vercel Analytics + Speed Insights |
| Testing | Vitest **3** |

Pinned versions are in [`package.json`](package.json).

---

## Routes and features

| Route | What it does |
| --- | --- |
| `/` | Identity block, Last.fm line + card, Berkeley weather, project list with live GitHub stars, Substack RSS snippets |
| `/about` | Education, experience, courses, volunteering |
| `/projects` | Project cards + **GitHub contribution calendar** (client component, data from `/api/github/contributions`) |
| `/notes` | Index of courses / note collections |
| `/notes/...` | Nested segments; individual notes are often `page.mdx` (e.g. CS61A Scheme topics) |
| `/gallery` | Photo grid + lightbox; data from Supabase `gallery_photos` + Storage |
| `/admin` | Google OAuth via Supabase; **restricted to an allowlisted email** in client code — **you must enforce the same rules in Supabase RLS** for production safety |
| `/admin/gallery` | Redirects to `/admin` |

The main nav **Blog** link points to external [Substack](https://substack.com/@kaiiiichen); there is no `/blog` route in-app.

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
| `POST /api/guestbook` | JSON body `{ email, message }` → insert into Supabase `guestbook` via anon client | No auth; relies on **Supabase RLS** and sensible limits in the database |

**Guestbook** is only referenced from API + docs; ensure any front-end or future form respects abuse concerns (rate limits, validation) at the edge or in Supabase policies.

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. **Never commit** real secrets.

### Always safe to document (names only)

| Variable | Role |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin; used for Supabase OAuth `redirectTo` (set production URL on Vercel). |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (browser + server routes using `getSupabaseAnon()`). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Used by `/api/lastfm/now-playing` for DB writes and any server path that must bypass RLS — keep off the client bundle. |
| `LASTFM_API_KEY` | Last.fm API. If unset, the now-playing API returns a graceful “not playing” / DB fallback without calling Last.fm. |
| `GITHUB_TOKEN` | Fine-grained or classic PAT for GitHub API (contributions + stars). If missing, some features error or return empty data. |

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

### CI placeholders

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) sets dummy `NEXT_PUBLIC_SUPABASE_*` values so `next build` can prerender pages that call `createBrowserClient` at module scope (e.g. `/admin`). These are **not** real credentials.

---

## MDX lecture notes

- Notes are **route segments** with `page.mdx` files (e.g. `app/notes/cs61a/scheme-quote/page.mdx`), not a separate `content/` directory.
- Shared layout: [`app/notes/layout.tsx`](app/notes/layout.tsx) (imports KaTeX CSS, width/padding).
- MDX components and typography are centralized in [`mdx-components.tsx`](mdx-components.tsx).
- Custom shortcodes (Theorem, Definition, Proof, Example, NoteBlock) live in [`components/notes/`](components/notes/) and are registered globally for MDX.
- Metadata in MDX files often uses `export const metadata = { title, description }` (Next.js metadata), not always YAML frontmatter.

To add a new note: create a folder + `page.mdx` under `app/notes/`, match existing note headers (breadcrumb, title block) for visual consistency, and run `npm run build` to validate the MDX pipeline.

---

## External integrations

| Service | Use in this repo |
| --- | --- |
| **Last.fm** | Recent / now-playing track |
| **Apple iTunes Search API** | Album art fallback |
| **GitHub GraphQL** | Contribution calendar |
| **GitHub REST** | Repo stars, commit search |
| **Open-Meteo** | Weather (no API key) |
| **Supabase** | Auth, gallery tables + storage, guestbook insert, listening history (optional) |
| **Substack RSS** | Home page “latest posts” (`app/lib/substack.ts`) |

---

## Local development

- **Node 20**, **npm install** then **`npm run dev`**.
- If MDX fails to compile, confirm you did not remove the `--webpack` flag from scripts.
- **Supabase:** for full gallery/admin behavior, configure a project and env vars; for static pages only, you can omit keys where the build allows (see CI placeholders for build-time behavior).

### Common issues

| Symptom | Things to check |
| --- | --- |
| MDX differs between dev and prod | Ensure both use Webpack (`--webpack`). |
| GitHub widgets empty | `GITHUB_TOKEN` set and not expired; API rate limits. |
| OAuth redirect wrong host | `NEXT_PUBLIC_SITE_URL` and Supabase redirect URLs match Vercel domain. |
| Sentry noisy locally | DSN unset disables reporting; or lower sample rate in `instrumentation-client.ts`. |

---

## Testing

Unit tests use **Vitest** and live next to helpers under `lib/*.test.ts` (RSS parsing, weather mapping, Last.fm helpers).

```bash
npm run test
npm run test:watch
```

There are currently **no** Playwright/E2E tests in this repo; manual browser checks matter for layout and OAuth flows.

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
2. Set environment variables in the Vercel project (production + preview as needed), especially `NEXT_PUBLIC_SITE_URL` and Supabase URLs for OAuth.
3. Pushes to `main` typically deploy production; preview deployments use PR branches.

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
| GitHub login / repos | `app/api/github/contributions/route.ts`, `app/components/project-stars.tsx`, home page `PROJECTS` |
| Supabase project + admin allowlist | `lib/supabase.ts`, `app/admin/page.tsx`, Supabase dashboard (RLS, Storage) |
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
