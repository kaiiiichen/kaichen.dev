# AGENTS.md — kaichen.dev

Shared instructions for any AI coding agent (Cursor, Claude Code, Codex, etc.)
working on this repo.

## Git workflow — ALWAYS branch + PR

**Never push directly to `main`.** `main` is protected; pushes must go through
a pull request with required status checks. Even if the agent has bypass
permissions, use the PR flow.

For every change:

1. Create a feature branch off the latest `main`:
   ```bash
   git checkout main && git pull --ff-only
   git checkout -b <type>/<short-description>
   ```
   Branch name format: `fix/…`, `feat/…`, `chore/…`, `docs/…`, `refactor/…`.

2. Commit with a conventional-style message. **Every commit in this repo must
   credit Claude as a co-author** — `.githooks/prepare-commit-msg` appends the
   trailer automatically once `npm install` has run, but include it explicitly
   anyway (e.g. when you commit via an API/web editor that skips git hooks):

   ```
   <type>: <imperative summary>

   <optional body explaining the why>

   Co-authored-by: Claude <noreply@anthropic.com>
   ```

3. Push the branch and open a PR with `gh pr create`:
   ```bash
   git push -u origin HEAD
   gh pr create --title "<type>: <summary>" --body "$(cat <<'EOF'
   ## Summary
   - …

   ## Test plan
   - [ ] …
   EOF
   )"
   ```

4. Wait for CI (lint + typecheck + test + build) to pass. Do **not** force-push
   to `main`. Do **not** bypass required status checks.

5. If the user asks for a direct commit to `main`, push back on it and default
   to the PR flow unless they explicitly override with a clear reason.

## Before you commit

Run the same sequence CI runs — fail fast locally:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

## Git hooks (co-author trailer)

This repo ships a `prepare-commit-msg` hook at `.githooks/prepare-commit-msg`
that appends `Co-authored-by: Claude <noreply@anthropic.com>` on every commit
(skipped for merge commits). `npm install` sets `core.hooksPath = .githooks`
via the `postinstall` script, so the hook activates automatically after a
fresh clone + install.

If you commit in an environment where the hook can't run (GitHub web editor,
some sandboxed agents, `-n` / `--no-verify` situations), add the trailer
manually so the policy is never silently dropped.

## Secrets

Never commit `.env.local`, `.env.vercel.check`, `.env.sentry-build-plugin`, or
anything matching `*.local` / `*.secret`. Check `git status` before staging.
