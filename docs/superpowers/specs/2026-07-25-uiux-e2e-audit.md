# E2E UI/UX Frontend Audit — CS Visual Lab

**Date:** 2026-07-25  
**Method:** Parallel read-only subagents (lab IDE · marketing/course · tokens/a11y/router) + orchestrator synthesis  
**Skills:** frontend-design, design-systems (Primer/Carbon density for lab; editorial dark for Learn), frontend-dev a11y

## Design stance

| Surface | Density | Reference |
|---------|---------|-----------|
| Learn / catalog | Medium editorial | Dark refined education marketing |
| Lab IDE | High / tool | Primer + Carbon IDE density |
| Charts | Fill stage; density-capped bars | Instrument panels, not marketing cards |

## P0 findings (must fix)

1. **Lab vertical fill broken** — `.viz-stage` lacks `grid-template-rows: minmax(0,1fr)`; canvas min-height-driven → empty stage when code collapses  
2. **Compare uses second layout system (flex)** fighting single-mode grid  
3. **SPA: no title / focus / scroll** on route change  
4. **No skip link**  
5. **Soon cards use opacity 0.55** (contrast failure)  
6. **Faux disabled `.btn` spans** on course work CTAs  
7. **`--motion` cascade broken** (always 1)

## P1 (high)

- Status vocabulary drift (Open vs Live)  
- Nav/home active + reduced-motion on cards  
- Token gaps (spacing, type, elevation, z-index)  
- ResizeObserver missing on viz  
- Tablet breakpoint abandons fill model  

## Implementation ownership (no shared-write conflicts)

| Stream | Files |
|--------|-------|
| A Lab shell | `lab.css`, `visualizer2d.ts`, light `sortingLab.ts` |
| B Shell a11y | `tokens.css`, `base.css`, `router.ts`, `bootstrap.ts`, `index.html` |
| C Marketing | `home.css`, `pages/*`, `ui/siteChrome.ts` |

## Fix status

See commits following this document.
