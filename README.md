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

1. `npm run build` → output in `dist/`  
2. Publish `dist` to the `master` branch root **or** use GitHub Actions to deploy from `dist`  
3. Repo Settings → Pages → source as configured  

For a user site (`username.github.io`), `vite.config.ts` uses `base: '/'`.

**Do not commit** `.superpowers/` (local brainstorm sessions).

## Stack

Vite · TypeScript · Canvas 2D · CodeMirror · Pyodide (CDN, lazy)
