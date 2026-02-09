# Project: alexandreroman.fr

- Hugo static site with Tailwind CSS (PostCSS via Hugo Pipes)
- Dev server: `make dev` (port 1313 by default), or `make dev PORT=<port>` to override
- Local dev URL: `http://127.0.0.1.nip.io:<port>/`
- Static JS files in `static/js/` — Hugo watches them but browser may cache aggressively; use hard reload or cache-busting to verify changes

## Workflow

**Always use git worktrees** for planned modifications, even small ones (single-line changes). Use the `git-worktree` skill whenever implementing a plan — not just when `EnterPlanMode` is used. If the user provides a ready-made plan to implement, still create a worktree branch before making changes.
