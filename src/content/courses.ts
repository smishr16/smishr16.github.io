import type { CourseDetail, CourseMeta, CourseWork, LabMeta } from '../contracts'
import { AppRoutes, flattenCourseWork } from '../contracts'
import { sortingContent } from './sortingContent'

export { sortingContent }

/**
 * Catalog: courses are bachelor’s / master’s CS topics — not single-algorithm tutorials.
 */
export const courses: CourseMeta[] = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    status: 'partial',
    track: 'Algorithms',
    level: 'undergraduate+graduate',
    moduleCount: 6,
    liveLabCount: 5,
    academicNote: 'Core undergrad algorithms · selected grad extensions',
    blurb:
      'Comparison model, elementary and divide-and-conquer sorts, lower bounds, stability, and empirical analysis — with labs that instrument real step behavior.',
  },
  {
    id: 'search',
    title: 'Searching & Ordered Data',
    status: 'soon',
    track: 'Algorithms',
    level: 'undergraduate',
    moduleCount: 4,
    liveLabCount: 0,
    blurb:
      'Linear and binary search, search trees, hashing trade-offs, and amortized analysis of dynamic sets.',
  },
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    status: 'soon',
    track: 'Algorithms',
    level: 'undergraduate+graduate',
    moduleCount: 6,
    liveLabCount: 0,
    blurb:
      'BFS/DFS, shortest paths, MSTs, flow — representations, correctness proofs, and complexity.',
  },
  {
    id: 'structures',
    title: 'Data Structures',
    status: 'soon',
    track: 'Data Structures',
    level: 'undergraduate',
    moduleCount: 8,
    liveLabCount: 0,
    blurb:
      'Arrays, lists, trees, heaps, hash tables, balanced BSTs — invariants, costs, and when each structure wins.',
  },
  {
    id: 'os',
    title: 'Operating Systems',
    status: 'soon',
    track: 'Systems',
    level: 'undergraduate+graduate',
    moduleCount: 8,
    liveLabCount: 0,
    blurb:
      'Processes, scheduling, virtual memory, concurrency, and synchronization — visualized where structure helps.',
  },
  {
    id: 'complexity',
    title: 'Complexity & Computation',
    status: 'soon',
    track: 'Theory',
    level: 'undergraduate+graduate',
    moduleCount: 5,
    liveLabCount: 0,
    blurb:
      'Asymptotics, reductions, P vs NP intuition, and connecting theory to algorithm design choices.',
  },
]

export const labs: LabMeta[] = [
  {
    id: 'sorting',
    title: 'Sorting visualizer',
    status: 'live',
    path: AppRoutes.labSorting,
    blurb:
      'Instrument comparison sorts: step, compare algorithms on identical inputs, or drive the engine from Python.',
    topics: ['Algorithms', 'Empirical complexity', 'Python'],
  },
  {
    id: 'search',
    title: 'Search visualizer',
    status: 'soon',
    path: '/lab/search',
    blurb: 'Probe ordered and unordered collections under different search strategies.',
    topics: ['Algorithms', 'Data structures'],
  },
  {
    id: 'structures',
    title: 'Structures visualizer',
    status: 'soon',
    path: '/lab/structures',
    blurb: 'Layout, growth, and rebalancing of core data structures.',
    topics: ['Data structures'],
  },
  {
    id: 'systems',
    title: 'Systems visualizer',
    status: 'soon',
    path: '/lab/systems',
    blurb: 'Schedulers, memory, and concurrency mechanics as animated state machines.',
    topics: ['Operating systems'],
  },
]

const sortingCourse: CourseDetail = {
  ...courses.find((c) => c.id === 'sorting')!,
  overview: `This course treats sorting as a full algorithms topic—the kind of unit that appears in a bachelor’s algorithms course and deepens toward graduate study.

You will not “learn bubble sort as a product.” You will study the comparison model, prove or argue bounds, classify algorithms by asymptotic and practical behavior (stability, adaptivity, memory), implement instrumented variants, and use the lab to measure what the theory predicts.

Interactive labs are evidence tools: same input, dual engines, step counts, and Python hooks for instrumentation—not a substitute for reasoning about recurrences and invariants.`,
  prerequisites: [
    'Comfort with loops, arrays, and recursion',
    'Big-O / Θ / Ω notation (can be reviewed in Module 1)',
    'Optional for later modules: basic probability (for randomized quicksort)',
  ],
  learningGoals: [
    'State the comparison-based sorting model and the Ω(n log n) lower bound argument at a high level',
    'Analyze elementary and divide-and-conquer sorts (time, space, stability, adaptivity)',
    'Relate recurrences (e.g. T(n) = 2T(n/2) + Θ(n)) to observed compare/merge work in the lab',
    'Design fair empirical experiments: identical inputs, controlled n, reported metrics',
    'Implement instrumented sort routines that record compares/swaps and match reference behavior',
    'Discuss practical hybrids (introsort / timsort ideas) and external-memory sorting at a conceptual level',
  ],
  modules: [
    {
      id: 'm1-foundations',
      code: 'M1',
      title: 'Foundations of sorting',
      summary:
        'What “sorting” means formally: total orders, permutations, inversions, stability, in-place vs out-of-place, and the comparison decision-tree model that underpins lower bounds.',
      topics: [
        'Total orders and permutations',
        'Inversions as a measure of disorder',
        'Stability and why it matters for multi-key sorts',
        'In-place vs auxiliary memory',
        'Comparison model and decision trees',
        'Ω(n log n) lower bound for comparison sorts (argument sketch)',
      ],
      outcomes: [
        'Define stability and give an example where it changes multi-key behavior',
        'Explain why comparison sorts cannot beat Ω(n log n) in the worst case in the comparison model',
        'Connect inversion count to work done by adaptive elementary sorts',
      ],
      work: [
        {
          id: 'm1-inversions-lab',
          title: 'Lab: inversions and elementary work',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective:
            'On identical inputs, compare an elementary sort’s compare count as disorder changes; relate spikes to inversions qualitatively.',
          brief:
            'Use compare mode on insertion vs bubble with the same array. Shuffle, then try a nearly sorted list (small n). Record compare counts and write two sentences linking “disorder” to work—not just which algorithm is “faster.”',
          config: {
            algoId: 'insertion',
            algoBId: 'bubble',
            compare: true,
            runMode: 'reference',
            arraySize: 16,
          },
        },
        {
          id: 'm1-stability-reading',
          title: 'Reading / analysis: stability',
          kind: 'analysis',
          status: 'live',
          objective:
            'Argue whether bubble and insertion as presented are stable, with a short counterexample sketch if not, or an invariant if yes.',
          brief:
            'Theory work (no lab required). Use equal keys mentally: does relative order of equals survive? Write a short justification you could put on an exam.',
        },
      ],
    },
    {
      id: 'm2-elementary',
      code: 'M2',
      title: 'Elementary comparison sorts',
      summary:
        'Insertion, selection, and bubble as a family: quadratic worst case, best-case adaptivity (especially insertion), and pedagogical role—not as production default sorts.',
      topics: [
        'Insertion sort: adaptive, stable (classic form), online flavor',
        'Selection sort: fixed swap structure, not adaptive',
        'Bubble sort: adjacent transpositions; early-exit variants',
        'Θ(n²) worst/average for random permutations (intuition)',
        'When elementary sorts still appear (tiny n, nearly sorted tails)',
      ],
      outcomes: [
        'Give tight-style characterizations of best/worst cases for insertion',
        'Explain why selection is not adaptive',
        'Choose an elementary sort for a constrained setting and defend it',
      ],
      work: [
        {
          id: 'm2-adaptive-lab',
          title: 'Lab: adaptive vs non-adaptive behavior',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective:
            'Demonstrate insertion’s advantage on nearly ordered data versus a quadratic peer on the same family of inputs.',
          brief:
            'Compare insertion vs bubble. First on a shuffled array, then reshape input (shuffle less / manually prefer sorted prefixes). Document how compare counts move—this is the empirical shadow of adaptivity.',
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
          objective:
            'Implement insertion sort via compare/swap hooks so the visualizer’s step log is a faithful instrumentation of your code.',
          brief:
            'Python lab mode. Your hooks are the only sensors—every compare and swap must go through them. Match reference behavior on random inputs of n≈10–16.',
          config: {
            algoId: 'insertion',
            runMode: 'python',
            arraySize: 12,
            compare: false,
          },
        },
      ],
    },
    {
      id: 'm3-divide-conquer',
      code: 'M3',
      title: 'Divide and conquer: mergesort (and quicksort landscape)',
      summary:
        'Mergesort as the clean Θ(n log n) teaching vehicle: recurrence, merge work, memory. Quicksort as the practical cousin (partition, expected time, worst-case, randomization)—visualizer coverage expands as engines land.',
      topics: [
        'Mergesort recurrence T(n) = 2T(n/2) + Θ(n)',
        'Merge procedure and stability',
        'Space: auxiliary buffers vs linked structures',
        'Quicksort: partition, pivot policy, expected Θ(n log n)',
        'Worst-case Θ(n²) and mitigation (randomization, median-of-three, introsort idea)',
        'Comparing asymptotic class to measured merge/compare work',
      ],
      outcomes: [
        'Solve or unroll the mergesort recurrence at exam level',
        'Contrast mergesort’s guarantees with quicksort’s average-case story',
        'Use side-by-side runs to illustrate quadratic vs n log n regimes on shared inputs',
      ],
      work: [
        {
          id: 'm3-asymptotic-lab',
          title: 'Lab: quadratic vs n log n on shared inputs',
          kind: 'lab',
          status: 'live',
          labId: 'sorting',
          objective:
            'Hold the input fixed and contrast an elementary sort with mergesort; scale n and observe how the gap in step/compare metrics behaves.',
          brief:
            'Compare insertion vs merge on the same array; increase n (e.g. 12 → 24 → 32). Note that “steps” include marks/UI events—prefer compare counts as the cleaner complexity proxy. Write a short claim about growth, not a single race winner.',
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
          title: 'Implementation: mergesort-style instrumentation',
          kind: 'implementation',
          status: 'live',
          labId: 'sorting',
          objective:
            'Express a divide-and-conquer sort through the lab hooks (or the provided merge-oriented template) and validate against reference mergesort behavior.',
          brief:
            'Python mode with merge template. Focus on the structure of divide → conquer → combine and on which operations generate compares vs writes in the step stream.',
          config: {
            algoId: 'merge',
            runMode: 'python',
            arraySize: 12,
            compare: false,
          },
        },
        {
          id: 'm3-quicksort-analysis',
          title: 'Analysis: quicksort (theory)',
          kind: 'analysis',
          status: 'partial',
          objective:
            'Explain expected runtime under random pivots and why a fixed adversarial pivot policy fails; outline introsort’s hybrid escape hatch.',
          brief:
            'Written analysis for now—quicksort engine in the lab is forthcoming. Treat this as problem-set depth: recurrence for expected compares, worst-case input shape, and practical hybrids.',
        },
      ],
    },
    {
      id: 'm4-heaps-priority',
      code: 'M4',
      title: 'Heapsort and priority queues',
      summary:
        'Binary heaps as both a structure and a sort: heapify, extract-max loop, Θ(n log n) time, in-place appeal, and the deeper link to priority-queue ADTs used across algorithms.',
      topics: [
        'Heap property and array representation',
        'Build-heap in linear time (idea)',
        'Heapsort procedure',
        'Priority queues in graph algorithms (preview)',
        'Stability and cache behavior notes',
      ],
      outcomes: [
        'Describe heapsort without conflating it with “just another quadratic neighbor sort”',
        'Connect heapsort to the priority-queue abstraction',
      ],
      work: [
        {
          id: 'm4-heapsort-lab',
          title: 'Lab: heapsort visualizer',
          kind: 'lab',
          status: 'soon',
          labId: 'sorting',
          objective: 'Step heapify and extract phases; compare heapsort metrics to mergesort on identical inputs.',
          brief: 'Unlocks when the heap engine ships. Until then, complete M3 labs and the written heapsort sketch below.',
        },
        {
          id: 'm4-heapsort-sketch',
          title: 'Analysis: heapsort on paper',
          kind: 'analysis',
          status: 'live',
          objective:
            'Write the heapsort loop structure and argue Θ(n log n) time; state whether classic heapsort is stable.',
          brief: 'Exam-style written work. Optional: contrast space with mergesort.',
        },
      ],
    },
    {
      id: 'm5-practice-memory',
      code: 'M5',
      title: 'Practice, hybrids, and the memory hierarchy',
      summary:
        'What production runtimes actually do: introsort, timsort/run detection, cache-aware behavior, and external sorting when data exceeds RAM—graduate-leaning systems view of “the same” problem.',
      topics: [
        'Introsort: quicksort + heapsort fallback',
        'Timsort: runs, galloping, stability in the real world',
        'Cache lines and why constant factors dominate for moderate n',
        'External sorting: k-way merge, I/O complexity intuition',
        'Parallel sorting landscape (high level)',
      ],
      outcomes: [
        'Name why “we just teach mergesort” is incomplete for library sort',
        'Sketch external merge sort and what is being optimized (I/Os, not only CPU compares)',
      ],
      work: [
        {
          id: 'm5-hybrid-reading',
          title: 'Reading: library sorts',
          kind: 'reading',
          status: 'live',
          objective:
            'Summarize introsort or timsort in one page: motivation, components, and what guarantee each piece buys.',
          brief: 'No lab required. Cite any standard algorithms text or language runtime docs you use.',
        },
        {
          id: 'm5-external-sketch',
          title: 'Analysis: external sort',
          kind: 'analysis',
          status: 'live',
          objective:
            'Given RAM that holds B records and N ≫ B on disk, sketch multi-pass k-way merge and count passes asymptotically in N and B.',
          brief: 'Graduate-flavored I/O reasoning. Visualizer support is not required for this unit.',
        },
      ],
    },
    {
      id: 'm6-capstone',
      code: 'M6',
      title: 'Capstone: experimental algorithmics',
      summary:
        'Pull the course together: design a small empirical study, report metrics honestly, and connect observations back to asymptotic and structural claims.',
      topics: [
        'Threats to validity (step inflation, UI events vs compares)',
        'Fair benchmarks: identical seeds/inputs, varied n',
        'Reporting: tables, growth claims, limitations',
        'Optional implementation portfolio',
      ],
      outcomes: [
        'Produce a short lab report with method, data, and conclusion tied to theory',
        'Distinguish “won a race at n=16” from asymptotic evidence',
      ],
      work: [
        {
          id: 'm6-empirical-study',
          title: 'Project: fair bake-off',
          kind: 'project',
          status: 'live',
          labId: 'sorting',
          objective:
            'Design and run a comparison of at least two algorithms across at least three input regimes (e.g. random, reversed, nearly sorted) and two sizes; interpret with theory.',
          brief:
            'Use compare mode heavily. Prefer compare counts. Deliverable: short write-up (problem set length). Start from insertion vs merge as a baseline pair.',
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
  ],
}

const courseDetails: Record<string, CourseDetail> = {
  sorting: sortingCourse,
}

export function getCourse(id: string): CourseDetail | undefined {
  return courseDetails[id]
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
