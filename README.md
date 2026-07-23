# 🌍 Time Zones

An interactive world timezone map. Every country is shaded by its UTC offset, ~250 capital cities show their current local time, and a time slider lets you scrub the clock to see how times shift across the globe — complete with a live day/night terminator.

[![CI](https://github.com/sirnax/timezones/actions/workflows/ci.yml/badge.svg)](https://github.com/sirnax/timezones/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

## Features

- **Interactive D3 world map** — countries colored by UTC offset, with an offset legend
- **247 capital cities** pinned on the map, each showing its current local time with rich tooltips
- **Time slider** — scrub minutes and pick a date to preview local times anywhere in the world
- **Day/night terminator** — a live overlay showing which parts of the planet are in darkness
- **LIVE mode** — clocks auto-refresh every 30 seconds
- **City search** — quickly find any capital by city or country name
- **Favourites** — star cities to keep them in a sidebar (bottom drawer on mobile), persisted in `localStorage`
- **Fully responsive** — works from small phones to large desktops; the map re-fits its container live
- **Installable PWA** — add to home screen, works offline via a precaching service worker
- **Accessible** — WCAG 2.1 AA: keyboard-operable map markers, ARIA combobox search, visible focus, reduced-motion support

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org) (strict mode)
- [Tailwind CSS 4](https://tailwindcss.com)
- [D3](https://d3js.org) + [topojson-client](https://github.com/topojson/topojson-client) for map rendering
- [date-fns](https://date-fns.org), [framer-motion](https://motion.dev), [lucide-react](https://lucide.dev)

## Getting Started

Requires **Node.js 24+** (see [.nvmrc](.nvmrc)).

```bash
nvm use          # or install Node 24 any way you like
pnpm install
pnpm dev      # → http://localhost:3000
```

Production build:

```bash
pnpm build
pnpm start
```

Linting:

```bash
pnpm lint
```

Accessibility tests (Playwright + axe-core; builds must exist — run `pnpm build` first):

```bash
pnpm test:a11y
```

> **Note:** world geometry ([`world-atlas@2`](https://www.jsdelivr.com/package/npm/world-atlas)) is vendored at `public/data/countries-110m.json` and precached by the service worker, so the map renders offline after the first visit.

## Configuration

No secrets, database, or API keys required. Two optional environment variables are used only to build the site's metadata base URL:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO/OpenGraph metadata | `http://localhost:3000` |
| `VERCEL_PROJECT_PRODUCTION_URL` | Set automatically by Vercel deployments | — |

## Project Structure

```
app/
  page.tsx                    # Entry point (client-side loads the app)
  layout.tsx                  # Root layout, fonts, SEO metadata
  components/
    timezone-map-app.tsx      # Main orchestrator: header, search, map, slider
    world-map.tsx             # D3 map, country shading, city pins, night overlay
    search-bar.tsx            # City/country search
    favourites-panel.tsx      # Starred cities sidebar
    time-slider.tsx           # Date picker + time scrubber
lib/
  capitals-data.ts            # Dataset of 247 world capitals (lat/lng + IANA timezone)
  timezone-utils.ts           # Offset math, formatting, night-polygon computation
  utils.ts                    # Shared helpers
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and guidelines.

## License

[MIT](LICENSE) © 2026 Nathan Lord
