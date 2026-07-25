# CS Visual Lab

Interactive computer science labs on GitHub Pages — dark refined UI, 2D algorithm visualization, guided Python (Pyodide).

**Live (after deploy):** https://smishr16.github.io

## Phase 1

- Editorial home + course map  
- Sorting lab (IDE workspace): Bubble, Insertion, Merge  
- Reference mode (TypeScript step engine)  
- Python lab mode (lazy Pyodide; `compare` / `swap` drive the viz)

Design: `docs/superpowers/specs/2026-07-25-cs-visual-lab-phase1-design.md`  
Plan: `docs/superpowers/plans/2026-07-25-cs-visual-lab-phase1-aep.md`

## Develop

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

## Deploy (GitHub Pages)

Production is built from source via GitHub Actions (`.github/workflows/deploy-pages.yml`):

1. Push to `master` (or run the workflow manually).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Site serves the `dist/` artifact at https://smishr16.github.io

Local production check:

```bash
npm run build
npm run preview
```

`vite.config.ts` uses `base: '/'` (user site). Build also writes `dist/404.html` for SPA routes.

**Do not commit** `.superpowers/` (local brainstorm sessions).


## Stack

Vite · TypeScript · Canvas 2D · CodeMirror · Pyodide (CDN, lazy)
