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

## Workflow: content / layout check

1. Navigate to the target URL with `navigate_page`.
2. Take a snapshot (`take_snapshot`) to read the page content and structure.
3. Optionally take a screenshot (`take_screenshot`) for visual verification.
4. Check the console for errors (`list_console_messages`).
5. Report findings to the user.

## Workflow: performance analysis

1. Navigate to the target URL with `navigate_page`.
2. Start a performance trace with `performance_start_trace` (set `reload: true`
   and `autoStop: true` for a full page-load trace).
3. Review the summary metrics (LCP, CLS, TTFB).
4. Drill into relevant insights with `performance_analyze_insight` (e.g.
   `LCPBreakdown`, `RenderBlocking`, `ThirdParties`, `Cache`).
5. Summarise results and provide actionable recommendations.

## Typical URLs

- **Local dev**: `http://127.0.0.1.nip.io:1313/` (Hugo default server)
- **Production**: `https://alexandreroman.fr`
