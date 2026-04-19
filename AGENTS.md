# AGENTS.md — kaichen.dev

Instructions for **AI coding agents** (Cursor, Claude Code, Codex, Copilot, etc.) and anyone running **automated** edits against this repository.

**Human-oriented** contributor docs: [CONTRIBUTING.md](CONTRIBUTING.md). **Full project reference:** [README.md](README.md) (architecture, APIs, environment variables, CI, MDX, deployment).

---

## Owner defaults (read first)

- **Remote:** Use **SSH** — `git@github.com:kaiiiichen/kaichen.dev.git`. If `origin` is HTTPS and push fails with “could not read Username”, set: `git remote set-url origin git@github.com:kaiiiichen/kaichen.dev.git`.
- **Default branch:** Always **`main`** (not `master`).
- **Merge policy:** **Open a PR and merge through GitHub** every time — no direct pushes to `main`, even when the agent could technically push.

---

## Git workflow — always branch + PR

**Never push directly to `main`.** Treat `main` as protected: every change goes through a **pull request** with CI green. Even with bypass permissions, use the PR flow unless the repository owner explicitly overrides with a written reason.

### Steps

1. **Branch** from latest `main`:

   ```bash
   git checkout main && git pull --ff-only
   git checkout -b <type>/<short-description>
   ```

   Prefix examples: `fix/`, `feat/`, `chore/`, `docs/`, `refactor/`.

2. **Commit** using conventional-style messages:

   ```
   <type>: <imperative summary>

   <optional body>

   Co-authored-by: Claude <noreply@anthropic.com>
   ```

   The `Co-authored-by` line is **required** for this repo’s policy (see [Git hooks](#git-hooks) below). If your tool cannot run hooks, append the trailer manually.

3. **Push** and **open a PR**:

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

4. **Wait for CI** — lint, typecheck, test, build. Do not force-push to `main` or skip required checks without owner approval.

5. If the user asks to **commit straight to `main`**, default to explaining the PR workflow and ask for explicit exception.

---

## Before you commit

Mirror CI locally:

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

Update **[README.md](README.md)** and/or **[`.env.example`](.env.example)** when you change routes, APIs, or required environment variables.

---

## Git hooks (co-author trailer)

- Hook path: **`.githooks/prepare-commit-msg`**
- Activation: `npm install` runs `postinstall` → `git config core.hooksPath .githooks` (best effort; may fail in some sandboxes — set manually if needed).
- Behavior: appends `Co-authored-by: Claude <noreply@anthropic.com>` via `git interpret-trailers` (skipped for **merge** commits; idempotent if trailer exists).

If hooks do not run (web editor, `--no-verify`, CI-only commits), **add the trailer by hand** so policy is not dropped silently.

---

## Secrets — never commit

Do not stage or commit:

- `.env.local`, `.env.vercel.check`, `.env.sentry-build-plugin`
- Any `*.local`, `*.secret`, or raw tokens

Run `git status` and `git diff --staged` before committing.

---

## Where to read more

| Topic | Document |
| --- | --- |
| APIs, env, CI, MDX, fork checklist | [README.md](README.md) |
| Human contribution process | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Short Claude Code stack summary | [CLAUDE.md](CLAUDE.md) |
| Security reporting | [SECURITY.md](SECURITY.md) |
| Cursor IDE git reminder | [`.cursor/rules/git-workflow.mdc`](.cursor/rules/git-workflow.mdc) |
