import type { CourseModule, CourseWork, SourceRef } from '../contracts'
import { analysisHandout, labHandout } from './handouts'
import { getMeatPack } from './packs/registry'
import { meatToHandout } from './packs/types'

/** True when handout has numbered, actionable academic tasks (not objective echo). */
export function isQualityHandout(work: CourseWork): boolean {
  if (getMeatPack(work.id)) return true
  const tasks = work.handout?.tasks ?? []
  if (tasks.length < 3) return false
  const joined = tasks.join(' ')
  if (tasks[0]?.startsWith('Objective:')) return false
  if (tasks[0] === work.objective) return false
  return /\b(Problem|P\d|\*\*P\d|Prove|Compute|Trace|Simulate|Construct|Classify|Derive|Enumerate|True\/False|Design|Implement|Run |Record |Tabulate|Compare |Order |Give |Write |Solve |Hand-|Open the|Map |Extract )/i.test(
    joined,
  )
}

function src(label: string, kind: SourceRef['kind'] = 'textbook', url?: string): SourceRef {
  return url ? { label, kind, url } : { label, kind }
}

/**
 * Build a real problem pack from course + module context.
 * Never returns objective-echo defaults.
 */
export function buildProblemPack(
  courseId: string,
  mod: CourseModule,
  work: CourseWork,
): NonNullable<CourseWork['handout']> {
  /** Prefer curated meat packs (real problem sets). */
  const meat = getMeatPack(work.id)
  if (meat) return meatToHandout(meat)

  if (work.handout && isQualityHandout(work)) return work.handout

  const topics = mod.topics.slice(0, 4)
  const t0 = topics[0] ?? mod.title
  const t1 = topics[1] ?? topics[0] ?? 'core definitions'
  const t2 = topics[2] ?? t1
  const code = mod.code

  if (work.kind === 'lab' || work.kind === 'implementation' || work.kind === 'project') {
    return labHandout(
      [
        `Problem 1 (${code}). Open the preconfigured instrument for “${work.title}”. Record the initial configuration (algorithm/demo, size/start/goal, mode).`,
        `Problem 2. Run once end-to-end. List ≥5 intermediate states or metrics (compares, expansions, faults, Gantt slices, etc.) that the viz exposes.`,
        `Problem 3. Change one controlled variable (n, start/goal, value sequence, or policy). Repeat. Tabulate before/after.`,
        `Problem 4. Write a 4–6 sentence claim connecting your measurements to “${t0}” and one module outcome. Separate empirical observation from asymptotic proof.`,
        work.kind === 'implementation'
          ? `Problem 5 (implement). In Python mode (if available), complete the template so hooks drive the viz; match reference behavior on a small instance.`
          : `Problem 5 (reflection). Name one limitation of this teaching instrument relative to a full ${courseId.replace(/-/g, ' ')} assignment.`,
      ],
      {
        timeEstimate: work.kind === 'project' ? '2–4 hr' : '40–75 min',
        deliverables: [
          'Lab report ≤1 page: method, table, claim, limitation',
          'Optional screenshots of final viz state',
          'Citations (instrument + textbook/OCW)',
        ],
        selfCheck: [
          'Same baseline inputs when comparing two modes/policies',
          'Did not treat wall-clock as asymptotic evidence',
          'Cited sources; no copied university autograder content',
        ],
      },
    )
  }

  if (work.kind === 'reading') {
    return analysisHandout(
      [
        `Problem 1 (${code} reading). From peer anchors / listed readings, map “${t0}” and “${t1}” to specific chapters or OCW lecture numbers (cite URLs or book sections).`,
        `Problem 2. Write a ½-page summary of ${t0} in your own words. Include one formal definition and one example.`,
        `Problem 3. Extract 5 claims from the reading; mark each as definition / theorem / heuristic / empirical. Note one you do not yet accept without proof.`,
        `Problem 4. Produce 3 exam-style questions (short answer) a fair instructor could ask on this reading; include brief solution sketches.`,
        `Problem 5. List prerequisites from earlier modules that this reading assumes; flag any gap in your background.`,
      ],
      {
        timeEstimate: '60–90 min',
        deliverables: ['Reading map + summary + 3 questions (with sketches) + citations'],
        selfCheck: [
          'No uncited long quotes',
          'Questions are answerable from the reading',
          'Sources listed with locators',
        ],
      },
    )
  }

  // analysis / default written packs — course-flavored
  const pack = courseAnalysisPack(courseId, code, work.title, t0, t1, t2)
  return analysisHandout(pack.tasks, {
    timeEstimate: pack.time,
    deliverables: pack.deliverables,
    selfCheck: pack.selfCheck,
  })
}

function courseAnalysisPack(
  courseId: string,
  code: string,
  title: string,
  t0: string,
  t1: string,
  t2: string,
): {
  tasks: string[]
  time: string
  deliverables: string[]
  selfCheck: string[]
} {
  const commonDeliverables = [
    'Written solutions with reasoning (not answers alone)',
    'Citations for any external references',
  ]
  const commonCheck = [
    'Notation consistent with course readings',
    'Counterexamples given when claims are false',
    'Original work — not copied university problem sets',
  ]

  const packs: Record<string, string[]> = {
    algorithms: [
      `Problem 1 (${code}). Give tight Θ bounds for two loop nests related to “${t0}”; justify with sums or recursion trees.`,
      `Problem 2. True/False with proof or counterexample: “${t1} always implies optimal substructure.”`,
      `Problem 3. Trace the algorithm family behind “${title}” on a 6–8 element (or small graph) instance; show intermediate state.`,
      `Problem 4. Compare two approaches relevant to ${t2} on the same instance; state which metric (compares, nodes expanded, space) each optimizes.`,
      `Problem 5. Write a 5-sentence exam solution outline for: “Explain ${t0} at course depth, including one common pitfall.”`,
    ],
    'data-structures': [
      `Problem 1 (${code}). Specify an ADT interface for a structure used in “${t0}” with operation complexities.`,
      `Problem 2. Draw the structure after inserting the sequence [7, 3, 11, 1, 9] (or an analogous sequence for this module).`,
      `Problem 3. Give best/average/worst costs for search and insert under “${t1}”; name the assumptions.`,
      `Problem 4. Construct an adversarial input that forces poor shape/performance; explain the failure mode.`,
      `Problem 5. Relate this structure to one Algorithms topic (sorting, graphs, or hashing applications).`,
    ],
    'computer-systems': [
      `Problem 1 (${code}). Explain “${t0}” with a concrete bit/assembly/memory example (numbers required).`,
      `Problem 2. Compute a small quantitative exercise (latency, AMAT-style, or address bits) tied to ${t1}.`,
      `Problem 3. Trace what the machine does on a short code snippet involving ${t2}.`,
      `Problem 4. Identify one bug class (overflow, aliasing, locality) and show a 5-line vulnerable pattern + fix.`,
      `Problem 5. Map this module to one OS concept (process, VM, or I/O) in ≤6 sentences.`,
    ],
    'operating-systems': [
      `Problem 1 (${code}). Define “${t0}” and distinguish it from “${t1}” with a kernel/user example.`,
      `Problem 2. Hand-simulate a scheduling or replacement scenario (4 jobs or 10 refs) related to this unit.`,
      `Problem 3. Find the race or deadlock in a short concurrent sketch; propose correct synchronization.`,
      `Problem 4. Explain what happens on a page fault / context switch / blocking I/O for this module’s focus.`,
      `Problem 5. Critique one metric (throughput, fairness, hit rate) and when optimizing it hurts another.`,
    ],
    'discrete-math': [
      `Problem 1 (${code}). Prove a claim about “${t0}” using an appropriate proof style (direct/contrapositive/induction).`,
      `Problem 2. Translate two English statements about ${t1} into logic or set notation; negate carefully.`,
      `Problem 3. Solve two counting or graph-theory exercises at midterm depth on ${t2}.`,
      `Problem 4. Find the flaw in a false proof you invent (or a classic wrong induction); repair it.`,
      `Problem 5. State how this unit feeds Algorithms analysis (asymptotics, graphs, or probability).`,
    ],
    'theory-of-computation': [
      `Problem 1 (${code}). Construct an automaton/grammar/TM (as appropriate) for a language related to “${t0}”.`,
      `Problem 2. Prove a language is / is not in the class discussed in this module (pumping or reduction sketch).`,
      `Problem 3. Give a formal definition of ${t1} and one example language on each side of the boundary.`,
      `Problem 4. Complete a short reduction or closure-property argument involving ${t2}.`,
      `Problem 5. Explain in ≤8 sentences what this unit implies for algorithm design practice.`,
    ],
    databases: [
      `Problem 1 (${code}). Write relational algebra (or SQL) for two English queries on a 3-table schema you define.`,
      `Problem 2. Normalize a messy schema involving ${t0} to 3NF/BCNF; show FDs.`,
      `Problem 3. Choose indexes for a workload of 3 query patterns; justify.`,
      `Problem 4. Identify an isolation anomaly in a short history; name the level that prevents it.`,
      `Problem 5. Estimate I/O for a nested-loop vs hash join on toy cardinalities.`,
    ],
    'computer-networks': [
      `Problem 1 (${code}). Compute delay/bandwidth for a path using “${t0}” parameters you state explicitly.`,
      `Problem 2. Draw a timeline for reliable transfer or handshake related to ${t1}.`,
      `Problem 3. Run one DV or LS update round on a 4-node graph; show tables.`,
      `Problem 4. Explain congestion collapse and AIMD response in ≤8 sentences with a sketch.`,
      `Problem 5. Place TLS or DNS in the layering model; list trust assumptions.`,
    ],
    'programming-languages': [
      `Problem 1 (${code}). Give AST + evaluation rules (or typing rules) for a feature related to “${t0}”.`,
      `Problem 2. Trace a program under static vs dynamic scope (or two evaluation orders).`,
      `Problem 3. Prove or refute type safety for a tiny extension involving ${t1}.`,
      `Problem 4. Design a 5-construct mini-language that forces students to confront ${t2}.`,
      `Problem 5. Connect a language feature to runtime cost (closures, GC, or dynamic dispatch).`,
    ],
    'software-engineering': [
      `Problem 1 (${code}). Rewrite three ambiguous requirements into testable acceptance criteria for “${t0}”.`,
      `Problem 2. Produce an ADR for a design choice involving ${t1}; list alternatives rejected.`,
      `Problem 3. Build a risk-ranked test strategy (unit/integration/E2E) for a feature description.`,
      `Problem 4. Review a fictional diff narrative; write 5 constructive review comments.`,
      `Problem 5. Draft a blameless postmortem outline for a specified outage scenario.`,
    ],
    'artificial-intelligence': [
      `Problem 1 (${code}). Formulate a search/CSP/game problem for “${t0}” (state, actions, goal, cost).`,
      `Problem 2. Hand-simulate BFS/DFS/A* or minimax (as relevant) on a tiny instance; show frontiers.`,
      `Problem 3. Prove or disprove admissibility of a heuristic you propose for ${t1}.`,
      `Problem 4. Encode a 5-fact knowledge base or Bayes net query related to ${t2}; compute a small result.`,
      `Problem 5. Contrast this module with a Machine Learning framing of a similar task (≤6 sentences).`,
    ],
    'machine-learning': [
      `Problem 1 (${code}). Define features, label, loss, and hypothesis class for a supervised task on “${t0}”.`,
      `Problem 2. Sketch train vs test curves for underfit and overfit models; mark the regime you prefer.`,
      `Problem 3. Compute one gradient step by hand for a tiny linear model (numbers required).`,
      `Problem 4. Choose metrics for an imbalanced classification problem; justify precision vs recall trade-off.`,
      `Problem 5. Identify data leakage in a flawed experimental plan; propose a correct split.`,
    ],
  }

  const tasks =
    packs[courseId] ??
    [
      `Problem 1 (${code}). Define “${t0}” formally and give one example and one non-example.`,
      `Problem 2. Solve two midterm-depth exercises on ${t1}; show full reasoning.`,
      `Problem 3. Trace or simulate a core procedure from “${title}” on a small instance.`,
      `Problem 4. Compare two methods related to ${t2}; state trade-offs.`,
      `Problem 5. Write an exam outline answer (≤½ page) for the module learning outcome most tied to this work.`,
    ]

  return {
    tasks,
    time: '60–100 min',
    deliverables: commonDeliverables,
    selfCheck: commonCheck,
  }
}

export function withPackSources(work: CourseWork, courseId: string): SourceRef[] | undefined {
  if (work.sources?.length) return work.sources
  const defaults: Record<string, SourceRef[]> = {
    algorithms: [src('CLRS — matching chapter for this module', 'textbook')],
    'data-structures': [src('Goodrich/Tamassia or CLRS structure chapters', 'textbook')],
    'computer-systems': [src('CSAPP — matching chapter', 'textbook')],
    'operating-systems': [src('OSTEP (free)', 'textbook', 'https://ostep.org/')],
    'discrete-math': [
      src('MIT OCW 6.042J', 'ocw', 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/'),
    ],
    'theory-of-computation': [src('Sipser — matching chapter', 'textbook')],
    databases: [src('Database system concepts / Ramakrishnan & Gehrke', 'textbook')],
    'computer-networks': [src('Kurose & Ross — matching chapter', 'textbook')],
    'programming-languages': [src('Pierce TAPL / PLAI selected', 'textbook')],
    'software-engineering': [src('Sommerville SE — matching chapter', 'textbook')],
    'artificial-intelligence': [src('Russell & Norvig AIMA — matching chapter', 'textbook')],
    'machine-learning': [src('ISL / CS229 notes', 'curriculum', 'https://cs229.stanford.edu/')],
  }
  return defaults[courseId]
}
