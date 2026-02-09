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

Before writing any code, create a feature branch and worktree:

```bash
# Pick a short, descriptive branch name
git worktree add ../alexandreroman.fr-<branch> -b <branch>
```

The worktree is placed **next to** the main repo directory (sibling folder)
so it doesn't interfere with the current tree.

### 2. Work inside the worktree

All file reads, edits, and writes for the planned change must target the
worktree path (`../alexandreroman.fr-<branch>/...`), **not** the main repo.

If the project has dependencies (e.g. `npm install`), run them inside the
worktree as well.

### 3. Verify

Run the dev server and any checks from within the worktree. If the
`hugo-site-check` skill is used, make sure the server started is the one
from the worktree.

### 4. Merge back

Once the change is validated:

```bash
# From the main working tree
git merge <branch>
```

Then clean up:

```bash
git worktree remove ../alexandreroman.fr-<branch>
git branch -d <branch>
```

### 5. If the change is abandoned

```bash
git worktree remove ../alexandreroman.fr-<branch>
git branch -D <branch>
```

## Rules

- **Never commit planned changes directly to the current branch.** Always use
  a worktree.
- The worktree branch name should reflect the change (e.g.
  `feat/precompile-css`, `fix/lcp-performance`).
- Keep the main working tree on the original branch at all times during the
  plan execution.
