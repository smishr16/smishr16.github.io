# Autonomous Execution Plan — CS Visual Lab gap closure (depth factory)

## Provenance

**Trace schema:** v1.1

**Derived from:**
- `docs/superpowers/specs/2026-07-27-gap-closure-brainstorm.md` (superpower-brainstorming v1.2 deliverable; R1–R5)
- Prior: `docs/superpowers/plans/2026-07-25-cs-visual-lab-phase1-aep.md` (patterns: frozen contracts, worktrees, integrator)
- Platform state 2026-07-27: 12 Live courses, 151 packs, 57 labs, formal 100%, gates green {confidence: high}
- `references/agent-roles.md` (auto-agent-roles); isolation/integration protocol from superpower-auto v1.2

**Derivation date:** 2026-07-27  
**Derivation skill:** superpower-auto v1.2  
**Overall risk tier:** **medium** (writes real git trunk; **push/publish always human checkpoint**)

---

## 1. North star & success criteria

**North star (one sentence):** Close post-factory teachability gaps—honesty hygiene, named instrument depth, pedagogy sketches, product utilities, and engineering harness—without regressing meat/formal/Live honesty or shipping Coursera chrome as a substitute for depth.

**Success criteria (measurable, testable):**

| ID | Criterion |
|----|-----------|
| SC1 | **G0:** Zero false “instruments forthcoming” on Live courses; home empty Partial/Syllabus sections collapse or remove; `CONTENT_BACKLOG.md` matches live metrics (±1 day) |
| SC2 | **Honesty tests:** automated assertions fail if Live course overview claims no instruments, or `labSoon` remains where openable lab exists for same concept |
| SC3 | **G1 instruments:** Quicksort openable from Algorithms with meat pack + ≥3 problems; Theory gains configurable DFA **or** upgraded PDA/TM vertical slice (demo + lab + meat) |
| SC4 | **G2 instruments:** ≥1 DB depth slice (plan/join interactive **or** B+ range) + ≥1 Networks lossy ARQ / parameterized AIMD slice |
| SC5 | **G3 instruments:** PL small-step or type-judgment stepper **or** documented SE metaphor cap + one non-metaphor SE artifact |
| SC6 | **Pedagogy:** `solutionSketch` on **100% of live-lab packs** and **≥50% of all meat packs** |
| SC7 | **Product:** systems (or sorting) lab deep-link restores demo id + step; catalog search filters courses/work by text |
| SC8 | **Gates invariant:** `npm test` green; `pctMeat=100`; `pctFormal=100`; completeness zero missing; build green |
| SC9 | **Docs:** this AEP + brainstorm remain the source of truth; backlog lists waves G0–G3 with exit criteria |

**Definition of done:** SC1–SC9 verified on integrated trunk by QA; human checkpoint before `git push` / Pages publish for each wave merge to `master`.

**Non-goals / out of scope:**
- Coursera-grade visual redesign as primary work (optional **after** G2)
- User accounts / cloud progress
- Full WASM SQL engine / production network stack
- New degree courses (compilers, security, …)
- Claiming official university affiliation

**Key assumptions:**
- Existing `SystemsFrame` / `StructureFrame` / sorting `StepEngine` remain the instrument substrate {confidence: high}.
- Single-writer pack files still hold (`other-meat`, `algorithms-meat`, …) {confidence: high}.
- Parallel coders need frozen demo-id unions before fan-out {confidence: high}.
- Human available for wave-end push checkpoints {confidence: moderate}.

---

## 2. Work graph (DAG)

| Task id | Phase | Depends on | P/S | Owner role | Output |
|---------|-------|------------|-----|------------|--------|
| T0 | Bootstrap | — | S | orchestrator | Confirm trunk clean/build green; branch strategy; run log |
| T1 | Freeze contracts | T0 | S | architect | Extend demo-id types for G1 targets; document frame conventions; contract tests; freeze `gap-contract-g1` |
| T2a | G0 honesty code | T1 | P | coder-honesty | Copy cleanup, home section collapse, overview rewrites for Live courses; branch `feat/g0-honesty` |
| T2b | G0 audit tests | T1 | P | coder-honesty (or qa) | Tests for Live-course honesty; branch same or `feat/g0-honesty-tests` |
| T2c | G0 backlog doc | T1 | P | content-integrator | Rewrite `docs/CONTENT_BACKLOG.md` to current metrics + G0–G3 plan pointer |
| T3 | G0 review + integrate | T2a–T2c | S | code-reviewer → integrator | Merge G0; SC1–SC2 green |
| T4 | G1 freeze (if new ids) | T3 | S | architect | Any extra ids for quicksort/DFA; freeze `gap-contract-g1b` |
| T5a | G1 quicksort | T4 | P | coder-alg | Core + lab wiring + meat; branch `feat/g1-quicksort` |
| T5b | G1 theory slice | T4 | P | coder-theory | Demo + lab + meat; branch `feat/g1-theory` |
| T5c | G1 sketches live-labs | T4 | P | content-sketches | `solutionSketch` on all live-lab packs; branch `feat/g1-sketches` |
| T6 | G1 review | T5a–T5c | P | code-reviewer | Accept/bounce per branch |
| T7 | G1 integrate + QA | T6 | S | integrator → qa | Merge; SC3 + SC6-partial + SC8 |
| **CP1** | **Human checkpoint** | T7 | S | orchestrator | User approves push G0+G1 |
| T8 | G2 freeze | CP1 | S | architect | Demo ids for ARQ/plan; freeze `gap-contract-g2` |
| T9a | G2 networks | T8 | P | coder-net | Loss inject GBN/SR or AIMD params; lab+meat; `feat/g2-net` |
| T9b | G2 databases | T8 | P | coder-db | Plan/join or B+ range; lab+meat; `feat/g2-db` |
| T9c | G2 sketches 50% | T8 | P | content-sketches | Paper packs to ≥50% sketches; `feat/g2-sketches` |
| T9d | G2 deep-link | T8 | P | coder-product | Query params for systems/sorting step restore; `feat/g2-deeplink` |
| T10 | G2 review+integrate+QA | T9* | S | reviewer → integrator → qa | SC4, SC6, SC7-partial, SC8 |
| **CP2** | **Human checkpoint** | T10 | S | orchestrator | Push G2 |
| T11 | G3 freeze | CP2 | S | architect | PL/SE contract decision recorded in ADR-style note in docs |
| T12a | G3 PL or SE | T11 | P | coder-pl-se | Chosen slice; `feat/g3-pl-se` |
| T12b | G3 search/export | T11 | P | coder-product | Catalog search + progress JSON export; `feat/g3-product` |
| T12c | G3 e2e smoke | T11 | P | qa | Lab mount smoke tests (no live pyodide if flaky); `feat/g3-e2e` |
| T13 | G3 integrate+QA | T12* | S | integrator → qa | SC5–SC9 |
| **CP3** | **Human checkpoint** | T13 | S | orchestrator | Final push; optional Coursera polish backlog only |

**Critical path:**  
T0 → T1 → T2a → T3 → T4 → T5a → T6 → T7 → **CP1** → T8 → T9a → T10 → **CP2** → T11 → T12a → T13 → **CP3**

**Parallel speedup:** T5a∥T5b∥T5c; T9a∥T9b∥T9c∥T9d; T12a∥T12b∥T12c.

**Acyclicity:** Topological order above is acyclic. Shared files (`demos.ts`, contracts, `other-meat.ts`) are **not** multi-writer—see §5.

---

## 3. Archetype & agent roster

**Archetype:** software (+ content factory)

| Role | Instances | Spins up when | Sandbox |
|------|-----------|---------------|---------|
| orchestrator | 1 | start | main session |
| architect | 1 | T1, T4, T8, T11 | worktree `feat/gap-contract-*` |
| coder-honesty | 1 | T2a/T2b | worktree `feat/g0-honesty` |
| coder-alg | 1 | T5a | worktree `feat/g1-quicksort` |
| coder-theory | 1 | T5b | worktree `feat/g1-theory` |
| coder-net | 1 | T9a | worktree `feat/g2-net` |
| coder-db | 1 | T9b | worktree `feat/g2-db` |
| coder-pl-se | 1 | T12a | worktree `feat/g3-pl-se` |
| coder-product | 1 | T9d, T12b | worktree per feature |
| content-sketches | 1 | T5c, T9c | worktree `feat/g*-sketches` — **owns pack files only** |
| content-integrator | 1 | T2c | docs only |
| code-reviewer | 1 | each review batch | read-only |
| qa | 1 | after integrates | read + test run |
| integrator | 1 | merge points | trunk only |

**Right-sizing:** No BA/PM/designer required (brainstorm already chose direction). No researcher unless Theory/DB needs external curriculum citation check.

---

## 4. Agent specs (compact)

### Orchestrator
- **Mission:** Run OPERATE loop; never implement depth features itself except emergency fixes.
- **Guardrails:** No push without CP*; no two writers on same dir; budget kill switch.
- **Done:** SC1–SC9 or explicit halt.

### Architect
- **Mission:** Frozen demo-id / AssignmentConfig extensions + short ADR for G3 PL vs SE.
- **Writes:** `src/contracts/**`, `docs/superpowers/specs/gap-contracts.md` (create).
- **Outputs:** Contract tests green; freeze tags named above.
- **Done:** Coders can import new ids without inventing parallel types.

### Coder-honesty
- **Mission:** SC1–SC2.
- **Writes:** `src/content/courses/**`, `src/pages/home.ts`, `src/ui/status.ts`, honesty tests under `src/content/**`.
- **Never:** instrument demos or packs (except fixing work ids if broken by copy).
- **Done:** `npm test` + manual home shows 12 Live, no empty Partial theater.

### Coder-alg / theory / net / db / pl-se
- **Mission:** One vertical slice: demo generate() + lab wiring + course work item + sources.
- **Writes:** Owned paths only:
  - alg: `src/core/algorithms/**`, `src/pages/sortingLab.ts` (minimal), `src/content/courses/algorithms.ts`, meat via handoff to content-sketches **or** algorithms-meat if sole writer that wave
  - theory: `src/core/systems/demos.ts` (only their new functions + registry entries — **serialized merge via integrator** if concurrent with net/db)
  - Prefer **split files** if contention: architect may extract `src/core/systems/demos/*.ts` barrel in T1 if parallel G1/G2 writers conflict
- **Self-validation:** unit tests for generate(); `npm test`; commit on named branch.
- **Done:** Openable lab from course page; meat pack present.

### Content-sketches
- **Mission:** SC6.
- **Writes:** only `src/content/packs/*-meat.ts` and `other-meat.ts` (coordinate waves so one writer at a time on other-meat).
- **Guardrails:** sketches are outlines, not full solutions; QUALITY.md sketch rules.
- **Done:** count gate script or test for coverage thresholds.

### Coder-product
- **Mission:** SC7.
- **Writes:** `src/pages/*Lab.ts`, `src/app/bootstrap.ts`, `src/pages/learn.ts` / home search, `src/ui/progress.ts`.
- **Done:** deep-link round-trip test; search filters.

### Code-reviewer
- **Mission:** Adversarial review vs SC + honesty + single-writer.
- **Writes:** none (comments / bounce notes only).
- **Done:** accept or bounce with file-level reasons.

### QA
- **Mission:** SC8 + smoke; report defects.
- **Writes:** optional `src/**/*.smoke.test.ts` / e2e under agreed dir.
- **Done:** written checklist pass/fail.

### Integrator
- **Mission:** Merge named branches to trunk; resolve lockfile; never invent features.
- **Writes:** trunk merge commits only.
- **Done:** green build/test after merge.

---

## 5. Isolation & integration map ‹safety core›

**Trunk bootstrap:** Existing repo `smishr16.github.io` on `master` — no `git init`.

**Frozen interface contract (ART-X-01):**
- Owner: architect  
- Contents:
  1. Extended `SystemsDemoId` / structure / sorting algo ids for the wave  
  2. AssignmentConfig fields (`systemsDemo`, `structureDemo`, `algoId`, array seeds, optional `step`)  
  3. Meat pack shape unchanged (`MeatPack`, `solutionSketch`)  
  4. Honesty rules: Live ≥4 openable labs; metaphor briefs must include “Honest scope”  
  5. Coverage: every SC that needs a demo id lists it here before coder fan-out  

**Ownership map:**

| Mutable resource | Owner | Isolation | Merge |
|------------------|-------|-----------|-------|
| `src/contracts/**` | architect | worktree | after T1/T4/T8/T11 |
| `src/core/systems/demos.ts` | **one coder per wave** (or split modules) | worktree | integrator serializes if multi |
| `src/core/algorithms/**` | coder-alg | worktree | G1 |
| `src/core/structures/**` | coder-db (if B+) | worktree | G2 |
| `src/content/courses/<track>.ts` | track coder | worktree | per wave |
| `src/content/packs/algorithms-meat.ts` | content-sketches **or** coder-alg (not both same wave) | worktree | serial |
| `src/content/packs/other-meat.ts` | content-sketches (G1–G2); track coder only if no sketch agent | **single writer** | serial |
| `src/pages/*Lab.ts`, bootstrap | coder-product / track coder (coordinate) | worktree | integrator |
| `docs/CONTENT_BACKLOG.md` | content-integrator | trunk docs branch | any |
| package-lock | integrator | regenerate | merge |

**Shared read-only:** brainstorm + AEP + frozen contract docs.

**Merge authority:** integrator only on `master` (or `main` if renamed — currently `master`).

**Conflict policy:** Prefer split `demos/` modules over hand-merging mega-files; lockfile regen.

**Rollback:** revert merge commit per wave.

---

## 6. Orchestration logic

**Concurrency cap:** 3 coding agents at a time (token + merge risk); content-sketches may run parallel if different pack files.

**Spawn condition:** dependency `accepted` + worktree ready + contract freeze for that wave + budget remaining.

**Monitored signals:** task completion, test fail, scope violation (files outside ownership), stalled > budget.

**Adaptation rules:**
- Bounce once with feedback; second fail → escalate human  
- Contract gap → architect hotfix freeze, then resume  
- Completeness fail → halt fan-out until packs fixed  

**Unattended at checkpoint:** stop; do not push; leave PR/branches ready.

---

## 7. Quality gates, checkpoints & budget ‹safety core›

**Phase gates:**

| Phase | Gate | Verification |
|-------|------|--------------|
| G0 | SC1–SC2, SC8 | QA + honesty tests |
| G1 | SC3, SC6-partial, SC8 | QA + open lab manual |
| G2 | SC4, SC6, SC7-partial, SC8 | QA |
| G3 | SC5–SC9 | QA + backlog current |

**Risk-tiered checkpoints:** CP1, CP2, CP3 before any `git push origin master`.

**Always-checkpoint:** force-push, Pages settings, any secret, mass delete.

**Budget ceiling (order-of-magnitude):**  
~12–16 agent-runs × ~80k tokens × 1.4 retry ≈ **heavy** session — cap **20 agent invocations** per wave; kill if completeness red twice after merge.

**Kill condition:** honesty gate red; meat/formal &lt; 100%; human abort.

---

## 8. Plan stress-test ‹safety core›

**Pre-mortem (plan failed a year later):**
1. Parallel writers corrupted `demos.ts` / `other-meat.ts` → endless merge debt; depth demos shipped broken.  
2. Waves optimized for demo count over teaching vertical slices → badge theater 2.0.

**Riskiest assumption + cheapest test:**  
Systems frame model supports interactive/configurable demos — **test in G1 Theory with one config param** before G2 fan-out.

**Acyclicity:** Yes (DAG §2).

**Deadlock / contention:** `other-meat.ts` and `demos.ts` — mitigated by single-writer rule + optional file split.

**Single points of failure:** integrator; architect freezes — mitigate with orchestrator takeover only for trivial merges.

**Runaway cost:** wave caps + CP stops.

**Checklist verdict:** plan **cleared for OPERATE** after user approves this AEP (medium tier requires human plan review — **this document is that review surface**).

---

## 9. This-environment execution mapping

| Plan concept | Binding |
|--------------|---------|
| Orchestrator | Main Grok/Claude session |
| Parallel fan-out (known shape) | `spawn_subagent` / Workflow `parallel()` for T5a–c, T9a–d |
| Dynamic decisions | Main loop between waves |
| Isolation | `isolation: "worktree"` for coders; commit named `feat/*` branches |
| Verification | Subagent code-reviewer + main `npm test` / `npm run build` |
| Content packs | Prefer sequential content-sketches to avoid Map key collisions |
| Push | Human only at CP1–CP3 |

**Suggested OPERATE command sequence (after approval):**
1. Confirm user approval of brainstorm + AEP  
2. Run T0–T3 (G0) in-session or with 1–2 agents  
3. CP0 optional if G0-only push desired  
4. Freeze G1 → fan-out T5a–c → integrate → **CP1**  
5. Freeze G2 → fan-out T9 → integrate → **CP2**  
6. G3 → **CP3**  
7. Coursera polish = separate plan, not this AEP

---

## 10. Readiness

**aep-quality (self-score, medium tier — request independent review if available):**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Measurable done | 5 | SC1–SC9 |
| DAG / acyclic | 5 | explicit critical path |
| Roster right-sized | 4 | content + code roles |
| Isolation single-writer | 4 | demos.ts contention called out |
| Gates + checkpoints | 5 | CP1–3 + no push |
| Budget / kill | 4 | rough but bounded |
| Stress-test present | 5 | §8 |

**Weighted readiness:** **launch-ready pending user approval**  
**auto-launch-readiness:** **NO** until user says “execute AEP” / “run OPERATE”  
**Independent plan review:** pending user (you) — medium tier.

---

## Appendix A — Wave exit checklists

### G0
- [ ] Grep Live courses: no false forthcoming  
- [ ] Home: Live grid full; Partial/Syllabus not empty shells  
- [ ] CONTENT_BACKLOG metrics current  
- [ ] Honesty tests green  
- [ ] npm test + build  

### G1
- [ ] Quicksort lab openable + meat  
- [ ] Theory vertical slice openable + meat  
- [ ] solutionSketch on all live-lab packs  
- [ ] Gates invariant  

### G2
- [ ] Net + DB slices  
- [ ] Sketches ≥50% packs  
- [ ] Deep-link demo  

### G3
- [ ] PL or SE decision shipped  
- [ ] Search + progress export  
- [ ] Smoke e2e  
- [ ] Backlog marks G0–G3 status  

## Appendix B — Mapping gaps → tasks

| Gap (prior inventory) | Tasks |
|----------------------|-------|
| Stale honesty / forthcoming | T2a–T3 |
| Quicksort forthcoming | T5a |
| Theory toys thin | T5b |
| DB/Networks depth | T9a–T9b |
| PL/SE depth | T12a |
| Solution sketches sparse | T5c, T9c |
| Deep-link / search / export | T9d, T12b |
| Backlog stale / e2e | T2c, T12c |
| Coursera polish | **Out of this AEP** (backlog only) |
