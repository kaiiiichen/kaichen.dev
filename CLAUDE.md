@AGENTS.md

# kaichen.dev — Claude Code Context

## Project Overview
Personal website of Kai Chen. Built with Next.js 15 (App Router) + Tailwind CSS + TypeScript.
Deployed on Vercel. Spotify proxy runs on Railway.

## Key Architecture
- Spotify data comes from Railway proxy (https://kaichendev-production.up.railway.app), NOT from /api/spotify directly
- Guestbook uses Supabase
- GitHub activity uses GitHub GraphQL API
- Weather uses Open-Meteo (no key needed)

## Environment Variables
See .env.example for all required keys.

## Important Files
- hooks/use-now-playing.ts — Spotify polling hook, fetches from Railway every 1s
- lib/spotify.ts — Spotify token refresh logic (fallback only)
- lib/supabase.ts — Supabase client
- spotify-proxy/index.js — Railway service, polls Spotify every 1s
- components/SpotifyBar.tsx — Global bottom bar (shown on all pages except /)

## Dev Commands
- npm run dev — start Next.js dev server
- cd spotify-proxy && node index.js — start Spotify proxy locally

## Conventions
- All prompts from user are delivered as single copyable code blocks
- Keep components simple and consistent with existing style
- Dark mode support required for all new components
