# kaichen.dev — Claude Code context

@AGENTS.md — **read first** for Git workflow (branch + PR only, co-author trailer, secrets).

---

## What this repo is

Personal website of Kai Chen — **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS 4**, deployed on **Vercel**.

Canonical documentation: **[README.md](README.md)** (setup, routes, APIs, env, CI, MDX, forking).

---

## Architecture snapshot

| Concern | Implementation |
| --- | --- |
| **Now playing** | `GET /api/lastfm/now-playing` — Last.fm + optional iTunes art; optional Supabase writes (`listening_*`) with service role |
| **Client polling** | `app/hooks/use-now-playing.ts` — polls every **10s**; `Cache-Control` on API allows short CDN cache |
| **GitHub** | `GET /api/github/contributions` — GraphQL calendar + REST; `GET /api/github/stars` — star counts |
| **Weather** | `GET /api/weather` — Open-Meteo, fixed coordinates (Berkeley), revalidated fetch |
| **Notes** | MDX under `app/notes/**/page.mdx`; pipeline in `next.config.ts` (Webpack + `@mdx-js/loader`); components in `mdx-components.tsx` and `components/notes/` |
| **Observability** | Sentry via `instrumentation*.ts` + `sentry.*.config.ts` (DSN optional); Vercel Analytics / Speed Insights in root layout |
| **Theme** | `app/components/theme-provider.tsx` + inline script in `app/layout.tsx` — default **light** when unset |

---

## Commands

```bash
npm install   # also sets core.hooksPath → .githooks (co-author trailer)
npm run dev   # next dev --webpack — required for MDX parity
npm run lint && npm run typecheck && npm run test && npm run build
```

---

## Important paths

- [`lib/now-playing.ts`](lib/now-playing.ts) — types for Last.fm payload
- [`lib/lastfm-now-playing-helpers.ts`](lib/lastfm-now-playing-helpers.ts) — pure helpers used by the now-playing route (tested)
- [`app/lib/substack.ts`](app/lib/substack.ts) — RSS fetch + parse (tested)
- [`next.config.ts`](next.config.ts) — MDX webpack rule, `withSentryConfig`

---

## Conventions

- **Dark mode** — support `dark:` for new UI.
- **MDX** — do not assume Turbopack; dev/build use `--webpack`.
- **Secrets** — never commit `.env.local` or tokens; see AGENTS.md and README.
- **User prompts** — when the user sends copy-paste blocks, keep them as single fenced blocks when echoing back.
