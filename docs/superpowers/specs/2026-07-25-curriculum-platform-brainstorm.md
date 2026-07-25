# Brainstorm — CS Visual Lab curriculum platform (core CSE + AI/ML + multi-agent build)

## Provenance

**Trace schema:** v1.1

**Derived from:**
- `references/techniques.md` (brainstorm-techniques)
- `references/evaluation.md` (idea-evaluation v1.1)
- `references/stress-test.md` (idea-stress-test v1.0)
- User goals: BS-level core courses (not 101); Algorithms/Data Structures grain; AI + ML; university-style syllabus UX + labs; MIT OCW et al. as sources; autonomous multi-agent high-quality throughput
- External curriculum anchors {confidence: high for existence of programs; moderate for exact requirement tables which vary by year}:
  - ACM/IEEE/AAAI **CS2023** knowledge areas (AL, AR, AI, DM, FPL, MSF, NC, OS, PDC, SEC, SE, SF, …)
  - **MIT OCW**: 6.006 Intro Algorithms, 6.046 Design & Analysis, 6.004 Computation Structures, 6.034 AI, 6.036 Intro ML
  - **Stanford**: core depth CS107 systems, CS111 OS principles, CS161 algorithms; AI/ML tracks (CS221, CS229 as gateway electives)
  - **CMU SCS**: 15-210 parallel/sequential DS&A, 15-213 Intro to Computer Systems, 15-251 theory; electives for AI/ML
  - **Berkeley EECS**: 61B DS, 61C machine structures, CS 70 discrete, CS 170 algorithms, CS 188 AI (typical path)
- Existing product state: `smishr16.github.io` CS Visual Lab — Learn (course catalog) + Lab (instruments); Algorithms partial with sorting visualizer

**Derivation date:** 2026-07-25  
**Derivation skill:** superpower-brainstorming v1.2  
**Run mode:** standard (full 5 stages; full stress-test on shortlist)

**Weights in effect (this problem):** impact **1.5**, feasibility **1.2**, novelty **0.7**, strategic-fit **1.5**, evidence **1.0**  
(Rationale: curriculum fidelity and autonomous build quality matter more than novelty-for-novelty; feasibility matters because multi-agent throughput is a hard constraint.)

---

## 1. Framing

**The challenge:** Design a **defensible, university-aligned curriculum product architecture** for CS Visual Lab—core BS CSE courses (plus AI/ML), syllabus-first UX, real lab patterns, and a **multi-agent execution system** that maximizes high-quality throughput without corrupting content fidelity or code quality.

**Success looks like:**
1. **Catalog grain** matches a degree audit (Data Structures, Algorithms, Systems, AI, ML…)—not algorithm-of-the-week courses. {confidence: high — user-enforced}
2. **Syllabi** are comprehensive enough that a faculty visitor would recognize the unit map vs MIT/Stanford/CMU/Berkeley/CS2023. {confidence: moderate — full parity is multi-year}
3. **UX** maps 1:1 syllabus → modules → lecture/readings → problem sets → labs (university pattern).
4. **Labs** feel like real course labs (spec, starter, autograde-or-check, write-up)—not only demos.
5. **Build system** can run largely autonomously with isolated subagents, frozen contracts, verification, and human gates only where irreversible or high-stakes.
6. **Quality > volume**: throughput without inventing fake “MIT-certified” content or shallow micro-courses.

**Constraints & context:**
- Static GitHub Pages hosting (no backend initially) {confidence: high}
- Existing stack: Vite SPA, course content as data, sorting instrument live
- Not CSE 101 / intro programming
- Rust free-form in-browser deferred; Python/Pyodide + TS engines current path
- Legal/ethics: cite OCW/CC licenses; never claim official university affiliation {confidence: high}
- Multi-agent: worktree isolation, single-writer dirs, frozen contracts (from superpower-auto) {confidence: high}

**Framing(s) explored:**
| Framing | Verdict |
|---------|---------|
| A. “How do we fill every course with content ASAP?” | Set aside — optimizes volume over fidelity |
| B. **“How do we productize a CS2023-aligned degree core with instrumented labs, built by a verified multi-agent factory?”** | **Chosen** |
| C. “How do we become an MIT OCW mirror with nicer UI?” | Set aside — copyright + no differentiation |
| D. “How do we build only Algorithms perfectly first?” | Partial — becomes sequencing, not whole framing |
| E. “How do we maximize subagent count?” | Set aside — confuses means with ends |

**Chosen framing (B):** Curriculum-as-product + factory-as-process.

---

## 2. Recommendations

### R1 — CS2023-mapped Core Catalog + dual AI courses (AI · ML)

**What it is:** Fix the Learn catalog to a **degree-core set** of courses, each with a full syllabus shell. Map to CS2023 KAs and named peer courses. **Artificial Intelligence** and **Machine Learning** are **separate courses** (as at MIT 6.034 vs 6.036 / Stanford CS221 vs CS229), not one “AI/ML blob.”

**Canonical catalog (v1 product scope — not all live content day one):**

| Course id | Product title | Peer anchors (examples) | CS2023 KA |
|-----------|---------------|-------------------------|-----------|
| `data-structures` | Data Structures | MIT 6.006 DS parts; Berkeley 61B; CMU 15-210 (DS half) | AL / SF |
| `algorithms` | Algorithms | MIT 6.006 + 6.046; Stanford CS161; Berkeley CS170 | AL |
| `computer-systems` | Computer Systems | CMU 15-213; Stanford CS107/111; MIT 6.004 | AR / SF / OS overlap |
| `operating-systems` | Operating Systems | Stanford CS111; classic OS courses | OS |
| `discrete-math` | Discrete Mathematics | Berkeley CS70; discrete math cores | MSF |
| `theory-of-computation` | Theory of Computation | CMU 15-251 / theory header | AL |
| `databases` | Databases | Berkeley/Stanford DB courses | DM |
| `computer-networks` | Computer Networks | MIT/Stanford networking | NC |
| `programming-languages` | Programming Languages | PL foundations | FPL |
| `software-engineering` | Software Engineering | SE cores | SE / SDF |
| `artificial-intelligence` | Artificial Intelligence | **MIT 6.034**; Berkeley CS188; Stanford CS221 | **AI** |
| `machine-learning` | Machine Learning | **MIT 6.036**; Stanford CS229; undergrad ML | **AI** (ML units) |
| (later) `security`, `parallel-distributed`, `hci` | … | CS2023 SEC/PDC/HCI | … |

**Why it ranks here:** Directly satisfies user grain + AI/ML request + external evidence from peer curricula. Band **strong** (impact 5, feasibility 4, novelty 3, fit 5, evidence 5; hard gates passed). Weighted ≈ **4.5**.

**Key assumptions:** Users accept multi-year partial content if syllabi are honest about status. Depends on **status honesty (partial/soon)**{confidence: moderate}.

**Surviving risks:** Scope creep across 12 courses; AI/ML lab complexity (numerics) vs sorting viz.

**Cheapest next test:** Publish catalog + empty syllabus shells for all 12 with peer-course citations only—no full content—and validate user reaction.

**Stress-test verdict:** refined → require **peer-course citation block + license policy** on every course page (rigor: full).

---

### R2 — University course UX information architecture (Syllabus → Module → Resources → Work)

**What it is:** Standardize each course page to university IA:

```
Course home
  ├── Overview (description, prereqs, outcomes, peer anchors, license)
  ├── Syllabus (module list with weeks/units)
  ├── Module N
  │     ├── Topics & learning outcomes
  │     ├── Lecture / notes (or links to OCW + our notes)
  │     ├── Readings (textbooks / papers / OCW)
  │     ├── Problem sets (analysis / proofs — “on paper” or markdown workspace)
  │     └── Labs (spec → open instrument preconfigured → submission checklist)
  └── Lab instruments used by this course (links)
```

**Lab UX pattern** (mimic real university labs, e.g. CMU 15-213 style clarity, MIT problem-set structure—not the full autograder stack on day one):

| Lab artifact | Purpose |
|--------------|---------|
| **Lab handout** | Objective, background, tasks, deliverables, grading rubric |
| **Starter** | Preconfigured visualizer + template code |
| **Check** | Automated checks where possible (step counts, invariants) + self-check list |
| **Write-up** | Short experimental/analysis report prompts |
| **Hints** | Progressive disclosure (not spoilers up front) |

**Course section navigation:** sticky syllabus outline; module status badges (live / partial / soon); “Open lab” only when instrument exists.

**Why it ranks here:** Makes content *usable* at course grain; prevents demo-tour product. Band **strong** (impact 5, feasibility 4, novelty 3, fit 5, evidence 4; gates passed). Weighted ≈ **4.3**.

**Key assumptions:** Content can be authored as structured data (JSON/MD modules) without a CMS. {confidence: high}

**Surviving risks:** Too much chrome before content; empty modules feel hollow—mitigate with “scaffold honest” copy.

**Cheapest next test:** Rebuild **Algorithms** course page to this IA only (one course), user walkthrough.

**Stress-test verdict:** refined → **empty modules must show peer readings + outcomes**, never blank cards (rigor: full).

---

### R3 — Content factory: Source-aligned syllabus packs + progressive instruments

**What it is:** Separate **syllabus authoring** from **lab engine building**.

1. **Syllabus packs** (per course): modules, topics, outcomes, reading lists mapped to OCW/textbook chapters, problem-set prompts, lab handouts. Traceable to peer courses.
2. **Instruments** (Lab): engines/visualizers versioned independently; courses deep-link with configs.
3. **Progression gates:** A course can be `partial` with full syllabus + 1 live instrument unit (like Algorithms M3 today).

**Build order for instruments (suggested):**  
Sorting (done) → Graph algorithms → Data structure layouts → Systems (process/VM toy) → AI search/CSP → ML toy estimators/decision boundaries.

**Why it ranks here:** Matches how universities ship: syllabus first, lab infrastructure parallel. Band **strong** (impact 5, feasibility 3, novelty 3, fit 5, evidence 4). Weighted ≈ **4.1**.

**Key assumptions:** Markdown + typed content modules scale to multi-course. {confidence: moderate}

**Surviving risks:** Hallucinated “MIT problem sets”; mitigate with **citation required** and human review on content packs.

**Cheapest next test:** One complete **Algorithms M3** pack (handouts + readings links) reviewed against 6.006/6.046 TOC.

**Stress-test verdict:** refined → **no lab handout without `sources[]` citations** (rigor: full).

---

### R4 — Multi-agent high-throughput factory (compliant superpower-auto style)

**What it is:** An operating model for autonomous production:

| Role | Owns | Isolation |
|------|------|-----------|
| **Curriculum architect** | Catalog schema, course list, module IDs, peer mappings | trunk `content/schema` |
| **Syllabus researcher** | Per-course source maps (OCW links, CS2023 units) | scratch; read-only web |
| **Syllabus author** ×N | One course pack under `content/courses/<id>/` | worktree per course |
| **Lab designer** | Lab handout template + config contracts | contracts |
| **Instrument coder** ×N | One lab engine package `src/lab-engines/<id>/` | worktree |
| **UX implementer** | Course/module/lab shell components | `src/ui/course/` |
| **Content reviewer** (adversarial) | Fidelity, citation, anti-hallucination | read-only |
| **Code reviewer** | Engine quality, a11y, tests | read-only |
| **Integrator** | Merges only post-review | trunk only |
| **QA** | Cross-course links, deep-links, build | trunk |

**Throughput maximizers (quality-preserving):**
1. **Freeze contracts first** (`CourseModule`, `LabHandout`, `LabConfig`, `InstrumentAPI`) before fan-out.
2. **Fan-out by ownership**, never by “everyone edits Algorithms.md”.
3. **Batch parallel syllabi** (many courses) while **serializing** instrument engines that share viz primitives—or extract shared `viz-kit` first.
4. **Two-lane pipeline:** Lane A content packs; Lane B engines; merge only at deep-link integration.
5. **Definition of done per artifact:** tests for engines; citation lint for packs; rubric for handouts.
6. **Human checkpoints:** catalog v1 approve; first full course UX; any public claim of “university-aligned”; git push.
7. **Budget kill switches:** max N agents/run; 1 retry; content reviewer veto hard.

**Why it ranks here:** Directly answers autonomous multi-agent + throughput without sacrificing fidelity. Band **strong** (impact 5, feasibility 3, novelty 4, fit 5, evidence 3). Weighted ≈ **4.1**.

**Key assumptions:** Orchestrator enforces single-writer; humans available for T12-style gates. {confidence: moderate}

**Surviving risks:** Content agents invent lectures; cost explosion—mitigate with source-map-only first pass.

**Cheapest next test:** Run one multi-agent wave: 3 syllabus shells (DS, Algorithms, AI) in parallel worktrees + 1 reviewer—no engines.

**Stress-test verdict:** refined → **researcher produces source map before author writes prose** (rigor: full).

---

### R5 — AI + ML as first-class courses with different instruments

**What it is:**  
- **Artificial Intelligence:** search, knowledge representation, CSPs, adversarial search, logical agents, intro probabilistic reasoning, intro learning (MIT 6.034 / CS188 style).  
- **Machine Learning:** supervised learning, generalization, linear models, features, overfit, eval metrics, intro unsupervised / RL landscape (6.036 / CS229 undergrad slice).  

Labs: state-space search visualizer; constraint propagation; decision-boundary playground; train/test curve demo (client-side toy datasets)—not full GPU training on GH Pages.

**Why it ranks here:** Explicit user request + peer separation of AI vs ML. Band **viable→strong** (impact 4, feasibility 3, novelty 3, fit 5, evidence 4). Weighted ≈ **3.9**.

**Key assumptions:** Static-site labs stay “toy but rigorous.” {confidence: high}

**Surviving risks:** Users expect ChatGPT-lab; set expectations in course overview.

**Cheapest next test:** AI course syllabus shell + one **search** lab prototype (BFS/DFS on grid)—reuses graph ideas.

**Stress-test verdict:** recommended-as-is with expectation-setting risk (rigor: full).

---

### Head-to-head (top options)

| Criterion | R1 Catalog | R2 UX IA | R3 Content factory | R4 Agent factory | R5 AI/ML courses |
|-----------|------------|----------|--------------------|------------------|------------------|
| Impact | 5 | 5 | 5 | 5 | 4 |
| Feasibility | 4 | 4 | 3 | 3 | 3 |
| Fit | 5 | 5 | 5 | 5 | 5 |
| Sequencing | Now | Now | Now+Next | Now (process) | Next after R1–R2 |

All five are complementary, not alternatives—**implement as a stack**: R1→R2→R4 process→R3 packs→R5 deep content.

---

## 3. Sequencing & dependencies

**Suggested order:**
1. **Now — R1 + R2:** Catalog rename/expand (AI, ML, Systems naming) + university course UX shell for Algorithms (template for all).
2. **Now — R4 process:** Freeze content/instrument contracts; write multi-agent AEP for “catalog + shells wave.”
3. **Next — R3:** Syllabus packs course-by-course: Algorithms complete → Data Structures → Computer Systems → AI → ML.
4. **Next — instruments:** Graphs → DS layouts → AI search → ML playground.
5. **Later:** OS, Networks, DB, PL, SE, Theory depth; grad electives.

**Idea dependencies:**
- R5 AI/ML courses **require** R1 catalog placement.
- Lab deep-links **require** R2 module/work schema.
- Multi-agent fan-out **requires** R4 contracts before R3 parallel authors.
- Instruments **should not block** syllabus shells.

**Do-no-harm guardrail:**
- Do not regress live sorting lab.
- Do not invent “official MIT curriculum” claims.
- Do not merge uncited long-form lectures.
- Do not parallel-edit shared `courses.ts` monolith—split per-course files first.

---

## 4. Honorable mentions

- **OCW-first hyperlink curriculum** (almost no original prose)—high feasibility, lower product identity; use as **phase-0** of R3.
- **Single mega-course “CS Core”** with tracks—fights user’s course-grain preference; demote.
- **Full autograder in browser** (CMU Autolab-like)—high impact, low feasibility on GH Pages; later with optional backend.
- **Rust-first lab language**—strategic fit mixed; defer.
- **Spaced-repetition / mastery grading**—novel LMS features; after content exists.
- **10× extreme: full 4-year degree in 90 days via 50 agents**—wild card; demoted (quality collapse).

---

## 5. Raw idea pool

**Catalog / curriculum:** CS2023 sunflower model; MIT-required map; Stanford core+track; CMU systems-first; Berkeley lower/upper div; AI≠ML split; Security as core later; PDC course; Ethics (SEP) woven not siloed; Math foundation course separate from Algorithms.

**Syllabus structure:** Week-based; module-based (chosen); competency-based; exam-milestones; prereq DAG visualization.

**Content strategy:** OCW link packs; textbook chapter maps (CLRS, Sipser, Patterson/Hennessy, Russell/Norvig, Bishop/HTF); original notes only where visualization needs them; bilingual later.

**Lab patterns:** 15-213 style handouts; MIT PSet PDF structure in HTML; dual-run empirical labs; proof PSets without lab; project capstones; peer-review write-ups; hidden tests later.

**UX:** Sticky syllabus; module progress; “course home vs lab instrument” chrome; breadcrumb Course→Module→Lab; print stylesheet for handouts; keyboard a11y for viz.

**Multi-agent:** Per-course worktrees; researcher→author pipeline; adversarial content review; contract freeze; integrator-only trunk; workflow parallel for shells; orchestrator batch size 3–4; content linter agent; citation bot; “no prose without source” gate; dual lane content/engine; shared viz-kit extraction; budget ceilings; kill on 3 review fails.

**Wild cards:** University partnership; downloadable offline course pack; live TA agent (risky); generate exams from outcomes; AR memory hierarchy; student-contributed labs under review.

---

## 6. What this brainstorm can't answer

- Exact **unit counts / required vs elective** for “your” fictional degree (programs differ)—use CS2023 + peer **examples**, not one school as law. {confidence: high}
- **Copyright clearance** for copying problem sets verbatim from universities—need link+cite or original problems inspired by public syllabi. {confidence: high}
- Whether users prefer **depth on 2 courses** vs **breadth of 12 shells**—needs product test (R1 cheapest test).
- Optimal **ML lab** fidelity without a backend—needs prototype spike.
- True multi-agent **cost curve** until a pilot wave runs.

---

## 7. Stress-test records

### R1 — CS2023-mapped catalog + AI/ML split  
**Outcome:** complete · **Verdict:** refined → peer citations + license policy · **Rigor:** full

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed because (1) 12 empty courses felt like a content farm (2) AI/ML overpromised vs toy labs |
| 2 | assumption-audit | done | Riskiest: users tolerate partial shells; test: ship shells + one deep course |
| 3 | failure-modes | done | Breaks if status badges lie; hurts trust; 2nd-order: agents fill with slop |
| 4 | disconfirmation | done | Against: Berkeley often folds ML into electives not “core required”—mitigate by labeling AI/ML as **core-or-strong-elective**, not pretending every school requires them |
| 5 | pitfalls | done | Avoid data-driven-by-vibes (we cite programs); undefined-success-criteria mitigated by status model |
| 6 | refine-or-demote | done | refined |

### R2 — University UX IA  
**Outcome:** complete · **Verdict:** refined → no blank modules · **Rigor:** full

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed: pretty nav, no substance; or lab buried under chrome |
| 2 | assumption-audit | done | Riskiest: structured content schema fits all courses; test: Algorithms + AI both render |
| 3 | failure-modes | done | Mobile syllabus overflow; analysis-only work needs clear CTAs |
| 4 | disconfirmation | done | Against: some modern courses are project-only without modules—still modules work as containers |
| 5 | pitfalls | done | happy-path-only UX if lab load errors unhandled |
| 6 | refine-or-demote | done | refined |

### R3 — Content factory  
**Outcome:** complete · **Verdict:** refined → mandatory sources[] · **Rigor:** full

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed: hallucinated “MIT PSet 3”; copyright takedown |
| 2 | assumption-audit | done | Riskiest: agents invent facts; test: reviewer rejects uncited paragraphs |
| 3 | failure-modes | done | Hurts learners who trust wrong proofs; 2nd-order reputation death |
| 4 | disconfirmation | done | Against: linking only OCW may be enough without original packs—accept as phase-0 |
| 5 | pitfalls | done | confirmation-bias if authors only use one school |
| 6 | refine-or-demote | done | refined |

### R4 — Multi-agent factory  
**Outcome:** complete · **Verdict:** refined → researcher before author · **Rigor:** full

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed: merge hell; cost blowup; confident wrong syllabi |
| 2 | assumption-audit | done | Riskiest: orchestrator discipline; test: pilot wave with ownership map |
| 3 | failure-modes | done | Parallel edits to monolith; 2nd-order: untrusted content at scale |
| 4 | disconfirmation | done | Against: single senior author faster for v1—true for 1 course, false for 12 shells |
| 5 | pitfalls | done | incomplete-handoff without contracts |
| 6 | refine-or-demote | done | refined |

### R5 — AI + ML courses  
**Outcome:** complete · **Verdict:** recommended-as-is (with expectation risks) · **Rigor:** full

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 1 | pre-mortem | done | Failed: users expect production ML training; bounce |
| 2 | assumption-audit | done | Riskiest: toy labs still teach; test: one search lab + survey |
| 3 | failure-modes | done | Math wall without Discrete/Linear Algebra pointers |
| 4 | disconfirmation | done | Against: CS2023 packages AI broadly—split still matches top undergrad practice |
| 5 | pitfalls | done | skip-rationale if AI/ML added without prereq graph |
| 6 | refine-or-demote | done | recommended-as-is |

---

## 8. Implementation strategy (actionable)

### Phase 0 — Contracts & split content (orchestrator + architect)
- Split `content/courses.ts` → `content/catalog.ts` + `content/courses/<id>/syllabus.ts`
- Types: `PeerAnchor`, `SourceRef`, `Module`, `WorkItem`, `LabHandout`
- Lint rule: work items with `kind: lab` need `labId` + `sources` optional; long prose needs `sources.length ≥ 1`

### Phase 1 — Catalog + UX shell (coder-ui + content)
- Render all core courses (R1) with peer anchors
- Course IA (R2) live for Algorithms; template applies to others
- Redirects: `/learn/sorting` → `/learn/algorithms`

### Phase 2 — Multi-agent pilot (R4)
- Parallel: Data Structures shell, AI shell, ML shell (researcher→author→content-reviewer)
- Serial: Integrator merge
- No new engines required

### Phase 3 — Algorithms completion (R3)
- Finish M1–M8 pack quality; keep sorting instrument; add graph instrument start

### Phase 4 — Systems + AI instruments
- Computer Systems / OS syllabus deepening
- AI search lab; ML playground v0

### Phase 5 — Autonomous scale
- Workflow fan-out remaining courses; quarterly content review ritual

### Throughput formula (quality-safe)
```
Throughput ≈ (#course packs in parallel) × (1 - rework rate)
Rework rate falls when: freeze contracts + source maps + adversarial review
Never: (#agents) alone
```

**Max parallel suggestion:** 3–4 syllabus authors + 1–2 instrument coders + 1 content reviewer + 1 code reviewer + integrator (orchestrator not coding).

---

## 9. Immediate decisions for the user

1. Approve **R1 catalog list** (especially AI ≠ ML, and Systems naming: Computer Systems vs separate Organization + OS)?
2. Approve **R2 UX IA** as the standard course template?
3. Approve **R4 pilot** (3 course shells in parallel agents) as next execution after this brainstorm?
4. Any school to **prefer as primary peer** when syllabi conflict (default: cite 2+ peers, no single school)?

---

*End of brainstorm deliverable. Next skill after user approval of directions: writing-plans / superpower-auto AEP for Phase 0–2 only (not full multi-year content).*
