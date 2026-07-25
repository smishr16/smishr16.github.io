# Autonomous Execution Plan — CS Visual Lab Phase 1

## Provenance

**Trace schema:** v1.1

**Derived from:**
- `docs/superpowers/specs/2026-07-25-cs-visual-lab-phase1-design.md` (approved brainstorming design)
- `references/agent-roles.md` (Catalog Contract v1.0, auto-agent-roles)
- User approval: implement via superpower-auto (2026-07-25)

**Derivation date:** 2026-07-25  
**Derivation skill:** superpower-auto v1.2  
**Overall risk tier:** **medium** (writes real git trunk; no production secret spend; **push to GitHub / Pages publish is irreversible/external → always checkpoint**)

---

## 1. North star & success criteria

**North star (one sentence):** Ship a portfolio-grade dark Vite SPA on `smishr16.github.io` that teaches sorting via an IDE workspace lab (2D viz + step engine + guided Python/Pyodide), reached from an editorial home and course map.

**Success criteria (measurable, testable):**
1. Routes `/`, `/learn`, `/learn/sorting` render without console errors in local production preview.
2. Editorial home shows brand, headline, CTA to sorting lab, and course cards (Sorting live; ≥2 “Soon” teasers).
3. Sorting lab uses IDE layout: nav rail, algo tabs (Bubble, Insertion, Merge), code ‖ viz, console, Run + transport (play/pause/step/reset/speed).
4. Reference mode runs a built-in TS algorithm and animates 2D bars with step highlights; live a11y status text updates.
5. Python path: starter template loads; after Pyodide lazy-load, Run executes or surfaces error in console; timeout aborts runaway code.
6. Unit tests pass for SortingAlgorithms (fixed small arrays) and StepEngine transport bounds.
7. Home route does **not** fetch/load Pyodide (verified by network or code-path assertion).
8. `npm run build` succeeds; README documents dev/build/deploy; `.superpowers/` gitignored.

**Definition of done:** Criteria 1–8 verified on integrated trunk by QA; human checkpoint before any `git push` / Pages publish.

**Non-goals:** Rust free-form compile; 3D; full curriculum beyond Sorting + teasers; auth/backend; CMS.

**Key assumptions:**
- Pyodide CDN is acceptable for Phase 1 {confidence: high}.
- CodeMirror (or Monaco) is fine for editor {confidence: high}.
- Existing git repo on `master` is the trunk {confidence: high}.

---

## 2. Work graph (DAG)

| Task id | Phase | Depends on | P/S | Owner role | Output |
|---------|-------|------------|-----|------------|--------|
| T0 | Bootstrap | — | S | orchestrator | Confirm trunk; branch strategy; run log init |
| T1 | Scaffold | T0 | S | architect | Vite+TS app scaffold committed on `feat/scaffold`; package.json, tokens CSS, router shell, empty routes |
| T2 | Frozen contract | T1 | S | architect | `src/contracts/*` types + step model + lesson metadata types + contract tests; freeze tag `contract-v1` |
| T3a | Core engine | T2 | P | coder-core | `src/core/` algorithms + StepEngine + unit tests; branch `feat/core-engine` |
| T3b | Visualizer | T2 | P | coder-viz | `src/viz/` Visualizer2D + a11y status; branch `feat/visualizer` |
| T3c | UI shell | T2 | P | coder-ui | `src/ui/` + pages home/learn/lab chrome IDE; tokens applied; branch `feat/ui-shell` |
| T3d | Lab Python | T2 | P | coder-lab | `src/lab/` PyodideBridge + LabBridge + templates; branch `feat/lab-python` |
| T4 | Review batch A | T3a–T3d | P | code-reviewer | Accept/bounce per branch vs contract + AC |
| T5 | Integrate modules | T4 (accepted) | S | integrator | Merge accepted branches to trunk; regen lockfile; fix import wiring in `src/app` only |
| T6 | App wiring | T5 | S | coder-wire | Single owner `src/app/` connects registry→lab→engine→viz→python; branch `feat/app-wiring` |
| T7 | Review wiring | T6 | S | code-reviewer | Accept/bounce wiring |
| T8 | Integrate wiring | T7 | S | integrator | Merge wiring; trunk builds |
| T9 | QA integrated | T8 | S | qa | Manual+automated AC checklist; defect list |
| T10 | Polish fixes | T9 | S | coder-fix (or owning coder) | Fix defects in owned dirs only; re-review |
| T11 | Deploy prep | T10 | S | integrator | README, GH Pages config/workflow draft, final build |
| T12 | Human checkpoint | T11 | S | orchestrator | User approves push/publish |
| T13 | Publish | T12 | S | orchestrator (with user) | Push / enable Pages only after T12 |

**Critical path:** T0 → T1 → T2 → (T3a \|\| T3b \|\| T3c \|\| T3d) → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12 → T13  

**Longest technical path after freeze:** usually T3a (engine+tests) or T3d (Pyodide) → T5 → T6 → T9.

---

## 3. Archetype & agent roster

**Archetype:** software  

**Right-sized roster** (omit BA/PM/researcher/designer — design already approved):

| Role | Instances | Spins up when | Sandbox |
|------|-----------|---------------|---------|
| orchestrator | 1 | start | main session |
| architect | 1 | T1–T2 | worktree `feat/scaffold` then `feat/contract` (or sequential same worktree) |
| coder | 4 (core, viz, ui, lab) | after T2 accepted | worktree each |
| coder-wire | 1 | after T5 | worktree `feat/app-wiring` |
| code-reviewer | 1–2 | after each coder batch | read-only |
| integrator | 1 | after reviews accepted | trunk only |
| qa | 1 | after T8 | trunk read + test run |

---

## 4. Agent specs

### orchestrator
**Role id:** orchestrator  
**Subagent type:** (main agent)  
**Isolation:** none  

**Mission.** Deploy agents per DAG, enforce single-writer + gates, stop at budget/kill/checkpoints.  

**Inputs.** This AEP; agent terminal results.  
**Outputs.** Spawn decisions; gate verdicts; checkpoint requests; final handoff to user.  
**Authorized scope.** Writes run log / plan status only; never production feature code.  
**Guardrails.** No dual-writers; no unverified merges; no push without T12; stop on kill condition.  
**Done.** Success criteria verified or run halted with preserved state.  
**Budget.** Orchestration overhead counted against total ceiling.

### architect
**Role id:** architect  
**Subagent type:** general-purpose  
**Isolation:** worktree  

**Mission.** Scaffold Vite+TS SPA and freeze `src/contracts` covering all success criteria.  

**Inputs.** Design spec (read-only).  
**Outputs.** Scaffold + frozen contract + ownership notes; branches `feat/scaffold`, `feat/contract`.  

**Authorized scope.**  
- **Writes:** project root scaffold files during T1; then **only** `src/contracts/**`, contract tests, and minimal router stub paths listed in contract.  
- **Reads:** design spec, package ecosystem docs.  

**Guardrails.** Do not implement algorithms/viz/pyodide/full pages. Freeze before coder fan-out.  

**Done-criteria.** `npm run build` works on scaffold; contract exports `SortStep`, engine interfaces, lesson types, LabBridge API surface; contract unit tests pass; **committed to named branch**.  

**Budget.** 120k tokens / 1 retry on bounce.

### coder (type) — instances differ by owned dir

| Instance | Branch | Writes only |
|----------|--------|-------------|
| coder-core | `feat/core-engine` | `src/core/**` |
| coder-viz | `feat/visualizer` | `src/viz/**` |
| coder-ui | `feat/ui-shell` | `src/ui/**`, `src/styles/**` (if not owned by architect—prefer `src/ui/**` + `src/pages/**`) |
| coder-lab | `feat/lab-python` | `src/lab/**` |
| coder-wire | `feat/app-wiring` | `src/app/**`, `src/main.ts`, `index.html` wiring only |

**Mission.** Implement exactly one module to contract + tests.  
**Inputs.** Frozen contract (RO); design spec (RO).  
**Outputs.** Implementation + tests; commit on named branch.  
**Guardrails.** Never edit contract or other modules; never merge trunk; flag contract gaps upstream.  
**Done.** Module AC met; tests pass; **committed to named branch**.  
**Budget.** 120k tokens / 1 retry each.

**coder-ui extra AC:** editorial home, course map, IDE chrome (empty panes OK until wire), dark refined tokens, 404 page, reduced-motion hook.  
**coder-core AC:** bubble/insertion/merge step streams; StepEngine transport; unit tests.  
**coder-viz AC:** 2D bars from engine state; compare/swap/sorted colors; live status region.  
**coder-lab AC:** lazy Pyodide; timeout; template; hooks mapping to SortStep; no load on import of home.  
**coder-wire AC:** routes mount real modules; reference mode works E2E locally.

### code-reviewer
**Role id:** code-reviewer  
**Subagent type:** general-purpose (read-only capability when possible)  
**Isolation:** none (read-only)  

**Mission.** Adversarially verify branch vs contract + module AC.  
**Outputs.** accept | bounce-with-feedback.  
**Guardrails.** Do not edit production code; default to skepticism.  
**Done.** Written verdict with evidence.  
**Budget.** 50k tokens per review.

### integrator
**Role id:** integrator  
**Subagent type:** general-purpose  
**Isolation:** none (trunk writer)  

**Mission.** Merge accepted named branches only; regenerate lockfile; keep trunk building.  
**Guardrails.** Merge only post-review; revertible commits; no feature inventing beyond conflict resolution.  
**Done.** Trunk builds; merge log recorded.  
**Budget.** 80k per merge wave.

### qa
**Role id:** qa  
**Subagent type:** general-purpose  
**Isolation:** none (read + run tests)  

**Mission.** Execute success criteria 1–8 on integrated trunk; file defects.  
**Outputs.** QA report + release-risk note.  
**Guardrails.** Do not fix code; repro every defect.  
**Done.** All criteria pass/fail listed with evidence.  
**Budget.** 80k tokens.

---

## 5. Isolation & integration map

**Trunk bootstrap:** Existing repo `smishr16.github.io` on `master` (has design commit). Preserve history. Scaffold lands via architect branch → integrator merge (or orchestrator sequential T1 if preferred before fan-out).

**Frozen interface contract (ART-X-01):** Owner = architect. Path = `src/contracts/`.

Must include (covers success criteria):
- `SortStep` union + type guards
- `IStepEngine` API: loadSteps, play, pause, step, reset, setSpeed, subscribe
- `IVisualizer` API: bind(engine), destroy, getStatusText
- `ISortingAlgorithm`: id, label, complexity, generateSteps(array)
- `LessonMeta`: id, title, status live|soon, path
- `IPyodideBridge`: load(), run(code, hooks), isReady
- `ILabBridge` / Python hook surface: get_array, compare, swap, log
- `AppRoutes` constants for `/`, `/learn`, `/learn/sorting`
- Fixture arrays for contract tests (e.g. `[3,1,2]`)

**Ownership map:**

| Mutable resource | Owner | Isolation | Merge point |
|------------------|-------|-----------|-------------|
| `src/contracts/**` | architect | worktree → freeze | after T2 review |
| `src/core/**` | coder-core | worktree | after T4 → integrator |
| `src/viz/**` | coder-viz | worktree | after T4 → integrator |
| `src/ui/**`, `src/pages/**` | coder-ui | worktree | after T4 → integrator |
| `src/lab/**` | coder-lab | worktree | after T4 → integrator |
| `src/app/**`, `src/main.ts` | coder-wire | worktree | after T7 → integrator |
| root `package.json` / lockfile | integrator | trunk | regenerate at merge |
| `vite.config.*`, `tsconfig.*` | architect (T1) then integrator | trunk | only integrator after freeze |
| `.github/workflows/*` | integrator (T11) | trunk | deploy prep |
| GitHub remote / Pages | human + orchestrator | n/a | **checkpoint T12** |

**Runtime data owners:** StepEngine owns step index/array playback state; LabBridge owns Python run session; no shared DB.

**Merge authority:** integrator only.  
**Conflict policy:** lockfile regenerate; contract conflicts → bounce to architect; cross-module → re-plan boundary.  
**Rollback:** revert merge commits on master; keep feature branches.

---

## 6. Orchestration logic

**Concurrency cap:** 4 coders max in parallel (T3 batch); otherwise 1–2 agents.  
**Spawn condition:** deps accepted + worktree ready + budget remaining.  
**Monitored signals:** task complete, review bounce, build fail, test fail, budget burn.  
**Adaptation:** 1 retry with feedback per agent; second failure → escalate to human; contract bug → pause coders, architect patch, re-freeze minor version.  
**Critical path protection:** do not starve T3a/T3d reviews; merge as soon as each is accepted (integrator may merge incrementally rather than wait for all four if safer—prefer all four reviewed then one merge wave to reduce lockfile thrash).

---

## 7. Quality gates, checkpoints & budget

**Phase gates:**

| Phase | Gate | Verification |
|-------|------|--------------|
| Scaffold+contract | build + contract tests | code-reviewer on architect branch |
| Parallel modules | per-module AC + unit tests | code-reviewer per branch |
| Integrated trunk | `npm test` + `npm run build` | integrator self-check + qa |
| Pre-publish | success criteria 1–8 | qa report + **human T12** |

**Risk-tiered checkpoints (medium):**
- After T2 contract freeze (optional human skim if contract incomplete)
- After T9 QA report
- **Always before T13 push/publish**

**Irreversible-action inventory:**
- `git push` to origin
- GitHub Pages enable/settings change
- Force-push (forbidden)
- Deleting branches on remote without ask (forbidden)

**Unattended at checkpoint:** pause run; do not push; notify user in chat; preserve branches.

**Budget ceiling (derived):**
- architect 1×120k + coders 5×120k + reviews 6×50k + integrator 3×80k + qa 1×80k ≈ 120+600+300+240+80 = **1340k** output-token-order estimate  
- × 1.4 retry factor ≈ **1.9M** hard ceiling (order-of-magnitude)  
- **Agent deployment cap:** 20 terminal agent runs  
- **Wall time soft cap:** single session / continue via baton if needed  

**Kill condition:** (a) cumulative agent runs ≥ 20, or (b) 3 consecutive gate failures on same task after retries, or (c) human abort, or (d) budget estimate exceeded → stop spawning, report state.

**Enforceable levers:** orchestrator does not spawn next batch if kill/budget hit; per-agent budget in prompts; no live kill mid-agent.

---

## 8. Plan stress-test

**Pre-mortem (top 2 failure causes):**
1. Contract incomplete → coders diverge on step semantics → integration hell.  
2. Pyodide flaky/CORS/size → Python path fails QA while reference mode works → partial ship pressure.

**Riskiest assumption + cheapest test:** Pyodide loads in Vite SPA — spike in T3d early with hello-world run; if fail, fall back to reference-only + stub Python UI with error banner (still meet criterion 5 partially; escalate).

**Acyclicity:** T0→T1→T2→T3*→T4→T5→T6→… linear after parallel diamond; no cycles.

**Deadlock/contention:** mitigated by frozen contract + single-writer dirs; lockfile only integrator.

**SPOF:** architect contract; integrator trunk. Mitigation: contract tests; revertible merges; human can take integrator role.

**Runaway cost:** deployment cap 20 + batch gating.

---

## 9. This-environment execution mapping

| Plan concept | Binding |
|--------------|---------|
| Orchestrator | Main Grok agent in this chat |
| Parallel T3 coders | `spawn_subagent` general-purpose, `isolation: worktree`, batch of up to 4 |
| Deterministic fan-out | Optional Workflow for T3 if stable; else main-loop batch |
| Architect / integrator / qa | general-purpose agents; integrator **without** worktree (trunk) or worktree only if merge strategy needs it — prefer trunk with explicit “only merge” prompt |
| Code review | general-purpose read-focused / explore+review prompt |
| Verification | code-reviewer + qa; high-stakes (final AC) = qa + orchestrator checklist + human |
| Worktrees | require git trunk (exists) |

---

## 10. Readiness

### aep-quality (self-score pending independent review for medium tier)

| Criterion | Score | Req | Pass? | Notes |
|-----------|-------|-----|-------|-------|
| goal-clarity | 5 | yes | yes | SC 1–8 measurable |
| decomposition | 5 | no | yes | DAG + critical path + parallel T3 |
| roster-fit | 4 | no | yes | right-sized; no BA/PM |
| spec-completeness | 4 | no | yes | full role specs |
| isolation | 4 | yes | yes | single-writer map + freeze |
| verification | 4 | yes | yes | review + qa; human on publish |
| checkpoints | 5 | yes | yes | irreversible inventory + T12 |
| cost-bounding | 4 | yes | yes | derived ceiling + kill |

**Weighted avg (approx):** (5+5+4×0.75+4+4×1.5+4+5×1.5+4) / (1+1+0.75+1+1.5+1+1.5+1) = 34.5/9.75 ≈ **3.54** → ≥3.5  
**Safety gate:** pass (all required ≥3)  
**Overall:** launch-ready pending independent reviewer confirmation

### auto-launch-readiness (pre-independent-review)

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | aep-scored | pending | needs independent agent score for medium tier |
| 2 | ownership-verified | done | §5 map |
| 3 | specs-complete | done | §4 |
| 4 | isolation-confirmed | done | git trunk exists; worktree for coders; named branches |
| 5 | gates-defined | done | §7 |
| 6 | checkpoints-placed | done | T12 + inventory |
| 7 | budget-set | done | 1.9M / 20 runs / kill |
| 8 | stress-tested | done | §8 |
| 9 | contract-complete | done | §5 contract list vs SC |

**Cleared to launch:** **NO** until independent AEP review passes item 1 — then **YES** for OPERATE (still no push without T12).

---

## OPERATE quickstart (after clearance)

1. Confirm user wants OPERATE now.  
2. T0–T2 sequential (architect).  
3. Independent review of contract branch.  
4. Fan-out T3a–d in worktrees.  
5. Review → integrate → wire → review → integrate → QA.  
6. Stop for human before push.

---

## 11. Independent aep-quality review (recorded)

**Reviewer:** independent general-purpose agent `019f9969-a8d6-77a3-8a10-95c88545f94b`  
**Date:** 2026-07-25  
**Weighted average:** 3.85  
**Safety gate:** PASS  
**Overall:** launch-ready  

| Criterion | Score |
|-----------|------:|
| goal-clarity | 5 |
| decomposition | 4 |
| roster-fit | 4 |
| spec-completeness | 4 |
| isolation | 4 |
| verification | 4 |
| checkpoints | 5 |
| cost-bounding | 4 |

### Post-review plan patches (orchestrator — applied before OPERATE)

1. **Ownership:** `src/styles/**` and design tokens CSS owned solely by **coder-ui** (architect may seed minimal `:root` tokens in T1 only inside `src/styles/tokens.css`; after T1 merge, only coder-ui edits styles).
2. **Contract additions:** array size clamp constants (MIN=4, MAX=64); `LessonContent` shape (title, intro, perAlgo notes); `TransportControls` event names.
3. **Success criterion 5 hardened:** Python Run must either (a) produce ≥1 non-done SortStep that moves the viz, or (b) show a clear console error — **reference-only stub does not satisfy SC5** without human scope change at checkpoint.
4. **T6 risk:** integrator smoke-runs `npm run build` after T5 before spawning coder-wire; if import graph broken, bounce to owning coders not wire.

### auto-launch-readiness completion record

**Checklist:** auto-launch-readiness v1.2  
**Run for:** CS Visual Lab Phase 1 AEP  
**Run by:** orchestrator  
**Run date:** 2026-07-25  
**Outcome:** complete  
**Cleared to launch:** **yes** (OPERATE may start; T12 still required before push)

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | aep-scored | done | independent review 3.85, safety pass |
| 2 | ownership-verified | done | §5 + post-review patch 1 |
| 3 | specs-complete | done | §4 |
| 4 | isolation-confirmed | done | git trunk exists; worktrees; named branches |
| 5 | gates-defined | done | §7 |
| 6 | checkpoints-placed | done | T12 + irreversible inventory |
| 7 | budget-set | done | 1.9M / 20 runs / kill |
| 8 | stress-tested | done | §8 |
| 9 | contract-complete | done | §5 + post-review patches 2–3 |
