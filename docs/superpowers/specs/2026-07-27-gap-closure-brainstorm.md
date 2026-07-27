# Brainstorm — CS Visual Lab gap closure (post-factory depth)

## Provenance

**Trace schema:** v1.1

**Derived from:**
- `references/techniques.md` (Catalog Contract v1.0, catalog id: brainstorm-techniques)
- `references/evaluation.md` (Rubric Contract v1.1, rubric id: idea-evaluation)
- `references/stress-test.md` (Checklist Contract v1.0, checklist id: idea-stress-test)
- Session gap inventory (2026-07-27): instrument depth, pedagogy, product features, honesty cleanup, engineering
- Platform metrics at brainstorm time {confidence: high}: 12 Live courses, 151 meat packs (100%), 57 live labs, 463/463 formal sample, tests green, master shipped
- Prior specs: `docs/superpowers/specs/2026-07-25-curriculum-platform-brainstorm.md`, phase1 design/AEP

**Derivation date:** 2026-07-27  
**Derivation skill:** superpower-brainstorming v1.2  
**Run mode:** standard (full 5 stages; full 6-item stress-test on shortlist)

**Weights in effect:** impact **1.5**, feasibility **1.2**, novelty **0.6**, strategic-fit **1.5**, evidence **1.0**  
(Rationale: fidelity + honesty > novelty; effort is real because multi-instrument depth is expensive.)

---

## 1. Framing

**The challenge:** After factory completeness (meat 100%, Live badges, formal 100%), **close the remaining gap between “honest Live courseware” and “actually teaches half the course in-browser”**—without regressing honesty, completeness gates, or shipping badge theater.

**Success looks like:**
1. **Honesty hygiene:** no “forthcoming” / empty Partial theater where instruments already exist; metaphor labs labeled or replaced. {confidence: high — measurable via grep + audit tests}
2. **Instrument depth:** at least one **named major gap closed** per priority track (quicksort, richer automata/TM, SQL/plan or B+ depth already started, lossy ARQ or stronger AIMD, PL type/step instrument, SE non-metaphor or explicit cap). {confidence: moderate — scope must be phased}
3. **Pedagogy:** solution sketches on a defined % of packs (target ≥50% of packs, or ≥1 per module showcase); rubrics optional phase. {confidence: high}
4. **Product (non-Coursera):** lab state deep-link, searchable catalog, progress export; accounts deferred. {confidence: high}
5. **Engineering:** CONTENT_BACKLOG current; smoke/e2e for critical lab mounts; no completeness regression. {confidence: high}
6. **Non-goal:** Coursera chrome-only polish is **sequenced last**, not the main program.

**Constraints & context:**
- GH Pages static SPA; frozen contracts + single-writer packs {confidence: high}
- Live ≥4 labs/course already met — depth ≠ more badge inflation {confidence: high}
- Metaphor labs (SE/process, cache-as-CDN) are pedagogically useful if labeled {confidence: moderate}
- User explicitly wants **plan** via brainstorm + superpower-auto AEP, not silent implementation {confidence: high}

**Framing(s) explored:**

| Framing | Verdict |
|---------|---------|
| A. “Polish UI until it looks like Coursera” | Set aside as **primary** — user asked for gaps *besides* that |
| B. **“Close teachability gaps in a phased, honesty-preserving factory”** | **Chosen** |
| C. “Replace every toy with production-grade simulators” | Set aside — multi-year; fails feasibility gate |
| D. “Only write more problem sets on paper” | Partial — needed but insufficient without instruments |
| E. “Add accounts + LMS” | Later/conditional — not critical for teachability on static site |

**Chosen framing (B):** Depth factory with honesty lock and parallel course-track instruments.

---

## 2. Recommendations

### R1 — Honesty & inventory sprint (Week 0)

**What it is:** Kill stale copy (`forthcoming`, empty home sections, leftover `labSoon` where labs exist), refresh `CONTENT_BACKLOG.md` to current metrics, add audit tests that fail on “Live course still claims instruments forthcoming.”

**Why it ranks here:** Highest impact per hour; prevents false student/faculty expectations; unblocks clear prioritization. Band **strong** (impact 5, feasibility 5, novelty 2, fit 5, evidence 5).

**Key assumptions:** Grep + status tests catch the set {confidence: high}.

**Surviving risks:** Over-aggressive rewrite of intentional “later instrument” notes on *paper* units.

**Cheapest next test:** Repo-wide grep for `forthcoming|labSoon` + render home with 12 Live cards only.

**Stress-test verdict:** refined → include automated honesty regression tests (rigor: full).

### R2 — Named instrument depth tracks (core product)

**What it is:** Parallel depth tracks with frozen demo-id contracts, each producing real demos + labs + meat (not metaphors unless labeled):

| Track | Priority deliverable |
|-------|----------------------|
| Algorithms | Quicksort instrument (partition viz) |
| Theory | Configurable DFA/NFA runner or richer PDA/TM |
| Databases | Interactive join cost / plan chooser OR B+ range query lab |
| Networks | GBN/SR with loss inject (or AIMD parameter panel) |
| PL | Small-step / type-judgment stepper for tiny language |
| SE | Explicit cap: either “metaphor track only” doc **or** one non-metaphor artifact (test pyramid interactive checklist) |

**Why it ranks here:** This *is* the gap inventory. Band **strong** (impact 5, feasibility 3, novelty 3, fit 5, evidence 4).

**Key assumptions:** Existing systems/structures frame model can absorb new demos without rewrite {confidence: moderate}.

**Surviving risks:** Scope explosion per track; mitigate with **one vertical slice per track per wave**.

**Cheapest next test:** Spec quicksort frames against existing sorting StepEngine before building others.

**Stress-test verdict:** refined → wave-box each track (1 shippable vertical slice), freeze SystemsDemoId/StructureDemoId before fan-out.

### R3 — Pedagogy factory: solution sketches + showcase rubrics

**What it is:** Factory wave to add `solutionSketch` to ≥50% of meat packs (priority: live-lab packs first, then paper midterms); optional one-page rubric template on Algorithms + OS showcase modules.

**Why it ranks here:** Converts formal prompts into *teachable* assignments. Band **strong** (impact 4, feasibility 4, novelty 2, fit 5, evidence 4).

**Key assumptions:** Sketches are outlines not full solutions (academic integrity) {confidence: high}.

**Surviving risks:** Homogeneous low-quality sketches; mitigate with QUALITY.md sketch rubric + spot review.

**Cheapest next test:** 10 sketches on live-lab packs; human spot-check.

**Stress-test verdict:** refined → CI optional count gate (`solutionSketch` coverage ≥ target), not full text quality AI judge.

### R4 — Product utilities (non-chrome)

**What it is:** Deep-link lab state (`demo`, `values`, `step`), catalog search, progress export JSON; keep Mark done local.

**Why it ranks here:** Multiplies value of depth instruments. Band **viable** (impact 4, feasibility 4, novelty 3, fit 4, evidence 3).

**Key assumptions:** Query-param state is enough without backend {confidence: high}.

**Surviving risks:** URL length / fragile deep links; version param.

**Cheapest next test:** One lab (systems) round-trips `?systemsDemo=tcp-aimd&step=3`.

**Stress-test verdict:** refined → after R2 wave-1 so there is something worth linking.

### R5 — Engineering & regression harness

**What it is:** Update backlog docs; Playwright/smoke for lab mounts; performance note on codemirror/pyodide; keep completeness/formal gates green as invariants.

**Why it ranks here:** Protects future depth work. Band **viable** (impact 3, feasibility 4, novelty 2, fit 5, evidence 4).

**Stress-test verdict:** recommended-as-is with risk of e2e flake on GH Pages CDN.

---

### Head-to-head (sequencing judgment)

| Rec | Teaches more CS | Effort | Honesty | When |
|-----|-----------------|--------|---------|------|
| R1 | Indirect | Low | **Critical** | **Now** |
| R2 | **Direct** | High | High if labeled | **Now→Next** |
| R3 | Direct (paper) | Med | High | Parallel with R2 |
| R4 | Indirect | Med | Neutral | After R2 wave-1 |
| R5 | Indirect | Med | High | Parallel continuous |
| Coursera polish | Indirect | Med | Neutral | **Later** |

---

## 3. Sequencing & dependencies

**Suggested order:**
- **Now (Wave G0):** R1 honesty + backlog refresh + audit tests  
- **Next (Wave G1):** R2 Algorithms quicksort + Theory DFA config OR PDA depth; R3 sketches on all *live-lab* packs  
- **Then (Wave G2):** R2 DB plan/join + Networks lossy ARQ; R3 paper-pack sketches to 50%; R4 deep-links  
- **Then (Wave G3):** R2 PL stepper + SE decision (cap or one real artifact); R4 search/export; R5 e2e  
- **Later:** Coursera polish pass; accounts; new courses  

**Idea dependencies:**
- R4 deep-link depends on stable demo ids (R2 contract freeze).  
- R3 does not block R2 (parallel pack writers).  
- Coursera polish must not rewrite content contracts mid-R2.

**Do-no-harm guardrail:**
- Never drop below: `pctMeat=100`, `pctFormal=100`, completeness green, Live counts honest (`liveLabCount` derived).  
- No fake Live via counting non-openable labs.  
- Metaphor labs must keep “Honest scope” in brief/meat.

---

## 4. Honorable mentions

- **Full SQL WASM engine** — high impact, low feasibility for Pages; demote to multi-year.  
- **Accounts + cloud progress** — product, not teachability; after R4 local export.  
- **CSP visualizer** — good AI depth; after Theory/Alg/DB tracks.  
- **Exam generator** — attractive; risk of shallow MCQ theater.  
- **10× instruments overnight** — wild card; demoted (quality death).  

---

## 5. Raw idea pool

**Honesty:** kill forthcoming copy; empty-section collapse; Live claim audit; metaphor registry page.  
**Algorithms:** quicksort partition viz; dual-run heap vs quick; lower-bound demo.  
**Theory:** DFA builder; NFA→DFA; pumping counterexample builder; TM multipass config.  
**DB:** nested-loop already; hash join; selectivity slider; 2PL toy schedule.  
**Networks:** GBN with drop; RTT editor; traceroute graph.  
**PL:** small-step SOS; type derivation tree; env editor.  
**SE:** test pyramid interactive; ADR template generator; drop metaphors.  
**Pedagogy:** sketches; rubrics; midterm packs; video placeholders.  
**Product:** search; deep-link; export progress; keyboard lab map.  
**Wild cards:** peer review without accounts (signed local blobs); “faculty mode” hide sketches; offline PWA; generative problem instances from seeds.  

---

## 6. What this brainstorm can't answer

- Exact faculty adoption or student time-on-task without real usage data {confidence: experimental if claimed}.  
- Whether a WASM SQL engine fits GH Pages budgets without measurement.  
- Optimal SE instrument (metaphor vs native) without a one-sprint prototype decision in G3.  

---

## 7. Stress-test records

**Checklist:** idea-stress-test v1.0 · **Run date:** 2026-07-27 · **Mode:** standard (full 6)

### R1 — Honesty sprint

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed if “cleanup” rewrote intentional paper-only notes; or tests too brittle on prose |
| 2 | assumption-audit | done | Riskiest: stale strings are finite/findable — test with grep inventory first |
| 3 | failure-modes | done | Breaks: false positives; Hurt: authors; 2nd-order: noisy CI |
| 4 | disconfirmation | done | Against: some “forthcoming” is still true for non-lab work — fix by scoping to Live courses only |
| 5 | pitfalls | done | Avoid `undefined-success-criteria` — grep counts + test asserts |
| 6 | verdict | done | **refined →** Live-course scoped honesty tests |

### R2 — Instrument tracks

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed as thin demos everywhere; badge inflation; agent collisions on demos.ts |
| 2 | assumption-audit | done | Riskiest: systems frame model insufficient for interactive inputs — test with one configurable demo |
| 3 | failure-modes | done | Breaks: mega-PR; Hurt: completeness if packs lag; 2nd-order: maintenance burden |
| 4 | disconfirmation | done | Against: “more demos ≠ teaching” — require lab+meat+brief honesty per slice |
| 5 | pitfalls | done | `happy-path-only` on demos — require reject/loss/edge frames where natural |
| 6 | verdict | done | **refined →** one vertical slice/track/wave + frozen demo ids |

### R3 — Sketches

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed as copy-paste sketches / spoilers |
| 2 | assumption-audit | done | Riskiest: quality bar too vague — fix QUALITY.md sketch rules |
| 3 | failure-modes | done | Breaks: academic integrity concerns; Hurt: instructors wanting no answers |
| 4 | disconfirmation | done | Against: students never open sketches — still helps instructors; keep collapsed |
| 5 | pitfalls | done | Avoid badge theater “100% sketches” with empty content |
| 6 | verdict | done | **refined →** outline-only sketches; live-lab first |

### R4 — Product utilities

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed as unused URLs / broken after demo renames |
| 2 | assumption-audit | done | Riskiest: param schema churn — freeze with contracts |
| 3 | failure-modes | done | Breaks: long URLs; Hurt: mobile share |
| 4 | disconfirmation | done | Against: localStorage enough — deep links still help faculty share |
| 5 | pitfalls | done | Don’t block on accounts |
| 6 | verdict | done | **refined →** after wave-1 instruments |

### R5 — Engineering harness

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Flaky e2e blocks all merges |
| 2 | assumption-audit | done | Riskiest: CI time budget — keep smoke small |
| 3 | failure-modes | done | Breaks: pyodide network in CI — mock or skip |
| 4 | disconfirmation | done | Against: unit tests enough — lab mount regressions have occurred historically |
| 5 | pitfalls | done | Don’t claim coverage without evidence |
| 6 | verdict | done | **recommended-as-is** with smoke-only e2e |

---

## 8. Approaches considered (product strategy)

| Approach | Description | Trade-off |
|----------|-------------|-----------|
| **A. Depth factory waves (recommended)** | G0 honesty → G1–G3 instrument+pedagogy waves with single-writer ownership | Best fit for existing meat factory culture |
| **B. One course perfect** | All effort on Algorithms only | Faster showcase; abandons multi-course promise |
| **C. UI-first Coursera** | Polish before depth | User already deprioritized; risk of pretty empty |

**Recommendation:** Approach **A**, with B only as a *showcase lane* inside G1 (Algorithms quicksort as hero).
