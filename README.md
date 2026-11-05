# ChatGPT — Field Guide for UI Engineers

An interactive scroll presentation about ChatGPT: where it came from, how it works under the hood, what it can do today (Nov 2026) with step-by-step guides, and where it's heading. Built for the SoftConstruct UI team.

**Live:** https://sogomonyanarsen.github.io/chatgpt-presentation/

## Presenting

| Key                           | Action                                       |
| ----------------------------- | -------------------------------------------- |
| `→` / `PgDn` (clicker “next”) | Jump to the next stop (slide, panel or demo) |
| `←` / `PgUp` (clicker “back”) | Jump to the previous stop                    |
| `↑` / `↓` / `Space` / wheel   | Free scrolling                               |
| `M`                           | Chapter menu (`Esc` closes)                  |

The bottom year bar in the timeline is clickable. Deep links work too, e.g. `#capabilities`, `#cap-codex` or `#y2023`.

## Chapters

0. **Intro**: a pixel title that the camera flies through
1. **Origins**: a horizontal timeline from 2017 to 2026, in which panel colours move from archival paper to digital void
2. **Under the hood**: five live demos: a real `o200k_base` tokenizer, temperature/top-p sampling, causal attention, the training pipeline, and SSE streaming with `AbortController`
3. **Capabilities**: 10 features, each with _how to use it_, _under the hood_, a try-it prompt and a dev tip
4. **Playbook**: prompt anatomy, the Responses API (streaming and structured outputs), and a team checklist
5. **What's next**: six trends and what each means for UI developers
6. **Q&A**, plus sources and image credits

## Stack

- **Vite + TypeScript (strict) + SCSS**, no framework
- **GSAP ScrollTrigger** for pinning, horizontal travel and scrubbed “dive” timelines
- **Lenis** for smooth scrolling, sharing GSAP's RAF loop
- **Canvas 2D** for the starfield warp and the pixel-title dive (no WebGL dependency)
- **gpt-tokenizer** for the real BPE vocabulary, code-split and lazy-loaded only when the demo comes into view
- Self-hosted fonts via Fontsource: Anton, Silkscreen, Inter Tight, JetBrains Mono

## How the site itself works

- **Build-time prerendering.** `vite.config.ts` runs `src/templates/*` (pure string templates) and injects the full content into `index.html`. Content is in the HTML on first paint, crawlable and readable without JS. TypeScript only _enhances_ it with motion and demos.
- **Typed content.** All copy lives in `src/data/*.ts` with interfaces in `types.ts`. Code snippets are syntax-highlighted at build time (`templates/highlight.ts`), so there is no client-side highlighter.
- **Horizontal scroll** (`sections/hscroll.ts`). The section is pinned and the track is translated by exactly `scrollWidth - innerWidth`. Images use `containerAnimation` for parallax. Below 900px the panels stack vertically.
- **Presenter stops** (`core/stops.ts`). Each module registers a function that returns scroll positions. Horizontal panels convert their `offsetLeft` into the pinned scroll range.
- **Accessibility.** The page honours `prefers-reduced-motion` (no Lenis, pins or warp). It has a skip link, semantic landmarks, visible focus, `aria-live` on demo output, and real text behind every canvas effect.

```
src/
  core/        dom helpers, scroll (Lenis+GSAP), motion prefs, stop registry
  data/        all content: timeline, capabilities, future, chapters, sources
  templates/   build-time HTML templates + highlighter + pixel glyphs
  effects/     starfield, pixel title, scramble text
  sections/    hero, covers, horizontal scroll, dive transitions, chrome (menu/rail/keys)
  demos/       tokenizer, sampling, attention, streaming, prompt anatomy
  styles/      abstracts (tokens, mixins) → base → components → sections (BEM)
```

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # eslint (strict type-checked) + stylelint (SCSS, BEM)
npm run build      # typecheck + production build → dist/
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml` (lint → build → deploy).

## Content accuracy

Facts are current as of **5 November 2026**, and every claim links to a source in the Sources section on the page (`src/data/sources.ts`). The sampling and attention demos use illustrative values and say so on the page. The tokenizer is the real vocabulary. The two 2026 UI mock-ups are labelled as illustrations.

All photos and diagrams are from Wikimedia Commons under the licenses listed in `src/data/sources.ts` and shown on the page.
