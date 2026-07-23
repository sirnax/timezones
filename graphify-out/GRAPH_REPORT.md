# Graph Report - /Users/nathanlord/VS/timezones/timezones  (2026-07-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 180 nodes · 215 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ffe7a10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Toast Notification System|Toast Notification System]]
- [[_COMMUNITY_Timezone Map Core Features|Timezone Map Core Features]]
- [[_COMMUNITY_Card  Badge  Auth Layout|Card / Badge / Auth Layout]]
- [[_COMMUNITY_Accordion & Overlay Primitives|Accordion & Overlay Primitives]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Command Palette & Dialog|Command Palette & Dialog]]
- [[_COMMUNITY_shadcn Component Config|shadcn Component Config]]
- [[_COMMUNITY_Layout & Pagination|Layout & Pagination]]
- [[_COMMUNITY_Build & Lint Tooling|Build & Lint Tooling]]
- [[_COMMUNITY_Form Components|Form Components]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Capital` - 7 edges
3. `getUtcOffsetMinutes()` - 7 edges
4. `tailwind` - 6 edges
5. `aliases` - 6 edges
6. `getTimezoneAbbreviation()` - 6 edges
7. `TimeSlider()` - 5 edges
8. `formatUtcOffset()` - 5 edges
9. `scripts` - 5 edges
10. `WorldClock OG Image Banner` - 5 edges

## Surprising Connections (you probably didn't know these)
- `FavouritesPanelProps` --references--> `Capital`  [EXTRACTED]
  app/components/favourites-panel.tsx → lib/capitals-data.ts
- `SearchBarProps` --references--> `Capital`  [EXTRACTED]
  app/components/search-bar.tsx → lib/capitals-data.ts
- `WorldMapProps` --references--> `Capital`  [EXTRACTED]
  app/components/world-map.tsx → lib/capitals-data.ts
- `TimeSlider()` --calls--> `formatUtcOffset()`  [EXTRACTED]
  app/components/time-slider.tsx → lib/timezone-utils.ts
- `TimeSlider()` --calls--> `getTimezoneAbbreviation()`  [EXTRACTED]
  app/components/time-slider.tsx → lib/timezone-utils.ts

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "NPM Dependencies"
Cohesion: 0.04
Nodes (48): dependencies, class-variance-authority, clsx, cmdk, d3, date-fns, embla-carousel-react, framer-motion (+40 more)

### Community 1 - "Toast Notification System"
Cohesion: 0.11
Nodes (23): FavouritesPanelProps, SearchBar(), SearchBarProps, TimeSlider(), TimeSliderProps, TimezoneMapApp(), WorldMap, WorldMapProps (+15 more)

### Community 2 - "Timezone Map Core Features"
Cohesion: 0.08
Nodes (25): browserslist, devDependencies, eslint, eslint-config-next, eslint-plugin-prettier, eslint-plugin-react-hooks, postcss, tailwind-merge (+17 more)

### Community 3 - "Card / Badge / Auth Layout"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 4 - "Accordion & Overlay Primitives"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.19
Nodes (8): dmSans, jakartaSans, jetbrainsMono, metadata, ChunkLoadErrorHandler(), ThemeProvider(), Toaster(), ToasterProps

### Community 6 - "Command Palette & Dialog"
Cohesion: 0.40
Nodes (6): WorldClock OG Image Banner, Clock and Compass Icons, Dark Navy / Teal Visual Theme, Wireframe Globe Motif, Interactive Time Zone Map Tagline, WorldClock Brand Name

### Community 7 - "shadcn Component Config"
Cohesion: 0.67
Nodes (4): Brand Palette (Dark Navy #1a1a2e + Cyan #00d4ff), Clock Motif (Center Hands), Globe Motif (Meridian & Latitude Lines), Timezones Favicon (Globe + Clock)

## Knowledge Gaps
- **115 isolated node(s):** `TimeSliderProps`, `WorldMap`, `dmSans`, `jakartaSans`, `jetbrainsMono` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `NPM Dependencies` to `Timezone Map Core Features`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **What connects `TimeSliderProps`, `WorldMap`, `dmSans` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `Toast Notification System` be split into smaller, more focused modules?**
  _Cohesion score 0.11095305832147938 - nodes in this community are weakly interconnected._
- **Should `Timezone Map Core Features` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Card / Badge / Auth Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Accordion & Overlay Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._