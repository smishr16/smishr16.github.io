# Content backlog

**Date:** 2026-07-27  
**Status:** Factory exit complete · **Gap-closure plan ready (not yet executed)**

## Current metrics (post-ship)

| Metric | Value |
|--------|------:|
| meat packs | **151** |
| work items | **151** |
| pctMeat | **100%** |
| live labs | **57** (100% meat) |
| paper work | **92** (100% meat) |
| formal problem sample | **463/463 (100%)** |
| courses Live (≥4 labs) | **12/12** |
| modules missing lecture beats | **0** |

## Next: gap closure (depth factory)

See:

- Brainstorm: [`docs/superpowers/specs/2026-07-27-gap-closure-brainstorm.md`](superpowers/specs/2026-07-27-gap-closure-brainstorm.md)
- AEP (executable plan): [`docs/superpowers/plans/2026-07-27-gap-closure-aep.md`](superpowers/plans/2026-07-27-gap-closure-aep.md)

| Wave | Focus | Exit (summary) |
|------|--------|----------------|
| **G0** | Honesty + backlog | No false “forthcoming” on Live; home clean |
| **G1** | Quicksort + Theory slice + sketches on live labs | SC3 + live-lab sketches |
| **G2** | Net/DB depth + 50% sketches + deep-link | SC4–SC7 partial |
| **G3** | PL/SE + search/export + e2e smoke | SC5–SC9 |
| Later | Coursera polish | Out of AEP |

## Factory history (complete)

## Waves

| Wave | Result |
|------|--------|
| W0 | QUALITY.md, completeness harness, backlog |
| W1 | Algorithms 100% meat + beats (author agent) |
| W2 | 4 parallel authors: DS/Sys/OS, Math/AI/ML, Other, (alg done W1) |
| W3 | Lecture beats all modules (authors) |
| W4 | STRICT completeness green; full suite + build |

## Verification

```
npm test
npm run build
```

## Quality bar

See `src/content/packs/QUALITY.md`.

## Ownership (post-factory)

Pack files under `src/content/packs/*-meat.ts` remain single-writer by course when extending further.
