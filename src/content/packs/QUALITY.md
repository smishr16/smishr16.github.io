# Meat pack quality bar (factory contract)

## Structure (CI)

- ≥3 problems per pack  
- Each prompt ≥40 characters  
- Points sum between 80–120 (or omit points on all)  
- `deliverables` ≥2, `selfCheck` ≥2  
- `sources` ≥1 preferred (required for live-lab packs)  
- `workId` must exist in course content  

## Specificity (CI + review)

- Concrete instance: numbers, arrays, graphs, SQL schema, job set, formulas  
- Not only “explain topic X”  
- Live-lab packs must reference the actual instrument config (demo id, graph, n, …)  

## Process

1. Author only assigned course pack file  
2. Reviewer read-only accept/bounce  
3. Integrator merges + `npm test`  
4. Coverage: `pctMeat` must not decrease; wave exit requires documented target  

## Wave exit targets

| Wave | Target |
|------|--------|
| W1 Algorithms | 100% meat for algorithms work ids |
| W2 Other courses | 100% meat for all remaining work ids |
| W3 Beats | every module has ≥4 lectureBeats |
| W4 | pctMeat=100, pctMeatLiveLab=100, full suite green |
