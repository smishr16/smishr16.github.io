# CS Visual Lab

Interactive computer science education SPA on GitHub Pages — university-style syllabi, instrumented labs, honest status labels.

**Live (after deploy):** https://smishr16.github.io

## Status model (honest)

| Badge | Meaning |
|-------|---------|
| **Live** | ≥4 openable instrument labs |
| **Partial** | 1–3 openable labs + full syllabus |
| **Syllabus** | Full syllabus outline; instruments not yet shipped for this course |

**100% curated meat** (`src/content/packs/`): every work item has a real midterm-style pack (points, concrete instances, sources). Every module has lecture beats. Completeness is CI-gated (`completeness.test.ts`).

## Lab instruments

| Instrument | Path | Python | Courses |
|------------|------|--------|---------|
| Sorting | `/lab/sorting` | Yes | Algorithms M3 |
| Graph & search | `/lab/graphs` | BFS/DFS/Dijkstra | Algorithms M4, AI |
| Data structures | `/lab/structures` | list/BST/heap/hash | Data Structures |
| Systems | `/lab/systems` | — | OS, Computer Systems |
| ML playground | `/lab/ml` | — | Machine Learning |

Coursework deep-links: `/lab/<id>?assignment=<workId>`.

## Develop

```bash
cd smishr16.github.io   # not the parent github/ folder
npm install
npm run dev             # http://localhost:5173
npm test
npm run build
npm run preview
```

## Deploy

GitHub Actions (`.github/workflows/deploy-pages.yml`) on push to `master`.

## Stack

Vite · TypeScript · Canvas 2D · CodeMirror (lazy) · Pyodide (lazy CDN)

## Docs

- Phase 1 design: `docs/superpowers/specs/2026-07-25-cs-visual-lab-phase1-design.md`
- Curriculum brainstorm: `docs/superpowers/specs/2026-07-25-curriculum-platform-brainstorm.md`
