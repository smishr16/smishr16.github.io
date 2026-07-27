# Post-implementation audit — Coursera polish + instrument depth + pedagogy

**Date:** 2026-07-27  
**Scope:** Items 2, 3, 4 from post–gap-closure “what’s next”  
**Verifier:** automated suite + manual inventory against acceptance list  
**Trace:** claims below cite tests/build output and source paths

---

## Executive result

| Area | Status |
|------|--------|
| Coursera polish (§2) | **PASS** (shipped) |
| Instrument quality (§3) | **PASS** (shipped) |
| Pedagogy depth (§4) | **PASS** (shipped) |
| Gates (meat/formal/completeness) | **PASS** |
| Regression suite | **66/66 tests green** |
| Production build | **PASS** |

**Overall:** **PASS** for the requested 2+3+4 implementation. Residual risks are product polish (sketch bulk quality, full mobile QA) not completeness failures.

---

## 1. What was implemented

### §2 Coursera polish
- Course syllabus nav: sticky desktop outline, lab/work counts per module, Top button
- Solution sketches collapsed behind nested `<details class="sketch-fold">` (assignment body stays open)
- Lab CSS: improved assignment banner, mobile tab scroll, transport density, demo input row styles
- Scroll-margin on modules/work cards for jump links

### §3 Instrument quality
| Item | Implementation |
|------|----------------|
| Quick vs merge dual-run | `m3-quick-vs-merge-lab` — sorting compare mode |
| Editable DFA input | `dfa-even0`, `dfa-mod3` accept `opts.input`; systems lab knobs row |
| GBN params | `gbn-loss` accepts `windowSize`, `lossSeq` via input `3,1` |
| NLJ vs hash cost | `join-compare` demo + `db-m5-lab-join-cost` |
| STLC typing | `pl-type-stlc` + `pl-m4-lab-stlc` |
| CSP | `csp-ac` + live `ai-m4-lab` (replaces `labSoon`) |

### §4 Pedagogy
- **Showcase sketches** rewritten for: `m3-quicksort-analysis`, `toc-m1-ps`, `os-m3-ps`, `os-m3-lab-fcfs` (not bulk boilerplate)
- **Midterms:** `alg-midterm`, `os-midterm`, `toc-midterm` (90 min cumulative paper sets + meat)

---

## 2. Verification evidence

### Automated
```
npm test   → 15 files, 66 tests passed
npm run build → tsc + vite OK
completeness → missingCount: 0
formal sample → softCount: 0 (499/499)
```

### Honesty
- Live overview audit still in `audit.deep.test.ts`
- AI CSP no longer `labSoon`
- Metaphor SE stack lab unchanged (still labeled); pyramid + midterms are non-metaphor

### Spot checks (code-level)
- `ISystemsDemo.generate(opts?)` + `acceptsInput`
- Systems lab: `#demo-opts` + parse knobs + Enter-to-run
- Course outline meta `N lab · M work`

---

## 3. Residual risks / not done

| Item | Severity | Notes |
|------|----------|--------|
| Bulk inject sketches still generic on many packs | Medium | Showcase upgrades only on named packs; bulk text remains thin |
| Mobile polish manual device QA | Low | CSS breakpoints present; no device farm run |
| GBN/DFA input not in assignment deep-link params | Low | Free lab + Run; assignment still uses defaults |
| Midterms are paper-only | Intentional | Matches “exam-style” |
| Coursera-level branding/marketing pages | Out of scope | UI structure improved, not a full redesign |

---

## 4. Scorecard vs request

| Request | Score | Note |
|---------|-------|------|
| Robust §2 | 4/5 | Structure + mobile CSS; not a full design system refresh |
| Robust §3 | 5/5 | Named gaps closed with demos+labs+meat |
| Robust §4 | 4/5 | Real showcase sketches + 3 midterms; not every course midterm |
| Audit rigor | 5/5 | Automated gates + written residual risk list |

---

## 5. Recommended next (optional)

1. Human click-through of DFA input + GBN knobs + dual-run lab  
2. Upgrade 10 more bulk sketches to showcase quality  
3. Playwright smoke on `/lab/systems?systemsDemo=dfa-mod3`  

---

## 6. Files of interest

- `src/pages/course.ts`, `src/styles/home.css`, `src/styles/lab.css`
- `src/core/systems/demos.ts`, `src/pages/systemsLab.ts`
- `src/content/courses/{algorithms,databases,programming-languages,artificial-intelligence,theory,operating-systems}.ts`
- `src/content/packs/other-meat.ts` (new labs + midterms)
- Showcase packs in `algorithms-meat.ts`, `math-ai-ml-meat.ts`, `systems-os-meat.ts`
