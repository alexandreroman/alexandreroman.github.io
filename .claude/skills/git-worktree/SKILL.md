---
name: git-worktree
description: >
  Use Git worktrees for important modifications that require a plan.
  This skill is activated automatically when entering plan mode.
autoActivate: true
---

# Git Worktree for Important Changes

## When this applies

This skill applies **automatically** whenever you enter plan mode
(`EnterPlanMode`) or when the user explicitly asks to work in a worktree.
Any modification that is significant enough to require a plan **must** be
developed in a dedicated Git worktree, not directly on the current branch.

## Why

- The main working tree stays clean and usable while the change is in progress.
- Easy to discard a failed attempt without polluting the main branch.
- Enables parallel work on multiple changes.

## Workflow

### 1. Create the worktree

Before writing any code, create a feature branch and worktree.
Use `-b` to create the new branch (it does not need to exist beforehand):

```bash
# Branch name: feature/<short-name>
# Worktree dir name: short suffix after "alexandreroman.fr-"
git worktree add -b feature/<short-name> ../alexandreroman.fr-<short-name>
```

The worktree is placed **next to** the main repo directory (sibling folder)
so it doesn't interfere with the current tree.

### 2. Work inside the worktree

All file reads, edits, and writes for the planned change must target the
worktree path (`../alexandreroman.fr-<short-name>/...`), **not** the main
repo.

### 3. Verify with Hugo

Start Hugo from the worktree on a **different port** so it doesn't
conflict with the main dev server (1313) or other worktrees.

**Always start Hugo as a background Bash command** so you can stop it
reliably afterwards:

```bash
cd ../alexandreroman.fr-<short-name>
make dev PORT=1314
# → note the background task ID from the response
```

Dependencies (`npm install`) are handled automatically by `make dev`.

Use the `hugo-site-check` skill pointing at that port to verify.

**After verification, always stop the Hugo server** using `TaskStop` with
the background task ID. This must happen **before** the integration and
cleanup steps. Never leave Hugo processes running.

### 4. Integrate into main (rebase, no merge commit)

Once the change is validated, rebase the feature branch onto main and
fast-forward main. **Never create merge commits** — the history must stay
linear.

```bash
# From the worktree: rebase onto main
cd ../alexandreroman.fr-<short-name>
git rebase main

# From the main working tree: fast-forward main
cd ../alexandreroman.fr
git merge --ff-only feature/<short-name>
```

### 5. Clean up (mandatory)

**Always** remove the worktree and branch at the end, whether the change was
integrated or abandoned. This step is **not optional**.

After a successful integration:

```bash
git worktree remove ../alexandreroman.fr-<short-name>
git branch -d feature/<short-name>
```

After an abandoned change:

```bash
git worktree remove ../alexandreroman.fr-<short-name>
git branch -D feature/<short-name>
```

## Rules

- **Never commit planned changes directly to the current branch.** Always use
  a worktree.
- **Never create merge commits.** Always rebase + fast-forward (`--ff-only`).
- **Always clean up the worktree and branch at the end of every operation.**
  No worktree or feature branch should remain after the task is complete.
- The worktree branch name should reflect the change (e.g.
  `feature/precompile-css`, `feature/round-favicon`).
- Keep the main working tree on the original branch at all times during the
  plan execution.
- Use `make dev PORT=<port>` to start Hugo in a worktree (handles dependencies automatically).
- Always clean up temporary scripts used during generation.
