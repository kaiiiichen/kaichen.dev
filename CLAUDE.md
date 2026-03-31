@AGENTS.md

# kaichen.dev — Claude Code Context

## Project Overview
Personal website of Kai Chen. Built with Next.js 15 (App Router) + Tailwind CSS + TypeScript.
Deployed on Vercel.

## Key Architecture
- Spotify data fetched directly via /api/spotify/now-playing (lib/spotify.ts handles token refresh)
- CDN caches the now-playing response for 10s (s-maxage=10), all users share one Spotify API call per interval
- Guestbook uses Supabase
- GitHub activity uses GitHub GraphQL API
- Weather uses Open-Meteo (no key needed)

## Environment Variables
See .env.example for all required keys.

## Important Files
- app/hooks/use-now-playing.ts — Spotify polling hook, polls /api/spotify/now-playing every 10s
- lib/spotify.ts — Spotify token refresh + now-playing fetch logic
- lib/supabase.ts — Supabase client
- app/components/spotify-bar.tsx — Global bottom bar (shown on all pages except /)

## Dev Commands
- npm run dev — start Next.js dev server

## Conventions
- All prompts from user are delivered as single copyable code blocks
- Keep components simple and consistent with existing style
- Dark mode support required for all new components
