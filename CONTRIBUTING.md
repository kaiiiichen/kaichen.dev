# Contributing to kaichen.dev

Thanks for your interest. This repo is a **personal site** ([kaichen.dev](https://kaichen.dev)), but fixes, docs improvements, and small enhancements are welcome.

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md) first.

---

## Prerequisites

- **Node.js 20** (aligned with CI and `@types/node`)
- **npm** (lockfile is `package-lock.json` — use `npm ci` in CI-like runs)

---

## Local setup

```bash
git clone https://github.com/kaiiiichen/kaichen.dev.git
cd kaichen.dev
npm install
cp .env.example .env.local
```

Edit `.env.local` with your own keys. You do **not** need every integration to run the app locally (see [README.md](README.md)); missing API keys may disable some sections or APIs.

**Do not commit** `.env.local`, tokens, or Sentry auth tokens.

---

## Commands (same as CI)

Before opening a PR, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Our [GitHub Actions workflow](.github/workflows/ci.yml) runs these steps on every push/PR to `main`. PRs should keep CI green.

---

## Project conventions

- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- **MDX:** Content uses Webpack-based `@mdx-js/loader` — `npm run dev` and `npm run build` use **`--webpack`** so MDX behavior matches production. Avoid relying on Turbopack-only behavior for `.mdx` files.
- **Style:** Match existing patterns (components, naming, Tailwind). Prefer small, focused changes over large refactors unless discussed.
- **Dark mode:** New UI should respect light/dark (`dark:` variants and theme patterns used elsewhere).
- **Secrets:** Never add real API keys, DSN secrets, or `SENTRY_AUTH_TOKEN` to the repo. Use `.env.example` for **names only** (empty or placeholder values).

---

## Fork-specific content

If you fork for your own site, you will typically replace copy, nav links, Last.fm user, Supabase project, GitHub usage, and Substack feeds — see the **Forking** section in [README.md](README.md).

---

## Pull requests

- Open a PR against **`main`**.
- Describe **what** changed and **why** (short is fine).
- Link related issues if any.
- If you change user-facing behavior or env vars, update **README.md** or **`.env.example`** when appropriate.

Use the [pull request template](.github/pull_request_template.md) when you open a PR (GitHub will pre-fill it).

---

## Issues

Use [issue templates](.github/ISSUE_TEMPLATE/) for bugs and feature ideas. For **security issues**, follow [SECURITY.md](SECURITY.md) instead of filing a public issue with exploit details.

---

## Questions

For small questions, a GitHub Discussion or Issue is fine. This is a side project; response time may vary.
