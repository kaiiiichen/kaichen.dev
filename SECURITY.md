# Security policy

This document describes how we handle **security-sensitive information** for the [kaichen.dev](https://kaichen.dev) site and this repository.

---

## Supported scope

We care about vulnerabilities that affect:

- **Production** behavior at `kaichen.dev` (including Vercel-hosted Next.js routes and static assets).
- **Repository automation** (GitHub Actions workflows, Dependabot-related automation) when they could lead to secret exfiltration or unauthorized repository changes.
- **User data** processed through **Supabase** (guestbook rows, listening history) when issues stem from **this application’s** code or documented deployment practices.

We do **not** provide a formal bug bounty program. Reports are handled **best-effort**.

---

## How to report a vulnerability

**Do not** open a public GitHub issue with exploit details, payloads, or step-by-step instructions that put other users at risk.

Instead:

1. **Contact the maintainer privately**, using one of:
   - The email listed on the [About](https://kaichen.dev/about) page, or
   - GitHub **private security advisories** for this repository (if enabled), or
   - A direct message to [@kaiiiichen](https://github.com/kaiiiichen) for **non-sensitive** coordination only (not for long exploit write-ups).

2. Include **what component** is affected (e.g. route path, API handler name), **impact**, and **minimal reproduction** steps where safe.

3. Allow reasonable time for triage before public disclosure. Coordinated disclosure is appreciated.

---

## What we will do

- Acknowledge receipt when possible.
- Investigate and patch or mitigate **critical** issues in production configuration or code when they fall within project control.
- Credit reporters in release notes or advisories if they want attribution (optional).

---

## Secrets hygiene (for contributors)

- **Never commit** `.env.local`, API tokens, `SENTRY_AUTH_TOKEN`, Supabase **service role** keys, or GitHub personal access tokens.
- If a secret was ever committed — even briefly — **rotate it** in the provider (Supabase, GitHub, Last.fm, Vercel, Sentry) and **purge** from git history if the repo was public.
- Files such as `.env.vercel.check` from `vercel env pull` are **gitignored**; treat them like secrets on disk.

See also [README.md — Environment variables](README.md#environment-variables) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Dependency updates

Automated **Dependabot** PRs and the [auto-merge workflow](.github/workflows/auto-merge.yml) only affect **semver patch/minor** dependency updates; **major** upgrades for core frameworks are intentionally manual (see [`.github/dependabot.yml`](.github/dependabot.yml)). Report **supply-chain** concerns through the same private channels if you believe automation is unsafe.

---

## Out of scope (examples)

Reports may be **declined** or redirected when they concern:

- Third-party services’ policies (Last.fm, GitHub, Vercel, Supabase product bugs) — use their official channels.
- **Social engineering** or account takeover of maintainer accounts outside this codebase.
- **Theoretical** issues without a plausible attack path against deployed configuration.
- Content **spam** on optional features (e.g. guestbook) unless tied to a clear application defect; operational mitigations (rate limits, RLS) may be tracked separately.

---

## Safe harbor

If you make a **good-faith** effort to avoid privacy violations, data destruction, or service disruption — and you report issues responsibly — we will not pursue legal action against you. Do not access data that is not yours, and do not perform destructive tests on production.

---

## Related documents

- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community behavior.
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to submit code changes.
- [README.md](README.md) — architecture and API overview.
