import type { MeatPack } from './types'

/** Full Algorithms problem sets — original exercises, CLRS-style depth. */
export const algorithmsMeat: MeatPack[] = [
  {
    workId: 'alg-m1-problem-set',
    timeEstimate: '90–120 min',
    sources: [{ label: 'CLRS Ch. 3', kind: 'textbook', locator: 'Ch. 3' }],
    deliverables: ['Written solutions with justifications', 'Limit or hierarchy arguments for growth rates'],
    selfCheck: [
      'Every Θ claim has matching upper and lower argument',
      'Counterexamples are concrete functions, not slogans',
    ],
    solutionSketch: {
      problemId: 'a4',
      sketch:
        'Σ i = n(n+1)/2 = Θ(n²). Σ i² = n(n+1)(2n+1)/6 = Θ(n³). Σ 2^i = 2^{n+1}-1 = Θ(2^n). Σ i 2^i = (n-1)2^{n+1}+2 = Θ(n 2^n).',
    },
    problems: [
      {
        id: 'a1',
        title: 'P1 · Growth order',
        points: 20,
        prompt:
          'Order the following by asymptotic growth (slowest → fastest). Justify each adjacent pair with a limit or known hierarchy: n², 2ⁿ, n log n, n!, √n, n³/log n, 1.01ⁿ, log₂(n!).',
      },
      {
        id: 'a2',
        title: 'P2 · Nested loops',
        points: 25,
        prompt:
          'Give tight Θ bounds (as functions of n) for: (i) for i=1..n for j=1..i t+=1; (ii) for i=1..n for j=i..n for k=1..j t+=1; (iii) i=n; while i≥1 { for j=1..i t+=1; i=⌊i/2⌋ }. State best/worst if they differ for any variant with early exit.',
      },
      {
        id: 'a3',
        title: 'P3 · True/False',
        points: 20,
        prompt:
          'Prove or give counterexample functions f,g ≥ 0: (a) f=O(g) ⇒ g=Ω(f). (b) f=O(n²) and g=O(n²) ⇒ f+g=O(n²). (c) f=O(g) ⇒ 2^f = O(2^g). (d) max(f,g)=Θ(f+g).',
      },
      {
        id: 'a4',
        title: 'P4 · Sums',
        points: 20,
        prompt:
          'Derive closed forms and Θ class: Σ_{i=1}^{n} i, Σ_{i=1}^{n} i², Σ_{i=0}^{n} 2^i, Σ_{i=1}^{n} i·2^i. Show work (not only final formulas).',
      },
      {
        id: 'a5',
        title: 'P5 · Adversary',
        points: 15,
        prompt:
          'An algorithm “scans until it finds a zero.” Best case Θ(1), worst case Θ(n) on length-n arrays. Write precise best/worst input families and argue why average case needs a distribution (state one reasonable model).',
      },
    ],
  },
  {
    workId: 'alg-m2-recurrences',
    timeEstimate: '75–100 min',
    sources: [{ label: 'CLRS Ch. 4', kind: 'textbook' }],
    deliverables: ['Recurrence solutions with named method', 'At least one full substitution proof'],
    selfCheck: ['Base cases explicit', 'Induction hypothesis used correctly'],
    solutionSketch: {
      problemId: 'b1',
      sketch:
        '2T(n/2)+n → case 2 → Θ(n log n). 2T(n/2)+n² → case 3 → Θ(n²). 4T(n/2)+n → case 1 → Θ(n²). T(n/2)+1 → Θ(log n). 3T(n/3)+n log n → borderline/case 2-ish with log factors — state regularity carefully.',
    },
    problems: [
      {
        id: 'b1',
        title: 'P1 · Master theorem',
        points: 30,
        prompt:
          'Solve with Master Theorem (state case): T(n)=2T(n/2)+n, T(n)=2T(n/2)+n², T(n)=4T(n/2)+n, T(n)=T(n/2)+1, T(n)=3T(n/3)+n log n (discuss regularity if needed).',
      },
      {
        id: 'b2',
        title: 'P2 · Substitution',
        points: 30,
        prompt:
          'Prove by substitution that T(n)=2T(⌊n/2⌋)+n satisfies T(n)≤cn log n for suitable c and large n (handle floors carefully or use a smooth argument).',
      },
      {
        id: 'b3',
        title: 'P3 · Recursion tree',
        points: 25,
        prompt:
          'Draw a recursion tree for T(n)=T(n/3)+T(2n/3)+n. Bound the depth and argue T(n)=Θ(n log n).',
      },
      {
        id: 'b4',
        title: 'P4 · When D&C fails',
        points: 15,
        prompt:
          'Give an example problem where a divide-and-conquer split does not help (combine cost dominates or unbalanced split). Explain in ≤8 sentences.',
      },
    ],
  },
  {
    workId: 'm3-quicksort-analysis',
    timeEstimate: '60–80 min',
    sources: [{ label: 'CLRS Ch. 7', kind: 'textbook' }],
    deliverables: ['Expected-time argument sketch', 'Worst-case family', 'Hybrid note'],
    selfCheck: ['Randomization model stated', 'No claim that average = best'],
    problems: [
      {
        id: 'q1',
        title: 'P1 · Partition trace',
        points: 20,
        prompt:
          'Trace Lomuto or Hoare partition on [3,1,4,1,5,9,2,6] with pivot = last element. Show final array and pivot index.',
      },
      {
        id: 'q2',
        title: 'P2 · Worst case',
        points: 25,
        prompt:
          'Prove that if the pivot is always the minimum (or maximum), quicksort is Θ(n²). Give an explicit adversarial array family.',
      },
      {
        id: 'q3',
        title: 'P3 · Expected time',
        points: 35,
        prompt:
          'Under uniform random pivot (or random input permutation), sketch the O(n log n) expected comparison argument (indicator variables or recursion for expected cost).',
      },
      {
        id: 'q4',
        title: 'P4 · Introsort idea',
        points: 20,
        prompt:
          'Explain introsort’s hybrid escape: when depth exceeds ~2 log n, switch to heapsort. Why does this cap worst case at O(n log n) while preserving fast typical behavior?',
      },
    ],
  },
  {
    workId: 'm4-heapsort-sketch',
    timeEstimate: '45–60 min',
    sources: [{ label: 'CLRS Ch. 6', kind: 'textbook' }],
    deliverables: ['Heapify argument', 'Stability answer'],
    selfCheck: [
      'Array indexing 1-based or 0-based stated consistently',
      'BUILD-HEAP bound uses height-sum, not n × log n only',
    ],
    problems: [
      {
        id: 'h1',
        title: 'P1 · Build-heap',
        points: 30,
        prompt: 'Show BUILD-MAX-HEAP on [4,1,3,2,16,9,10,14,8,7] (array diagram after each sift).',
      },
      {
        id: 'h2',
        title: 'P2 · Complexity',
        points: 40,
        prompt:
          'Argue BUILD-HEAP is O(n) (not O(n log n)) using the height-sum argument. Then argue HEAPSORT is Θ(n log n).',
      },
      {
        id: 'h3',
        title: 'P3 · Stability',
        points: 30,
        prompt:
          'Is heapsort stable? Give a 4-element counterexample with equal keys if unstable, or argue stability.',
      },
    ],
  },
  {
    workId: 'alg-m4-graph-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'CLRS Ch. 22–24', kind: 'textbook' }],
    deliverables: ['Diagrams + complexity answers', 'Dijkstra settle order with distances'],
    selfCheck: ['BFS layers correct', 'Edge classifications if DFS'],
    problems: [
      {
        id: 'g1',
        title: 'P1 · Representation',
        points: 20,
        prompt:
          'For a directed graph with n=10⁴ vertices and m=3·10⁴ edges, compare adjacency matrix vs list for: space, edge query (u,v), enumerate neighbors of u. Pick one for BFS and justify.',
      },
      {
        id: 'g2',
        title: 'P2 · BFS layers',
        points: 25,
        prompt:
          'On undirected graph with edges {AB,AC,BD,BE,CF,EF}, run BFS from A. List discovery order (break ties alphabetically) and distance labels.',
      },
      {
        id: 'g3',
        title: 'P3 · DFS / topo',
        points: 25,
        prompt:
          'On DAG edges A→B, A→C, B→D, C→D, C→E, run DFS and produce a topological order. Show finish times.',
      },
      {
        id: 'g4',
        title: 'P4 · Shortest paths',
        points: 30,
        prompt:
          'On the City teaching graph (weights as in the lab: A-B 2, A-C 4, B-D 3, B-E 5, C-E 1, D-F 4, E-F 2, D-E 1), compute Dijkstra distances from A. Show settle order.',
      },
    ],
  },
  {
    workId: 'alg-m5-greedy-ps',
    timeEstimate: '60 min',
    sources: [{ label: 'CLRS Ch. 16', kind: 'textbook' }],
    deliverables: ['Selected interval set with step-by-step greedy trace', 'Exchange proof sketch + counterexample'],
    selfCheck: [
      'Exchange argument names the first differing job and the swap',
      'Counterexample has explicit numbers (coins or edge weights)',
    ],
    problems: [
      {
        id: 'gr1',
        title: 'P1 · Interval scheduling',
        points: 40,
        prompt:
          'Intervals (start,finish): (1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11),(8,12),(2,14),(12,16). Select max non-overlapping set by earliest-finish greedy. Show the set.',
      },
      {
        id: 'gr2',
        title: 'P2 · Exchange',
        points: 35,
        prompt:
          'Sketch an exchange argument that earliest-finish is optimal for interval scheduling: assume an optimal set O differs from greedy G at the first job; show how to swap without losing feasibility or size.',
      },
      {
        id: 'gr3',
        title: 'P3 · Greedy fails',
        points: 25,
        prompt:
          'Give a coin system where canonical greedy change-making fails, with amounts. (Or a graph shortest-path greedy that fails.) Example form: coins {1,3,4}, make change for 6.',
      },
    ],
  },
  {
    workId: 'alg-m6-dp-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'CLRS Ch. 15', kind: 'textbook' }],
    deliverables: ['Recurrences + filled tables', 'One reconstructed solution (cuts or LCS string)'],
    selfCheck: ['Base cases filled', 'Reconstruction path shown'],
    problems: [
      {
        id: 'd1',
        title: 'P1 · Rod cutting',
        points: 30,
        prompt:
          'Prices p=[0,1,5,8,9,10,17,17,20,24,30] (index = length). Compute r_n for n=1..7 bottom-up; show first cut s_n.',
      },
      {
        id: 'd2',
        title: 'P2 · LCS',
        points: 35,
        prompt:
          'Compute LCS length and one LCS string for X=ABCBDAB, Y=BDCABA. Show the full DP table of lengths and backtrack one solution.',
      },
      {
        id: 'd3',
        title: 'P3 · Formulate',
        points: 35,
        prompt:
          'Write a DP recurrence for 0-1 knapsack with capacity W and n items (v_i,w_i). Instantiate on items (v,w)∈{(6,2),(10,2),(12,3)} with W=5; fill the table and give optimal value.',
      },
    ],
  },
  {
    workId: 'alg-m7-reading',
    timeEstimate: '75–100 min',
    sources: [
      {
        label: 'MIT OCW 6.046J — selected advanced units',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/',
      },
      { label: 'CLRS — Ch. 17 amortized / Ch. 26 max-flow / Ch. 35 approximation (pick one arc)', kind: 'textbook' },
    ],
    deliverables: [
      'One-page topic map: advanced topic → M1–M6 prerequisites',
      'Cited chapter/OCW lecture list with locators',
    ],
    selfCheck: [
      'Topic is one of amortized analysis, max-flow, randomized algorithms, or approximation',
      'Every prerequisite claim points to a concrete earlier module (M1–M6)',
    ],
    problems: [
      {
        id: 'r1',
        title: 'P1 · Choose & cite',
        points: 25,
        prompt:
          'Pick one advanced topic: (A) amortized analysis (aggregate or potential), (B) max-flow / min-cut landscape, (C) randomized algorithms beyond quicksort, or (D) approximation algorithms idea. Cite one CLRS chapter (or OCW 6.046 lecture) with locator/URL and state the reading scope in 3 bullets.',
      },
      {
        id: 'r2',
        title: 'P2 · Prerequisite map',
        points: 40,
        prompt:
          'Write a one-page map: for your topic, list ≥4 prerequisite ideas from M1–M6 (e.g. asymptotics, recurrences, graphs, greedy/DP) and how each is used. Example form: “Max-flow needs residual graphs (M4) and greedy augmenting paths intuition (M5)…”. Flag one gap in your background.',
      },
      {
        id: 'r3',
        title: 'P3 · Worked micro-instance',
        points: 35,
        prompt:
          'Do one concrete micro-exercise matching your topic: (A) potential Φ for a binary counter 0→15, total cost; (B) one Ford–Fulkerson augmenting path on a 4-edge flow network you draw with capacities; (C) expected flips for randomized hiring or a 3-element random-pivot sketch; (D) 2-approx idea for metric TSP or vertex cover on path graph P₄. Show numbers.',
      },
    ],
  },
  {
    workId: 'alg-m8-npc-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'CLRS Ch. 34 / Sipser', kind: 'textbook' }],
    deliverables: ['Definitions with examples', 'One reduction construction sketch'],
    selfCheck: ['Direction of reduction correct', 'Poly-time claimed carefully'],
    problems: [
      {
        id: 'n1',
        title: 'P1 · Definitions',
        points: 25,
        prompt:
          'Define decision problem, P, NP (via certificates), and polynomial-time Karp reduction. Give one example in each of P and NP-complete (standard names OK).',
      },
      {
        id: 'n2',
        title: 'P2 · Reduction direction',
        points: 35,
        prompt:
          'If A ≤_p B and B ∈ P, what can you conclude about A? If A is NP-complete, B ∈ NP, and A ≤_p B, what about B?',
      },
      {
        id: 'n3',
        title: 'P3 · Sketch',
        points: 40,
        prompt:
          'Sketch why Independent Set ≤_p Clique (or 3-SAT ≤_p Independent Set at high level): describe the construction in ≤1 page.',
      },
    ],
  },
]
