import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisHandout, labHandout } from '../handouts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const algorithmsMeta: CourseMeta = {
  id: 'algorithms',
  title: 'Algorithms',
  status: 'partial',
  track: 'Core · required',
  level: 'undergraduate+graduate',
  moduleCount: 8,
  liveLabCount: 7,
  academicNote: 'Design & analysis · core undergrad · grad-depth electives later',
  blurb:
    'Asymptotics, divide-and-conquer, sorting & order statistics, graphs, greedy methods, dynamic programming, and hardness — with labs where measurement supports analysis.',
  cs2023Areas: ['AL', 'SF'],
}

export const algorithmsCourse: CourseDetail = {
  ...algorithmsMeta,
  peerAnchors: [
    {
      school: 'MIT',
      courseCode: '6.006',
      title: 'Introduction to Algorithms',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      note: 'Asymptotics, sorting, graphs, DP intro',
    },
    {
      school: 'MIT',
      courseCode: '6.046J',
      title: 'Design and Analysis of Algorithms',
      url: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/',
      note: 'Deeper design techniques and hardness',
    },
    {
      school: 'Stanford',
      courseCode: 'CS161',
      title: 'Design and Analysis of Algorithms',
      note: 'Core undergrad algorithms',
    },
    {
      school: 'UC Berkeley',
      courseCode: 'CS 170',
      title: 'Efficient Algorithms and Intractable Problems',
      note: 'Graphs, DP, NP-completeness',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['AL', 'SF'],
  overview: `This is the **showcase course** of CS Visual Lab: a core undergraduate Algorithms subject (design and analysis) with the densest instrument + problem-pack coverage.

It is **not** a “sorting course.” Sorting and order statistics form **M3** among asymptotics, divide-and-conquer, graphs, greedy methods, dynamic programming, and NP-completeness.

**How to use this course:** (1) Read lecture beats + readings for a module. (2) Work the paper problem pack with points. (3) Open live labs for measurement that *supports* analysis—never replaces proofs. Dual-run sorting labs fix the array so compare counts are fair.

**Interactive depth:** multiple sorting labs (reference + Python), graph search (BFS/DFS/Dijkstra/A*), and empirical bake-off. Quicksort/heapsort remain paper-first until engines ship.`,
  prerequisites: [
    'Intro programming (loops, arrays, recursion) — completed; this is not CSE 101',
    'Data Structures concurrent or prior (strongly recommended)',
    'Discrete Mathematics: proofs, sums, basic graphs (concurrent or prior)',
    'Comfort with mathematical notation for asymptotics',
  ],
  learningGoals: [
    'Analyze iterative and recursive algorithms with asymptotic notation and recurrences',
    'Apply divide-and-conquer, including sorting and related order-statistic ideas',
    'Design and analyze fundamental graph algorithms (representation, BFS/DFS, shortest paths, MSTs)',
    'Use greedy and dynamic-programming paradigms with correctness arguments at course level',
    'Relate empirical measurements (e.g. instrumented sorts) to asymptotic claims carefully',
    'State what NP-completeness means for algorithm design practice',
  ],
  modules: [
    moduleOf({
      id: 'alg-m1-analysis',
      code: 'M1',
      title: 'Algorithm analysis & asymptotics',
      schedule: 'Weeks 1–2',
      summary:
        'Models of computation for analysis, RAM intuition, worst/average/best case, asymptotic notation, and common sums—language used for the rest of the course.',
      topics: [
        'RAM model (intuition) and counting dominant operations',
        'O, Θ, Ω and limit tests',
        'Loop analysis and nested structure',
        'Common summations and geometric series',
        'Best / average / worst case; adversarial inputs',
      ],
      outcomes: [
        'Classify simple loops and nested loops asymptotically',
        'Write tight-style bounds and justify them',
        'Distinguish case analysis from “typical laptop timing”',
      ],
      lectureBeats: [
        'RAM model intuition: count dominant operations, not wall-clock',
        'O / Θ / Ω as sets of functions; limit tests for pairwise order',
        'Nested loops → nested sums; geometric series appear often',
        'Best / average / worst need an input model — “typical laptop” is not a case',
        'Adversarial inputs exist for many “fast on average” claims',
      ],
      readings: [
        {
          label: 'CLRS — Chapters 1–3 (Foundations, growth of functions)',
          kind: 'textbook',
          locator: 'Ch. 1–3',
        },
        {
          label: 'MIT OCW 6.006 — Lecture 1–2 (algorithms & asymptotic notation)',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
      ],
      work: [
        {
          ...analysisWork(
            'alg-m1-problem-set',
            'Problem set: asymptotics',
            'Solve a short set of growth-rate and loop-analysis problems at midterm depth (on paper or your notes).',
            'No visualizer required. Treat this as a standard Algorithms homework 1: compare functions, simplify sums, bound nested loops.',
            'live',
            [{ label: 'CLRS Ch. 3 (growth of functions)', kind: 'textbook', locator: 'Ch. 3' }],
          ),
          handout: analysisHandout(
            [
              'Order f₁…f₆ by asymptotic growth; justify pairwise with limits or known hierarchies.',
              'Give tight Θ bounds for three nested-loop snippets (include best/worst if they differ).',
              'True/false with counterexamples: “O(n²) implies Ω(n)” and two similar claims.',
              'Sum Σ_{i=1}^{n} i and Σ_{i=1}^{n} 2^i — closed forms and Θ class.',
            ],
            { timeEstimate: '60–90 min' },
          ),
        },
      ],
    }),
    moduleOf({
      id: 'alg-m2-divide-conquer',
      code: 'M2',
      title: 'Divide and conquer & recurrences',
      schedule: 'Weeks 3–4',
      summary:
        'The divide-and-conquer paradigm, recursion trees, Master Theorem (or equivalent), and substitution proofs—before specializing to sorting.',
      topics: [
        'Divide, conquer, combine pattern',
        'Recursion trees',
        'Master Theorem / common recurrence forms',
        'Substitution method for upper/lower bounds',
        'When D&C helps (and when it does not)',
      ],
      outcomes: [
        'Solve standard divide-and-conquer recurrences',
        'Sketch a substitution proof for a given recurrence',
      ],
      lectureBeats: [
        'Pattern: divide → conquer recursively → combine',
        'Recursion trees make Master Theorem cases visual',
        'Substitution needs a strong enough inductive hypothesis (often + lower-order terms)',
        'Unbalanced splits change depth and can ruin “nice” Master applications',
        'Mergesort is the flagship: combine is linear, depth log n',
      ],
      readings: [
        {
          label: 'CLRS — Chapter 4 (Divide-and-conquer)',
          kind: 'textbook',
          locator: 'Ch. 4',
        },
        {
          label: 'MIT OCW 6.006 — divide-and-conquer lectures',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
      ],
      work: [
        analysisWork(
          'alg-m2-recurrences',
          'Problem set: recurrences',
          'Solve recurrences that will reappear in mergesort and related algorithms.',
          'Written work. Include at least one Master-Theorem case and one substitution argument.',
          'live',
        ),
      ],
    }),
    moduleOf({
      id: 'alg-m3-sorting',
      code: 'M3',
      title: 'Sorting & order statistics',
      schedule: 'Weeks 5–7',
      summary:
        'A full unit of the Algorithms course: comparison model, elementary sorts, mergesort, quicksort landscape, lower bounds, stability, and empirical instrumentation. (Not a standalone product course.)',
      topics: [
        'Comparison model; inversions; stability',
        'Elementary sorts: insertion, selection, bubble as a family',
        'Mergesort: recurrence, merge, memory',
        'Quicksort: partition, expected time, worst case, randomization / introsort idea',
        'Ω(n log n) lower bound for comparison sorts',
        'Heapsort & priority queues (bridge to structures)',
        'Hybrids and external sort (systems-facing coda)',
        'Order statistics / selection (landscape)',
      ],
      outcomes: [
        'Analyze insertion and mergesort rigorously',
        'Explain the comparison-sort lower bound at course level',
        'Run fair empirical comparisons and relate them to asymptotics',
        'Implement instrumented sorts that record compares/swaps',
      ],
      lectureBeats: [
        'Comparison model: information-theoretic Ω(n log n) lower bound idea',
        'Insertion is adaptive (inversions); bubble is a teaching cousin',
        'Mergesort: guaranteed n log n, extra memory for merge',
        'Quicksort: expected fast, worst quadratic without care; introsort hybrid',
        'Labs measure compares/swaps — not a substitute for proofs',
      ],
      readings: [
        {
          label: 'CLRS — Chapters 2, 6–9 (sorting & order statistics)',
          kind: 'textbook',
          locator: 'Ch. 2, 6–9',
        },
        {
          label: 'MIT OCW 6.006 — sorting unit',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
      ],
      work: [
        {
          id: 'm1-inversions-lab',
          title: 'Lab: inversions & elementary work',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective:
            'On identical inputs, relate disorder to compare counts for elementary sorts.',
          brief:
            'Compare insertion vs bubble. Use shuffled and nearly-sorted regimes. Prefer compare counts over raw “steps.” Write a short claim linking inversions/disorder to work.',
          config: {
            algoId: 'insertion',
            algoBId: 'bubble',
            compare: true,
            runMode: 'reference',
            arraySize: 16,
          },
          sources: [
            { label: 'CLRS Ch. 2 (insertion sort analysis)', kind: 'textbook' },
          ],
        },
        {
          id: 'm2-adaptive-lab',
          title: 'Lab: adaptive behavior',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective: 'Show insertion’s adaptivity versus a non-adaptive peer on controlled inputs.',
          brief:
            'Compare insertion vs bubble across input families. Document how metrics move—this is empirical shadow of best-case structure.',
          config: {
            algoId: 'insertion',
            algoBId: 'bubble',
            compare: true,
            runMode: 'reference',
            arraySize: 20,
          },
        },
        {
          id: 'm2-implement-insertion',
          title: 'Implementation: instrumented insertion sort',
          kind: 'implementation',
          status: 'live',
          labId: 'sorting',
          objective: 'Implement insertion sort through compare/swap hooks as instrumentation.',
          brief:
            'Python lab. Every compare/swap through hooks. Match reference behavior on random n≈10–16.',
          config: {
            algoId: 'insertion',
            runMode: 'python',
            arraySize: 12,
            compare: false,
          },
        },
        {
          id: 'm3-asymptotic-lab',
          title: 'Lab: quadratic vs n log n',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective:
            'Hold input fixed; contrast elementary sort with mergesort; scale n and interpret growth.',
          brief:
            'Compare insertion vs merge. Increase n. Prefer compare counts. Conclude with a growth claim, not a single race at one n.',
          config: {
            algoId: 'insertion',
            algoBId: 'merge',
            compare: true,
            runMode: 'reference',
            arraySize: 24,
          },
          sources: [{ label: 'CLRS Ch. 2 & 4 (insertion, mergesort)', kind: 'textbook' }],
          handout: labHandout(
            [
              'Fix a shuffled array family; dual-run insertion vs merge at n∈{12,24,32}.',
              'Record compare counts (not wall-clock) for each n.',
              'Plot or tabulate growth; state which looks closer to n² vs n log n.',
              'Write one caveat about constant factors and implementation noise.',
            ],
            { timeEstimate: '40–60 min' },
          ),
        },
        {
          id: 'm3-implement-merge',
          title: 'Implementation: mergesort instrumentation',
          kind: 'implementation',
          status: 'live',
          labId: 'sorting',
          objective: 'Express divide-and-conquer sorting through lab hooks; validate against reference.',
          brief: 'Python mode, merge template. Focus on divide → conquer → combine structure.',
          config: {
            algoId: 'merge',
            runMode: 'python',
            arraySize: 12,
            compare: false,
          },
        },
        analysisWork(
          'm3-quicksort-analysis',
          'Analysis: quicksort',
          'Explain expected runtime under random pivots, worst-case inputs, and hybrid escapes (introsort idea).',
          'Written problem-set depth; pair with the quicksort lab (Lomuto partition).',
          'partial',
        ),
        {
          id: 'm3-quicksort-lab',
          title: 'Lab: quicksort (Lomuto)',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective:
            'Step Lomuto quicksort with last-element pivot; count partitions and identify a worst-case shape.',
          brief:
            'algoId quicksort, n=12. Record pivot indices each partition; relate Θ(n log n) vs Θ(n²) adversarial order.',
          config: { algoId: 'quicksort', arraySize: 12 },
          sources: [{ label: 'CLRS Ch. 7', kind: 'textbook' }],
        },
        analysisWork(
          'm4-heapsort-sketch',
          'Analysis: heapsort',
          'Describe heapsort structure, Θ(n log n) argument, stability, and PQ connection.',
          'Exam-style written work. Lab engine soon.',
          'live',
        ),
        {
          id: 'm6-empirical-study',
          title: 'Mini-project: experimental bake-off',
          kind: 'project',
          status: 'live',
          labId: 'sorting',
          objective:
            'Fair comparison across ≥2 algorithms, ≥3 input regimes, ≥2 sizes; interpret with theory.',
          brief:
            'Use dual-run lab heavily. Deliver short lab-report write-up. Baseline pair: insertion vs merge.',
          config: {
            algoId: 'insertion',
            algoBId: 'merge',
            compare: true,
            runMode: 'reference',
            arraySize: 28,
          },
        },
      ],
    }),
    moduleOf({
      id: 'alg-m4-graphs',
      code: 'M4',
      title: 'Graph algorithms',
      schedule: 'Weeks 8–10',
      summary:
        'Representations, BFS/DFS, topological sort, shortest paths, and minimum spanning trees—the other pillar of a standard Algorithms course.',
      topics: [
        'Adjacency list/matrix trade-offs',
        'BFS, DFS, and edge classifications',
        'Topological sort; strongly connected components (overview)',
        'Dijkstra, Bellman–Ford (landscape)',
        'Kruskal / Prim and cut property (landscape)',
      ],
      outcomes: [
        'Choose representations with complexity consequences in mind',
        'Trace BFS/DFS and state what each computes',
        'State correctness ideas for shortest paths / MSTs at course level',
      ],
      lectureBeats: [
        'Adjacency list vs matrix: space and neighbor-query trade-offs drive algorithm cost',
        'BFS layers = hop distance; FIFO frontier yields hop-optimal paths on unweighted graphs',
        'DFS yields discovery/finish times, edge types, and topological order on DAGs',
        'Dijkstra settles non-decreasing distances; non-negative weights are essential',
        'MST cut property: Kruskal/Prim landscape without full proof load in every offering',
      ],
      readings: [
        {
          label: 'CLRS — Chapters 22–24 (elementary graph algorithms, MST, shortest paths)',
          kind: 'textbook',
          locator: 'Ch. 22–24',
        },
        {
          label: 'MIT OCW 6.006 — graph algorithms unit',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
      ],
      work: [
        analysisWork(
          'alg-m4-graph-ps',
          'Problem set: graphs',
          'Work representation, traversal, and path/MST reasoning problems on paper. Include one BFS layering and one shortest-path cost argument.',
          'Written set. Use the graph lab for intuition; proofs stay on paper. Cite CLRS 22–24 style topics (not copied exercises).',
          'live',
          [{ label: 'CLRS Ch. 22–24', kind: 'textbook', locator: 'Ch. 22–24' }],
        ),
        {
          id: 'alg-m4-bfs-dfs-lab',
          title: 'Lab: BFS vs DFS expansion',
          kind: 'lab',
          status: 'live',
          labId: 'graphs',
          objective:
            'On the same graph and start/goal, compare BFS and DFS expansion order and path quality (hops).',
          brief:
            'Run BFS then DFS. Record expansion order and whether the path is hop-optimal. Write 3–5 sentences relating FIFO vs LIFO frontiers to completeness/optimality.',
          config: {
            graphAlgo: 'bfs',
            graphId: 'city-6',
            start: 'A',
            goal: 'F',
          },
          sources: [
            { label: 'CLRS Ch. 22 (BFS/DFS)', kind: 'textbook' },
            {
              label: 'MIT OCW 6.006 graph unit',
              kind: 'ocw',
              url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
            },
          ],
          handout: labHandout(
            [
              'Open the graph lab preconfigured (City A→F). Run BFS to completion; list expansion order and path.',
              'Switch to DFS; same start/goal; list expansion order and path.',
              'State whether each path is hop-optimal; explain using frontier discipline.',
              'Optional: change goal and check whether conclusions still hold.',
            ],
            { timeEstimate: '30–45 min' },
          ),
        },
        {
          id: 'alg-m4-dijkstra-lab',
          title: 'Lab: Dijkstra settling order',
          kind: 'lab',
          status: 'live',
          labId: 'graphs',
          objective:
            'Trace Dijkstra on a weighted teaching graph; relate settle order to non-negative edge weights.',
          brief:
            'Run Dijkstra A→F on City graph. List settle order and final path cost. Explain why a negative edge would break the algorithm (written).',
          config: {
            graphAlgo: 'dijkstra',
            graphId: 'city-6',
            start: 'A',
            goal: 'F',
          },
          sources: [{ label: 'CLRS Ch. 24 (single-source shortest paths)', kind: 'textbook' }],
          handout: labHandout(
            [
              'Run Dijkstra; record settle order and final path cost A→F.',
              'Identify one edge relaxation that changed a distance label.',
              'On paper: give a 3-node negative-edge counterexample sketch (no need to run it).',
            ],
            { timeEstimate: '35–50 min' },
          ),
        },
      ],
    }),
    moduleOf({
      id: 'alg-m5-greedy',
      code: 'M5',
      title: 'Greedy algorithms',
      schedule: 'Week 11',
      summary:
        'Exchange arguments, activity selection, Huffman coding landscape, and when greed fails—standard Algorithms mid-course unit.',
      topics: [
        'Greedy choice property',
        'Exchange arguments',
        'Canonical examples (interval scheduling, etc.)',
        'Counterexamples when greed fails',
      ],
      outcomes: [
        'Prove a simple greedy algorithm with an exchange argument sketch',
        'Identify a problem where greedy is incorrect',
      ],
      lectureBeats: [
        'Greedy choice property: a local decision extends to a global optimum',
        'Exchange arguments: swap the first differing choice in an optimal solution',
        'Canonical win: interval scheduling by earliest finish time',
        'Canonical fail: some coin systems; naive “local best edge” shortest paths',
        'Huffman coding as a landscape example of optimal prefix codes',
      ],
      readings: [
        { label: 'CLRS — Chapter 16 (Greedy algorithms)', kind: 'textbook', locator: 'Ch. 16' },
      ],
      work: [
        analysisWork(
          'alg-m5-greedy-ps',
          'Problem set: greedy',
          'Solve and disprove greedy strategies on short problems.',
          'Written only for this release.',
          'live',
        ),
      ],
    }),
    moduleOf({
      id: 'alg-m6-dp',
      code: 'M6',
      title: 'Dynamic programming',
      schedule: 'Weeks 12–13',
      summary:
        'Optimal substructure, overlapping subproblems, memoization vs tabulation, and classic DP problems (rod cutting, LCS, knapsack landscape).',
      topics: [
        'Optimal substructure',
        'Overlapping subproblems',
        'Memoization and bottom-up tables',
        'Reconstruction of solutions',
        'Classic examples at course depth',
      ],
      outcomes: [
        'Formulate a DP recurrence from a problem statement',
        'Analyze time/space of a DP table',
      ],
      lectureBeats: [
        'Optimal substructure + overlapping subproblems → memoize or tabulate',
        'Write the recurrence first; fill the table second; reconstruct last',
        'Rod cutting and LCS as template table-filling exercises',
        '0-1 knapsack: capacity dimension makes greedy fail and DP work',
        'Time/space of DP is size of state space × work per state',
      ],
      readings: [
        { label: 'CLRS — Chapter 15 (Dynamic programming)', kind: 'textbook', locator: 'Ch. 15' },
        {
          label: 'MIT OCW 6.006 — DP lectures',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
      ],
      work: [
        analysisWork(
          'alg-m6-dp-ps',
          'Problem set: dynamic programming',
          'Write recurrences and fill small tables by hand for 1–2 classic problems.',
          'Written only for this release.',
          'live',
        ),
      ],
    }),
    moduleOf({
      id: 'alg-m7-advanced',
      code: 'M7',
      title: 'Selected advanced topics',
      schedule: 'Week 14',
      summary:
        'Bridge toward graduate electives: amortized analysis hooks, max-flow landscape, randomized algorithms, or approximation—program-dependent depth.',
      topics: [
        'Amortized analysis (aggregate / potential — overview)',
        'Network flow landscape',
        'Randomized algorithms (quicksort as recap; hashing hints)',
        'Approximation algorithms (idea)',
      ],
      outcomes: ['Place advanced topics relative to the core Algorithms toolkit'],
      lectureBeats: [
        'Amortized analysis: average cost over a sequence, not one expensive op alone',
        'Max-flow landscape: residual graphs and augmenting paths as a graph module sequel',
        'Randomization: expected-time algorithms and hashing intuition (beyond quicksort)',
        'Approximation: when NP-hardness blocks exact poly-time solutions',
        'Map any advanced chapter back to M1–M6 prerequisites before diving deep',
      ],
      readings: [
        {
          label: 'MIT OCW 6.046J — selected advanced units',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/',
        },
      ],
      work: [
        readingWork(
          'alg-m7-reading',
          'Reading: one advanced topic',
          'Write a one-page map of one advanced topic to prerequisites in M1–M6.',
          'Self-directed from a standard Algorithms text chapter.',
          'live',
        ),
      ],
    }),
    moduleOf({
      id: 'alg-m8-complexity',
      code: 'M8',
      title: 'NP-completeness & hardness (course close)',
      schedule: 'Week 15',
      summary:
        'P vs NP intuition, reductions, and what hardness means for algorithm design—closing unit of many undergrad Algorithms courses.',
      topics: [
        'Decision problems; P and NP (working definitions)',
        'Polynomial-time reductions',
        'NP-completeness idea; canonical problems',
        'Coping: exact exp, approximation, heuristics',
      ],
      outcomes: [
        'Explain NP-completeness at non-handwavy undergrad level',
        'State how a reduction is used to transfer hardness',
      ],
      lectureBeats: [
        'Decision problems; P as poly-time solvable; NP via short verifiable certificates',
        'Karp reductions: A ≤_p B transfers algorithms and hardness in opposite directions',
        'NP-complete: in NP and every NP problem reduces to it (Cook–Levin landscape)',
        'Canonical problems: SAT, Independent Set, Clique, Vertex Cover — constructions matter',
        'Coping strategies: exact exponential, approximation, heuristics, special cases',
      ],
      readings: [
        {
          label: 'CLRS — Chapter 34 (NP-completeness) or Sipser intro chapters',
          kind: 'textbook',
        },
        {
          label: 'UC Berkeley CS 170 — NP-completeness unit (public materials vary by term)',
          kind: 'curriculum',
        },
      ],
      work: [
        analysisWork(
          'alg-m8-npc-ps',
          'Problem set: reductions (intro)',
          'Reason about simple reduction sketches and “what would an efficient algorithm imply?”',
          'Written only. Depth matches a first exposure unit, not a full complexity course.',
          'live',
        ),
      ],
    }),
  ],
}
