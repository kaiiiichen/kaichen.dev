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

2. Commit with a conventional-style message:
   ```
   <type>: <imperative summary>

   <optional body explaining the why>
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

## Secrets

Never commit `.env.local`, `.env.vercel.check`, `.env.sentry-build-plugin`, or
anything matching `*.local` / `*.secret`. Check `git status` before staging.
