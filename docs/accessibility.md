# Accessibility

Time Zones targets **WCAG 2.1 AA**. Automated coverage lives in
[`tests/a11y.spec.ts`](../tests/a11y.spec.ts) (Playwright + axe-core, run with
`pnpm test:a11y` after `pnpm build`). This document covers the interaction model
and the manual walkthrough to repeat after UI changes.

## Keyboard model

Tab order: **skip link → search → LIVE → Favourites toggle → map markers (one
tab stop) → time slider → date → reference time zone**. When the sidebar is
open, its close button and remove buttons are tabbable after the map.

### Map markers (roving tabindex)

The ~250 city markers form a single tab stop; arrow keys rove between them,
ordered west → east by longitude.

| Key | Action |
| --- | --- |
| `Tab` | Enter/leave the marker group (one stop) |
| `→` / `←` | Next / previous city |
| `↓` / `↑` | Jump ±10 cities |
| `Home` / `End` | First / last city |
| `Enter` / `Space` | Toggle favourite |
| `Escape` | Dismiss tooltip |

Focusing a marker shows its tooltip (dismissable — SC 1.4.13) and a visible
cyan focus ring. Each marker exposes `role="button"`, `aria-pressed` for the
favourite state, and an accessible name of the form
"London, United Kingdom, local time 14:32 BST (UTC+1), favourite".

### Search (ARIA 1.2 combobox)

`↓`/`↑` move the active option (via `aria-activedescendant`), `Enter` toggles
the favourite, `Escape`/`Tab` close the list. Result counts and favourite
add/remove actions are announced through polite live regions.

### Panels

The Favourites toggle exposes `aria-expanded`/`aria-controls`. Closing the
desktop sidebar returns focus to the toggle. On mobile the panel is a vaul
drawer (`role="dialog"`) with focus trapping, swipe- and `Escape`-dismissal.

## Manual walkthrough (after UI changes)

1. `pnpm build && pnpm start`, open http://localhost:3000.
2. `Tab` from the address bar: skip link appears first; activate it — focus lands on the map region.
3. Walk the full tab order above; every stop must show a visible focus indicator.
4. On a marker: arrow across a few cities (tooltip follows focus), `Enter` to favourite — the live region announces it and the sidebar card appears; `Enter` again removes it; `Escape` hides the tooltip.
5. In search: type "lon", arrow to an option, `Enter` — announcement fires, input clears.
6. Close the sidebar with its close button — focus returns to the Favourites toggle.
7. Zoom to 200% — no loss of content or functionality, no horizontal scroll.
8. Narrow the window to < 768px — Favourites opens as a drawer; `Escape` closes it.
9. Enable "reduce motion" in OS settings — pulse/spin animations stop.
10. VoiceOver spot check (`⌘F5`): map group announces itself, markers read city/time/favourite state, search announces result counts.
