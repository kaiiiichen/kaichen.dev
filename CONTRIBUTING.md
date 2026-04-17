# Contributing to kaichen.dev

Thank you for reading this. [kaichen.dev](https://kaichen.dev) is primarily a **personal site**, but **bug fixes**, **documentation improvements**, and **small, focused enhancements** are welcome.

Before you contribute:

1. Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
2. Read [SECURITY.md](SECURITY.md) — **never** file public issues with exploit details.
3. Skim the [README](README.md) for architecture, scripts, and environment variables.

---

## Who this guide is for

| Audience | Also read |
| --- | --- |
| Human contributors | This file + [README](README.md) |
| AI coding agents (Cursor, Claude Code, etc.) | [AGENTS.md](AGENTS.md) — **branch + PR workflow** and commit conventions are mandatory |

Maintainers use **pull requests to `main`**; direct pushes to `main` are discouraged even when permissions allow.

---

## Prerequisites

- **Node.js 20** (matches [CI](.github/workflows/ci.yml) and `@types/node` in `package.json`).
- **npm** — the repo uses `package-lock.json`. For reproducible installs use `npm ci` (as CI does).

---

## Clone and install

```bash
git clone https://github.com/kaiiiichen/kaichen.dev.git
cd kaichen.dev
npm install
cp .env.example .env.local
```

Edit `.env.local` as needed. You **do not** need every integration to run the app locally:

- Missing **Last.fm** / **GitHub** keys usually degrade specific widgets.
- **Supabase** placeholders are injected in CI for `next build`; locally, real or dummy public keys may be required for pages that call `createBrowserClient` at import time — see [README — CI placeholders](README.md#ci-placeholders).

**Never commit** `.env.local`, `.env.vercel.check`, tokens, or `SENTRY_AUTH_TOKEN`.

---

## Git hooks (after `npm install`)

`package.json` runs `postinstall` to set `git config core.hooksPath .githooks`. The [prepare-commit-msg](.githooks/prepare-commit-msg) hook appends a `Co-authored-by` trailer for Claude on each commit (see [AGENTS.md](AGENTS.md)). If your environment skips hooks (e.g. some UIs), add the trailer manually when required by project policy.

---

## Mandatory checks (same as CI)

Before opening or updating a PR, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs these steps on **push** and **pull_request** to `main`. Keep CI green.

---

## Branch and pull request workflow

1. Branch from up-to-date `main`:

   ```bash
   git checkout main && git pull --ff-only
   git checkout -b <type>/<short-description>
   ```

   Prefix examples: `fix/`, `feat/`, `chore/`, `docs/`, `refactor/`.

2. Commit with clear messages (conventional style is appreciated: `type: summary`).

3. Push and open a PR against **`main`**. GitHub will suggest the [pull request template](.github/pull_request_template.md).

4. Describe **what** changed and **why**. Link issues with `Fixes #123` when applicable.

5. Update **[README.md](README.md)** and/or **[`.env.example`](.env.example)** if you change user-visible behavior, new routes, or required/optional environment variables.

---

## Project conventions

### Stack and rendering

- **Next.js 16** App Router, **React 19**, **TypeScript**, **Tailwind CSS 4**.
- **MDX** uses the **Webpack** loader configured in [`next.config.ts`](next.config.ts). Local `dev` and `build` scripts use **`--webpack`**. Do not rely on Turbopack-only behavior for `.mdx` files.

### Style

- Match existing component patterns, naming, and Tailwind usage.
- Prefer **small, reviewable diffs** over large refactors unless discussed in an issue first.
- **Dark mode:** new UI should work in light and dark (`dark:` variants and existing theme patterns).

### Secrets and config

- Add **variable names** (and short comments) to [`.env.example`](.env.example) when introducing new configuration — never real secrets.
- Do not add production keys, personal tokens, or Sentry auth tokens to the repository.

### Security-sensitive areas

If you touch **OAuth callbacks**, **API routes**, or **Supabase policies**, coordinate with the maintainer and document behavior in README or SECURITY as appropriate.

---

## Forking for your own site

See the **Forking this project** section in [README.md](README.md) for a checklist of files to replace (Last.fm user, GitHub repos, Supabase, Substack, etc.).

---

## Issues

Use [issue templates](.github/ISSUE_TEMPLATE/) for bugs and features. For **security issues**, follow [SECURITY.md](SECURITY.md) instead of posting exploit details in public issues.

---

## Questions

For small questions, open a GitHub Issue or Discussion. This is a side project; response time may vary.
