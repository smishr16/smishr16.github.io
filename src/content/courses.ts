import type { CourseDetail, CourseMeta, CourseWork, LabMeta } from '../contracts'
import { AppRoutes, flattenCourseWork } from '../contracts'
import { sortingContent } from './sortingContent'

export { sortingContent }

/**
 * Catalog mirrors foundational CSE undergraduate required courses
 * (after intro programming — not CSE 101).
 * Topics like “sorting” live *inside* Algorithms, not as their own course.
 */
export const courses: CourseMeta[] = [
  {
    id: 'data-structures',
    title: 'Data Structures',
    status: 'soon',
    track: 'Core · required',
    level: 'undergraduate',
    moduleCount: 8,
    liveLabCount: 0,
    academicNote: 'Foundational required · typically sophomore',
    blurb:
      'Abstract data types, representations, and costs: lists, trees, heaps, hash tables, graphs as structures — invariants and when each wins.',
  },
  {
    id: 'algorithms',
    title: 'Algorithms',
    status: 'partial',
    track: 'Core · required',
    level: 'undergraduate+graduate',
    moduleCount: 8,
    liveLabCount: 5,
    academicNote: 'Design & analysis · core undergrad · grad-depth electives later',
    blurb:
      'Asymptotics, divide-and-conquer, sorting & order statistics, graphs, greedy methods, dynamic programming, and hardness — with labs where measurement supports analysis.',
  },
  {
    id: 'computer-organization',
    title: 'Computer Organization',
    status: 'soon',
    track: 'Core · required',
    level: 'undergraduate',
    moduleCount: 7,
    liveLabCount: 0,
    academicNote: 'Hardware/software interface · typically sophomore/junior',
    blurb:
      'ISA, datapath, pipelining, memory hierarchy, and performance — how programs meet the machine.',
  },
  {
    id: 'operating-systems',
    title: 'Operating Systems',
    status: 'soon',
    track: 'Core · required',
    level: 'undergraduate+graduate',
    moduleCount: 8,
    liveLabCount: 0,
    academicNote: 'Core systems · often junior',
    blurb:
      'Processes, concurrency, scheduling, virtual memory, file systems, and synchronization.',
  },
  {
    id: 'discrete-math',
    title: 'Discrete Mathematics',
    status: 'soon',
    track: 'Core · required',
    level: 'undergraduate',
    moduleCount: 6,
    liveLabCount: 0,
    academicNote: 'Math foundations for CS · often early major',
    blurb:
      'Logic, proofs, sets, combinatorics, graphs, and recurrence relations that underwrite algorithm analysis.',
  },
  {
    id: 'theory-of-computation',
    title: 'Theory of Computation',
    status: 'soon',
    track: 'Core / theory',
    level: 'undergraduate+graduate',
    moduleCount: 6,
    liveLabCount: 0,
    academicNote: 'Required or strong elective depending on program',
    blurb:
      'Automata, computability, and complexity — what can be computed and at what cost in principle.',
  },
  {
    id: 'databases',
    title: 'Databases',
    status: 'soon',
    track: 'Core / systems elective',
    level: 'undergraduate',
    moduleCount: 6,
    liveLabCount: 0,
    blurb:
      'Relational model, query languages, indexing, transactions, and storage — data as a systems problem.',
  },
  {
    id: 'computer-networks',
    title: 'Computer Networks',
    status: 'soon',
    track: 'Core / systems elective',
    level: 'undergraduate',
    moduleCount: 6,
    liveLabCount: 0,
    blurb:
      'Layering, routing, transport, reliability, and congestion — end-to-end systems in the wide area.',
  },
  {
    id: 'programming-languages',
    title: 'Programming Languages',
    status: 'soon',
    track: 'Core / languages',
    level: 'undergraduate+graduate',
    moduleCount: 6,
    liveLabCount: 0,
    blurb:
      'Syntax, semantics, types, and implementation ideas — how languages shape what we can say and check.',
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    status: 'soon',
    track: 'Core / practice',
    level: 'undergraduate',
    moduleCount: 5,
    liveLabCount: 0,
    blurb:
      'Process, design, testing, and maintenance at scale — building software that lasts beyond a homework.',
  },
]

/** Visualizer instruments (not courses). Topic tools used across courses. */
export const labs: LabMeta[] = [
  {
    id: 'sorting',
    title: 'Sorting visualizer',
    status: 'live',
    path: AppRoutes.labSorting,
    blurb:
      'Instrument comparison sorts for the Algorithms course (and free exploration): step, dual-run, Python hooks.',
    topics: ['Algorithms', 'Sorting unit', 'Empirical analysis'],
  },
  {
    id: 'structures',
    title: 'Data structures visualizer',
    status: 'soon',
    path: '/lab/structures',
    blurb: 'Layout and mutation of core structures for the Data Structures course.',
    topics: ['Data Structures'],
  },
  {
    id: 'graphs',
    title: 'Graph algorithms visualizer',
    status: 'soon',
    path: '/lab/graphs',
    blurb: 'Traversals, shortest paths, and MSTs for the Algorithms course graph units.',
    topics: ['Algorithms', 'Graphs'],
  },
  {
    id: 'systems',
    title: 'Systems visualizer',
    status: 'soon',
    path: '/lab/systems',
    blurb: 'Scheduling, memory, and concurrency for Operating Systems.',
    topics: ['Operating Systems'],
  },
]

/**
 * Algorithms — full core course.
 * Sorting is a major unit (M3), not the whole course.
 * Live labs currently attach mainly to the sorting unit; other units scaffold the syllabus.
 */
const algorithmsCourse: CourseDetail = {
  ...courses.find((c) => c.id === 'algorithms')!,
  overview: `This is a **core Algorithms** course in the sense of an undergraduate CSE required subject (design and analysis of algorithms), with room to push toward graduate depth on selected topics.

It is **not** a “sorting course.” Sorting and order statistics form one unit among asymptotics, divide-and-conquer, graph algorithms, greedy methods, dynamic programming, and NP-completeness.

Where interactive labs exist today, they support the sorting unit as **instrumentation for analysis**—identical inputs, compare counts, dual engines—not as a replacement for proofs, recurrences, and reductions.`,
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
    {
      id: 'alg-m1-analysis',
      code: 'M1',
      title: 'Algorithm analysis & asymptotics',
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
      work: [
        {
          id: 'alg-m1-problem-set',
          title: 'Problem set: asymptotics',
          kind: 'analysis',
          status: 'live',
          objective:
            'Solve a short set of growth-rate and loop-analysis problems at midterm depth (on paper or your notes).',
          brief:
            'No visualizer required. Treat this as a standard Algorithms homework 1: compare functions, simplify sums, bound nested loops.',
        },
      ],
    },
    {
      id: 'alg-m2-divide-conquer',
      code: 'M2',
      title: 'Divide and conquer & recurrences',
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
      work: [
        {
          id: 'alg-m2-recurrences',
          title: 'Problem set: recurrences',
          kind: 'analysis',
          status: 'live',
          objective: 'Solve recurrences that will reappear in mergesort and related algorithms.',
          brief: 'Written work. Include at least one Master-Theorem case and one substitution argument.',
        },
      ],
    },
    {
      id: 'alg-m3-sorting',
      code: 'M3',
      title: 'Sorting & order statistics',
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
        {
          id: 'm3-quicksort-analysis',
          title: 'Analysis: quicksort',
          kind: 'analysis',
          status: 'partial',
          objective:
            'Explain expected runtime under random pivots, worst-case inputs, and hybrid escapes (introsort idea).',
          brief:
            'Written problem-set depth. Visualizer engine for quicksort is forthcoming.',
        },
        {
          id: 'm4-heapsort-sketch',
          title: 'Analysis: heapsort',
          kind: 'analysis',
          status: 'live',
          objective: 'Describe heapsort structure, Θ(n log n) argument, stability, and PQ connection.',
          brief: 'Exam-style written work. Lab engine soon.',
        },
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
    },
    {
      id: 'alg-m4-graphs',
      code: 'M4',
      title: 'Graph algorithms',
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
      work: [
        {
          id: 'alg-m4-graph-ps',
          title: 'Problem set: graphs',
          kind: 'analysis',
          status: 'live',
          objective: 'Work representation, traversal, and path/MST reasoning problems on paper.',
          brief: 'Visualizer for graphs is planned under Lab → Graph algorithms.',
        },
        {
          id: 'alg-m4-graph-lab',
          title: 'Lab: graph algorithms visualizer',
          kind: 'lab',
          status: 'soon',
          labId: 'graphs',
          objective: 'Step BFS/DFS and a shortest-path or MST algorithm on shared instances.',
          brief: 'Unlocks when the graph engine ships.',
        },
      ],
    },
    {
      id: 'alg-m5-greedy',
      code: 'M5',
      title: 'Greedy algorithms',
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
      work: [
        {
          id: 'alg-m5-greedy-ps',
          title: 'Problem set: greedy',
          kind: 'analysis',
          status: 'live',
          objective: 'Solve and disprove greedy strategies on short problems.',
          brief: 'Written only for this release.',
        },
      ],
    },
    {
      id: 'alg-m6-dp',
      code: 'M6',
      title: 'Dynamic programming',
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
      work: [
        {
          id: 'alg-m6-dp-ps',
          title: 'Problem set: dynamic programming',
          kind: 'analysis',
          status: 'live',
          objective: 'Write recurrences and fill small tables by hand for 1–2 classic problems.',
          brief: 'Written only for this release.',
        },
      ],
    },
    {
      id: 'alg-m7-advanced',
      code: 'M7',
      title: 'Selected advanced topics',
      summary:
        'Bridge toward graduate electives: amortized analysis hooks, max-flow landscape, randomized algorithms, or approximation—program-dependent depth.',
      topics: [
        'Amortized analysis (aggregate / potential — overview)',
        'Network flow landscape',
        'Randomized algorithms (quicksort as recap; hashing hints)',
        'Approximation algorithms (idea)',
      ],
      outcomes: [
        'Place advanced topics relative to the core Algorithms toolkit',
      ],
      work: [
        {
          id: 'alg-m7-reading',
          title: 'Reading: one advanced topic',
          kind: 'reading',
          status: 'live',
          objective: 'Write a one-page map of one advanced topic to prerequisites in M1–M6.',
          brief: 'Self-directed from a standard Algorithms text chapter.',
        },
      ],
    },
    {
      id: 'alg-m8-complexity',
      code: 'M8',
      title: 'NP-completeness & hardness (course close)',
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
      work: [
        {
          id: 'alg-m8-npc-ps',
          title: 'Problem set: reductions (intro)',
          kind: 'analysis',
          status: 'live',
          objective: 'Reason about simple reduction sketches and “what would an efficient algorithm imply?”',
          brief: 'Written only. Depth matches a first exposure unit, not a full complexity course.',
        },
      ],
    },
  ],
}

/** Data Structures — core required; syllabus scaffold, labs forthcoming. */
const dataStructuresCourse: CourseDetail = {
  ...courses.find((c) => c.id === 'data-structures')!,
  overview: `Core **Data Structures** course: how we organize data to support operations efficiently. Companion to Algorithms (who often share a year in the curriculum). This is not intro programming—students are expected to implement and analyze ADTs.

Labs will visualize layout, growth, and rebalancing as engines land. Syllabus structure is in place so the catalog reads like a real CSE path.`,
  prerequisites: [
    'Intro programming completed',
    'Discrete Math concurrent or prior recommended',
  ],
  learningGoals: [
    'Specify ADTs and choose representations with complexity consequences',
    'Implement and analyze lists, trees, heaps, and hash tables',
    'Explain balanced-tree and hash-table performance at course level',
    'Use graphs as a structure (representation) ahead of graph algorithms',
  ],
  modules: [
    {
      id: 'ds-m1',
      code: 'M1',
      title: 'Complexity review & ADTs',
      summary: 'Asymptotics recap, abstract data types, and interface vs representation.',
      topics: ['ADT vs data structure', 'Amortized preview', 'Interface contracts'],
      outcomes: ['Specify an ADT with operation complexities'],
      work: [
        {
          id: 'ds-m1-ps',
          title: 'Problem set: ADT specs',
          kind: 'analysis',
          status: 'soon',
          objective: 'Specify 2–3 ADTs with operation costs.',
          brief: 'Scaffold unit — full homework pack forthcoming.',
        },
      ],
    },
    {
      id: 'ds-m2',
      code: 'M2',
      title: 'Arrays, lists, stacks, queues',
      summary: 'Contiguous vs linked representations; amortized growth of dynamic arrays.',
      topics: ['Dynamic arrays', 'Linked lists', 'Stacks/queues', 'Amortized append'],
      outcomes: ['Compare array vs linked list for given workloads'],
      work: [
        {
          id: 'ds-m2-lab',
          title: 'Lab: list representations',
          kind: 'lab',
          status: 'soon',
          labId: 'structures',
          objective: 'Visualize layout and cost differences.',
          brief: 'Visualizer forthcoming.',
        },
      ],
    },
    {
      id: 'ds-m3',
      code: 'M3',
      title: 'Trees & hierarchical structure',
      summary: 'Binary trees, traversals, expression trees, and tree ADTs.',
      topics: ['Binary trees', 'Traversals', 'Tree height/size'],
      outcomes: ['Implement and analyze basic tree operations'],
      work: [],
    },
    {
      id: 'ds-m4',
      code: 'M4',
      title: 'Search trees',
      summary: 'BSTs, imbalance, and balanced trees (AVL/red-black landscape).',
      topics: ['BST dictionary', 'Imbalance', 'Balanced BST overview'],
      outcomes: ['Explain worst-case BST vs balanced guarantees'],
      work: [],
    },
    {
      id: 'ds-m5',
      code: 'M5',
      title: 'Heaps & priority queues',
      summary: 'Binary heaps, heap operations, and priority-queue applications.',
      topics: ['Heap property', 'Insert/extract', 'Heapify', 'PQ ADT'],
      outcomes: ['Connect heaps to scheduling and algorithms courses'],
      work: [],
    },
    {
      id: 'ds-m6',
      code: 'M6',
      title: 'Hashing',
      summary: 'Hash functions, chaining vs open addressing, load factor.',
      topics: ['Hash families (intro)', 'Collision resolution', 'Amortized expected time'],
      outcomes: ['Tune load factor reasoning; know failure modes'],
      work: [],
    },
    {
      id: 'ds-m7',
      code: 'M7',
      title: 'Graphs as structures',
      summary: 'Representations and basic traversal interfaces—before Algorithms graph design.',
      topics: ['Adj list/matrix', 'Degree, paths', 'BFS/DFS as structure ops'],
      outcomes: ['Pick a representation for a stated constraint set'],
      work: [],
    },
    {
      id: 'ds-m8',
      code: 'M8',
      title: 'Advanced structures (survey)',
      summary: 'B-trees, tries, union-find landscape—program-dependent depth.',
      topics: ['External search trees', 'Tries', 'Disjoint sets'],
      outcomes: ['Map advanced structures to use cases'],
      work: [],
    },
  ],
}

const courseDetails: Record<string, CourseDetail> = {
  algorithms: algorithmsCourse,
  'data-structures': dataStructuresCourse,
}

/** Legacy course id redirect target */
export const LEGACY_COURSE_REDIRECTS: Record<string, string> = {
  sorting: 'algorithms',
}

export function getCourse(id: string): CourseDetail | undefined {
  const resolved = LEGACY_COURSE_REDIRECTS[id] ?? id
  return courseDetails[resolved]
}

export function findAssignmentById(assignmentId: string): {
  course: CourseDetail
  assignment: CourseWork
  moduleId: string
} | undefined {
  for (const c of Object.values(courseDetails)) {
    for (const mod of c.modules) {
      const a = mod.work.find((w) => w.id === assignmentId)
      if (a) return { course: c, assignment: a, moduleId: mod.id }
    }
  }
  return undefined
}

export function getAllLiveLabWork(): CourseWork[] {
  return Object.values(courseDetails).flatMap((c) =>
    flattenCourseWork(c).filter((w) => w.status === 'live' && w.labId && w.config),
  )
}
