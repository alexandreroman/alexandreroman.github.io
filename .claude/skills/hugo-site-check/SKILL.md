---
name: hugo-site-check
description: >
  Verify the content, layout, and performance of the Hugo site by opening it
  in a real browser. Use this skill whenever the user asks to check the site,
  preview a page, verify visual rendering, or analyse performance.
compatibility: Requires the chrome-devtools MCP server (chrome-devtools-mcp).
---

# Hugo Site Check

## When to use this skill

Activate this skill when the user asks you to:

- Check or preview the site / a page
- Verify content, layout, or visual rendering
- Analyse site performance (Core Web Vitals, LCP, CLS, etc.)
- Compare local vs production performance
- Debug rendering or layout issues

## Important: always use Chrome

**Always use the Chrome browser through the `chrome-devtools` MCP tools** to
inspect pages. Never rely on fetching HTML with `curl`/`WebFetch` or reading
the generated files in `public/` to judge visual output or performance. The
browser is the source of truth.

### Available chrome-devtools tools

| Tool | Purpose |
|------|---------|
| `navigate_page` | Open a URL in Chrome |
| `take_snapshot` | Get a text snapshot (a11y tree) of the page |
| `take_screenshot` | Capture a visual screenshot |
| `performance_start_trace` | Start a performance recording |
| `performance_stop_trace` | Stop the recording |
| `performance_analyze_insight` | Drill into a specific performance insight |
| `list_console_messages` | Check for JS errors |
| `list_network_requests` | Inspect network activity |
| `evaluate_script` | Run JS in the page context |

## Chrome cache: bust it after code changes

Chrome aggressively caches static assets (JS, CSS) served by Hugo's dev server.
After modifying a file in `static/`, **always verify that Chrome is serving the
updated version** before drawing any conclusions from a trace or snapshot.

1. Navigate to the raw asset URL (e.g. `/js/chat.js`) and check its content
   with `take_snapshot` or `evaluate_script`.
2. If the old code is still served, do a cache-busting reload:
   `navigate_page` with `type: reload` and `ignoreCache: true`.
3. Only then run a performance trace or visual check.

Skipping this step can lead to wasted traces that measure the **old** code
while you believe you're testing the new one.

## Workflow: content / layout check

1. Navigate to the target URL with `navigate_page`.
2. Take a snapshot (`take_snapshot`) to read the page content and structure.
3. Optionally take a screenshot (`take_screenshot`) for visual verification.
4. Check the console for errors (`list_console_messages`).
5. Report findings to the user.

## Workflow: performance analysis

1. Navigate to the target URL with `navigate_page`.
2. **Bust the cache first** (see section above) if any static assets were
   recently modified.
3. Start a performance trace with `performance_start_trace` (set `reload: true`
   and `autoStop: true` for a full page-load trace).
4. Review the summary metrics (LCP, CLS, TTFB).
5. Drill into relevant insights with `performance_analyze_insight` (e.g.
   `LCPBreakdown`, `RenderBlocking`, `ThirdParties`, `Cache`).
6. Summarise results and provide actionable recommendations.

## Worktree support

When checking a site running from a **Git worktree**, the Hugo server will be
on a different port than 1313. Steps:

1. Check that Hugo is running from the worktree directory. If not, start it
   with `--port 0` to let Hugo pick an available port automatically.
2. Read the Hugo output to find the assigned port and URL.
3. Use that URL for all `navigate_page` / `take_screenshot` calls.
4. **Stop the worktree Hugo server** after verification (kill the process).

If `npm install` hasn't been run in the worktree yet, run it before starting
Hugo — the worktree does not share `node_modules` with the main repo.

## Typical URLs

- **Local dev (main)**: `http://127.0.0.1.nip.io:1313/` (Hugo default server)
- **Local dev (worktree)**: `http://127.0.0.1.nip.io:<port>/` (port from Hugo output)
- **Production**: `https://alexandreroman.fr`
