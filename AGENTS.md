<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent notes — kaichen.dev

## Project

Personal Next.js 16 app (App Router, React 19, Tailwind v4). Production domain: **kaichen.dev** (second personal site; earlier static site: kai-chen.xyz). Deploy target: Vercel.

## Where things live

| Area | Path |
|------|------|
| Routes | `app/**/page.tsx` |
| API | `app/api/**/route.ts` |
| Shared UI | `app/components/` |
| Spotify logic | `lib/spotify.ts` |
| Supabase client | `lib/supabase.ts` (uses `NEXT_PUBLIC_*` only) |

## Behaviour to preserve

- **Theme:** Custom `ThemeProvider` in `app/components/theme-provider.tsx` + `beforeInteractive` script in `app/layout.tsx`. Do not reintroduce `next-themes` inline `<script>` inside React (React 19 warns/errors).
- **Message form:** `app/components/Guestbook.tsx` (default export: `MessageForm`); only POST to `/api/guestbook`. No public listing UI; GET handler is intentionally removed.
- **Spotify:** `RecentTrack` includes `albumArt`; support paused / idle states so last cover still shows when possible.
- **Subpage animation:** `SubpageEnter` in `app/layout.tsx` wraps `children` in `<main>`; skip animation when `usePathname() === "/"`.

## Env

See `.env.example` and root `README.md`. Never commit `.env.local`.

## Commands

`npm run dev`, `npm run build`, `npm run lint`.
