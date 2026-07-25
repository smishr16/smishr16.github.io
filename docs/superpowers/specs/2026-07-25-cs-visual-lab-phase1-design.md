# CS Visual Lab — Phase 1 Design

**Date:** 2026-07-25  
**Status:** Approved (brainstorming)  
**Repo:** smishr16/smishr16.github.io  
**Working title:** CS Visual Lab  

## Summary

Build a portfolio-grade educational SPA on GitHub Pages that teaches CS concepts with interactive visualization and runnable Python. Phase 1 ships a dark refined shell, an editorial home page, a course map, and one deep Sorting lab in an IDE workspace layout. Algorithms are visualized in 2D; learners run guided Python (Pyodide). Rust free-form compile, 3D, and additional modules are deferred.

## Goals

- Replace the 2019 Hello World page with a distinctive teaching product surface.
- Primary audience: learners who can already code a little.
- First lesson: sorting (Bubble, Insertion, Merge) with playable steps and a Python lab path.
- Quality bar: portfolio-grade polish (motion, typography, dark UI), not a thin wireframe.

## Non-goals (Phase 1)

- Free-form Rust compilation in the browser
- 3D visualizations
- Full curriculum (data structures, OS, search beyond teaser cards)
- User accounts, progress sync, or any backend
- CMS / remote content

## UX decisions (locked)

| Area | Decision |
|------|----------|
| Lab layout | **IDE workspace**: left nav rail, algorithm tabs, code editor ‖ 2D viz, bottom console, Run control |
| Home | **Editorial landing**: strong headline, subcopy, primary CTA, course cards (Sorting live / others soon) |
| Theme | Dark refined: deep charcoal base, teal accent, blue value bars, amber for compare/active |
| Code runtime | Python via Pyodide, lazy-loaded |
| Visualization | 2D first |
| Stack | Vite + TypeScript SPA on GitHub Pages |

## Information architecture

| Route | Purpose |
|-------|---------|
| `/` | Editorial home |
| `/learn` | Course map |
| `/learn/sorting` | Sorting IDE lab |

### Home

- Brand: CS Visual Lab
- Headline + short value prop (“see computer science as it runs”)
- CTA → Sorting lab
- Cards: Sorting (Live), Search / Structures / Systems (Soon)

### Sorting lab (IDE)

- **Rail:** brand, Home, Learn, active lesson indicator
- **Top:** algorithm tabs (Bubble, Insertion, Merge); array size / shuffle; Run
- **Main:** Monaco or CodeMirror editor | Visualizer2D
- **Bottom:** console (step narrative, Python stdout/stderr)
- **Transport:** play, pause, step, reset, speed
- **Mobile:** collapse rail; stack viz → code → console

## System architecture

```
UI Shell (router, tokens, nav)
    │
    ├── LessonRegistry (metadata, status, routes)
    │
    ├── SortingAlgorithms (pure TS → step stream)
    ├── StepEngine (queue, play/pause/step/speed)
    ├── Visualizer2D (bars + highlights + a11y text)
    │
    └── LabBridge + PyodideBridge
            guided Python hooks → same step events
            Reference mode: built-in TS without Pyodide
```

### Module responsibilities

| Module | Responsibility | Dependencies |
|--------|----------------|--------------|
| LessonRegistry | Lesson ids, titles, live/soon, paths | none |
| SortingAlgorithms | Emit deterministic step streams for bubble, insertion, merge | none |
| StepEngine | Hold steps; transport; current index; speed | step stream |
| Visualizer2D | Draw array state from steps; live status string | StepEngine |
| PyodideBridge | Lazy-load runtime; execute user code; timeout | vendored/CDN wasm |
| LabBridge | Python-facing compare/swap/get_array helpers; map to steps | StepEngine, Pyodide |
| UI Shell | Routes, IDE chrome, editorial home, theme | LessonRegistry |

### Shared step model

```ts
type SortStep =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'set'; index: number; value: number }
  | { type: 'mark'; indices: number[]; role: 'sorted' | 'pivot' | 'active' }
  | { type: 'done' };
```

### Python interaction model

- Guided lab, not unrestricted REPL for product-critical path.
- Starter templates (e.g. implement sort using provided hooks).
- **Run** executes in Pyodide; hooks record steps for the same visualizer as TS.
- **Reference mode** runs built-in TypeScript algorithms so the lab works before/without Pyodide.
- Load Pyodide lazily on first lab open or first Run so the home page stays fast.

## Content (Sorting)

- Short concept intro: sorting purpose; intuition for comparisons and complexity.
- Per algorithm: plain-language idea + complexity callout (worst/average as appropriate).
- Algorithms in Phase 1: Bubble, Insertion, Merge.
- At least one Python starter exercise template.

## Error handling

| Situation | Behavior |
|-----------|----------|
| Pyodide loading | Show loading state; Reference mode available |
| Python syntax/runtime error | Message in console; array/viz recoverable via Reset |
| Long / runaway execution | Wall-clock timeout; abort with console message |
| Array size out of range | Clamp (suggested 4–64) |
| Unknown route | Friendly dark 404 with link home |
| `prefers-reduced-motion` | Reduce nonessential animation |

## Accessibility

- Semantic landmarks and logical focus order (rail → tabs → editor → transport → console).
- Visualizer exposes a live text summary of the current step.
- Visible focus rings on dark surfaces.
- Keyboard-operable transport and tabs.

## Testing & quality

- Unit tests for algorithm step sequences on small fixed arrays.
- Unit tests for StepEngine bounds and transport.
- Manual checklist: home → learn → lab; reference run; Python run; error path; mobile stack.
- Performance: do not load Pyodide on the home route.

## Deploy

- Static site via GitHub Pages for `smishr16.github.io`.
- Vite production build to `dist/`; `base: '/'`.
- Ignore `.superpowers/` in git.
- README: install, dev server, build, deploy notes.

## Success criteria

A visitor can:

1. Open a polished editorial home (clearly not Hello World).
2. Reach the course map and Sorting lab.
3. Use the IDE lab: switch algorithms, play/step 2D visualization.
4. Edit a Python template, Run (after load), and see viz/console respond or show a clear error.
5. Use Reference mode without waiting on Python.

## Implementation sequence (for planning)

1. Scaffold Vite + TypeScript, design tokens, router, dark shell  
2. Editorial home + course map  
3. IDE lab chrome (structure only)  
4. StepEngine + Visualizer2D + TS sorting algorithms  
5. Playback controls + console  
6. PyodideBridge + LabBridge + starter template  
7. Lesson copy, a11y pass, motion polish, deploy pipeline  

## Future phases (not designed here)

- 3D interactive visualizations  
- Additional lessons (search, data structures, OS concepts)  
- Rust track / WASM labs  
- Deeper free-form code execution if needed  

## Approval record

- Scope: learning shell + first sorting lesson  
- Audience: can code a little  
- Runtime: Python (Pyodide)  
- Lab layout C, home A (visual companion)  
- Approach: Vite SPA + lesson engine  
- Full design approved in session 2026-07-25  
