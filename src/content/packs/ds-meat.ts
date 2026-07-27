import type { MeatPack } from './types'

export const dataStructuresMeat: MeatPack[] = [
  {
    workId: 'ds-m1-ps',
    timeEstimate: '60 min',
    deliverables: ['ADT specs with complexities', 'One alternative representation each'],
    selfCheck: ['Operations total a closed interface', 'Complexities match representation'],
    solutionSketch: {
      problemId: 'd4',
      sketch:
        'Aggregate: n appends with doubling cost 1+2+4+…+n ≤ 2n → amortized O(1). Worst single append is Θ(n) when resizing.',
    },
    problems: [
      {
        id: 'd1',
        title: 'P1 · Stack ADT',
        points: 25,
        prompt:
          'Specify Stack ADT: push, pop, peek, isEmpty with pre/postconditions and worst-case times Θ(1) for array-top and linked-list-head representations.',
      },
      {
        id: 'd2',
        title: 'P2 · Queue',
        points: 25,
        prompt:
          'Same for Queue (enqueue/dequeue): circular buffer of capacity n vs linked list. When is buffer full? Give Θ costs.',
      },
      {
        id: 'd3',
        title: 'P3 · Dictionary',
        points: 30,
        prompt:
          'Specify Dictionary (insert, delete, find). Balanced BST find Θ(log n) worst; hash average Θ(1), worst Θ(n). When pick which?',
      },
      {
        id: 'd4',
        title: 'P4 · Amortized',
        points: 20,
        prompt:
          'Dynamic array doubles when full. Argue append is amortized O(1) (aggregate or banker’s method). State worst-case single append.',
      },
    ],
  },
  {
    workId: 'ds-m2-ps',
    timeEstimate: '50 min',
    deliverables: ['Cost table', 'Workload recommendation paragraph'],
    selfCheck: ['Index costs distinguished from insert costs', 'Θ notation used consistently'],
    problems: [
      {
        id: 'l1',
        title: 'P1 · Cost table',
        points: 40,
        prompt:
          'Fill a table for array vs singly linked list: access[i], insert at head, insert at tail (with/without tail pointer), delete head, search by value. Use Θ.',
      },
      {
        id: 'l2',
        title: 'P2 · Workload',
        points: 35,
        prompt:
          'Workload: 10⁵ appends then 10³ random index reads. Which representation wins and why?',
      },
      {
        id: 'l3',
        title: 'P3 · Lab link',
        points: 25,
        prompt:
          'Using the list-append lab sequence [4,8,2,9,1], state which cells are live after each append and the final index of value 2.',
      },
    ],
  },
  {
    workId: 'ds-m4-ps',
    timeEstimate: '70 min',
    deliverables: ['Trees drawn', 'Height analysis'],
    selfCheck: ['BST property holds in drawings'],
    problems: [
      {
        id: 't1',
        title: 'P1 · Insert sequence',
        points: 30,
        prompt: 'Insert 7,3,11,1,9,5 into an empty BST. Draw the tree. List inorder.',
      },
      {
        id: 't2',
        title: 'P2 · Adversary',
        points: 35,
        prompt:
          'Insert 1..7 in sorted order. Height? Compare to balanced height ⌊log₂ 7⌋. State worst-case search cost.',
      },
      {
        id: 't3',
        title: 'P3 · Balance idea',
        points: 35,
        prompt:
          'In ≤1 page, explain how one rotation type (AVL or red-black landscape) restores balance after a spine insert—diagram welcome.',
      },
    ],
  },
  {
    workId: 'ds-m5-ps',
    timeEstimate: '55 min',
    deliverables: ['Heap diagrams', 'Extract-min trace'],
    selfCheck: ['Heap property after each sift', 'Array indices consistent (0- or 1-based stated)'],
    problems: [
      {
        id: 'h1',
        title: 'P1 · Inserts',
        points: 40,
        prompt: 'Min-heap insert 9,4,7,1,6,3. Show array after each sift-up completes.',
      },
      {
        id: 'h2',
        title: 'P2 · Extract',
        points: 35,
        prompt: 'From the final heap, extract-min once; show sift-down.',
      },
      {
        id: 'h3',
        title: 'P3 · PQ use',
        points: 25,
        prompt: 'Name two algorithms (from Algorithms course) that use a priority queue and what the keys represent.',
      },
    ],
  },
  {
    workId: 'ds-m6-ps',
    timeEstimate: '60 min',
    deliverables: ['Numeric α calculations', 'Clustering explanation with table'],
    selfCheck: ['Load factor formula correct', 'Chains match h(k)=k mod 7 inserts'],
    problems: [
      {
        id: 'ha1',
        title: 'P1 · Chaining',
        points: 35,
        prompt:
          'm=7, h(k)=k mod 7, insert 10,3,17,24,31,8,15. Draw chains. Compute α. Expected unsuccessful search probes under uniform assumption?',
      },
      {
        id: 'ha2',
        title: 'P2 · Clustering',
        points: 30,
        prompt: 'Explain primary clustering in linear probing in ≤8 sentences with a small example table.',
      },
      {
        id: 'ha3',
        title: 'P3 · Resize',
        points: 35,
        prompt: 'When α exceeds 0.75 you rehash to 2m. Cost of one resize? Amortized insert under geometric growth?',
      },
    ],
  },
  {
    workId: 'ds-m2-lab',
    timeEstimate: '30–40 min',
    sources: [{ label: 'Berkeley 61B — lists unit (concepts)', kind: 'curriculum' }],
    deliverables: ['Append trace table for values [4,8,2,9,1]', 'Insert-at-front cost paragraph'],
    selfCheck: ['structureDemo list-append used', 'Final index of value 2 stated'],
    solutionSketch: {
      problemId: 'la2',
      sketch:
        'Final order [4,8,2,9,1]; value 2 is at index 2. Contiguous array access[i] is Θ(1). Insert-front shifts all elements → Θ(n); linked list insert-front is Θ(1) with a head pointer.',
    },
    problems: [
      {
        id: 'la1',
        title: 'P1 · Append trace',
        points: 35,
        prompt:
          'Run structureDemo list-append on values [4, 8, 2, 9, 1]. After each append, list the live cells left-to-right and the new cell’s index.',
      },
      {
        id: 'la2',
        title: 'P2 · Index of 2',
        points: 25,
        prompt:
          'In the final list from P1, what is the index of value 2? What is the asymptotic cost of access[i] on this contiguous representation?',
      },
      {
        id: 'la3',
        title: 'P3 · Insert front',
        points: 40,
        prompt:
          'Explain in ≥5 sentences why insert-at-front on a dynamic array is Θ(n) while append is amortized Θ(1). Contrast with a singly linked list.',
      },
    ],
  },
  {
    workId: 'ds-m3-ps',
    timeEstimate: '60–75 min',
    sources: [{ label: 'Standard DS text — binary trees chapter', kind: 'textbook' }],
    deliverables: ['Traversal lists', 'Inductive size/height argument'],
    selfCheck: ['Pre/in/post orders all listed for the same tree', 'Induction has base + inductive step'],
    problems: [
      {
        id: 'tr1',
        title: 'P1 · Traversals',
        points: 35,
        prompt:
          'Binary tree: root 8, left subtree (3 with children 1,6), right child 10 with right child 14. List preorder, inorder, postorder, and level-order.',
      },
      {
        id: 'tr2',
        title: 'P2 · Height vs size',
        points: 35,
        prompt:
          'Prove by induction on n: any binary tree with n nodes has height h ≥ ⌊log₂ n⌋. State the base case and inductive step carefully.',
      },
      {
        id: 'tr3',
        title: 'P3 · Expression tree',
        points: 30,
        prompt:
          'Build an expression tree for (2+3)*(7−4). Give postorder (RPN) and evaluate it. How many leaves?',
      },
    ],
  },
  {
    workId: 'ds-m5-lab',
    timeEstimate: '30–40 min',
    sources: [
      {
        label: 'MIT OCW 6.006 priority queues',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      },
    ],
    deliverables: ['Array after each insert', 'Two sift-up swap sequences'],
    selfCheck: ['structureDemo heap-insert; values [9,4,7,1,6,3]', 'Root is minimum after all inserts'],
    problems: [
      {
        id: 'hl1',
        title: 'P1 · Insert sequence',
        points: 40,
        prompt:
          'Run structureDemo heap-insert on values [9, 4, 7, 1, 6, 3]. Record the 0-based array after each insert’s sift-up completes.',
      },
      {
        id: 'hl2',
        title: 'P2 · Sift-up swaps',
        points: 35,
        prompt:
          'For the inserts of 1 and of 3, list every parent/child index swap during sift-up. State the final min at the root.',
      },
      {
        id: 'hl3',
        title: 'P3 · Cost',
        points: 25,
        prompt:
          'Argue insert is O(log n) in a binary heap of n elements (height argument). What is extract-min’s asymptotic cost?',
      },
    ],
  },
  {
    workId: 'ds-m6-lab',
    timeEstimate: '30–40 min',
    sources: [{ label: 'Berkeley 61B — hashing', kind: 'curriculum' }],
    deliverables: ['Chain diagram at m=7', 'Load-factor table', 'Resize threshold note'],
    selfCheck: ['structureDemo hash-insert; values [10,3,17,24,31,8,15]', 'α = n/m used correctly'],
    problems: [
      {
        id: 'hlab1',
        title: 'P1 · Chains',
        points: 40,
        prompt:
          'Run structureDemo hash-insert with h(k)=k mod 7 on [10, 3, 17, 24, 31, 8, 15]. Draw all seven chains after the full sequence.',
      },
      {
        id: 'hlab2',
        title: 'P2 · Load factor',
        points: 30,
        prompt:
          'Compute α after 3 inserts and after all 7 inserts (m=7). Expected unsuccessful search chain length under uniform hashing at final α?',
      },
      {
        id: 'hlab3',
        title: 'P3 · Resize policy',
        points: 30,
        prompt:
          'If you resize when α > 0.75, would you resize during this lab sequence? At what n for m=7? State rehash cost order.',
      },
    ],
  },
  {
    workId: 'ds-m7-ps',
    timeEstimate: '65–80 min',
    sources: [{ label: 'CLRS — elementary graph representations', kind: 'textbook' }],
    deliverables: ['Representation choice table', 'BFS/DFS sketches on a concrete graph'],
    selfCheck: ['Space in Θ of V,E stated', 'Traversal visits each vertex once in connected graph'],
    problems: [
      {
        id: 'g1',
        title: 'P1 · Representation choice',
        points: 35,
        prompt:
          'Graph has |V|=10⁴, |E|=3·10⁴, need “neighbors of v” often and rare edge existence queries. Choose adj list vs matrix; give space and neighbor-iteration cost.',
      },
      {
        id: 'g2',
        title: 'P2 · Dense case',
        points: 25,
        prompt:
          'Same V but E ≈ V²/4. When is adj matrix preferable? Give a numeric space comparison for |V|=500.',
      },
      {
        id: 'g3',
        title: 'P3 · BFS/DFS sketch',
        points: 40,
        prompt:
          'Undirected graph: edges {A-B,A-C,B-D,C-D,D-E}. From A, list BFS layers and one valid DFS discovery order. State queue vs stack ADT used.',
      },
    ],
  },
  {
    workId: 'ds-m7-lab',
    timeEstimate: '35–45 min',
    sources: [{ label: 'Cross-link: Algorithms M4 graph labs', kind: 'notes' }],
    deliverables: ['Representation cost table', 'Traversal plan on a fixed instance'],
    selfCheck: ['Adj list vs matrix costs numeric', 'BFS/DFS distinguished by frontier ADT'],
    problems: [
      {
        id: 'gl1',
        title: 'P1 · Cost model',
        points: 35,
        prompt:
          'For the lab graph-structure traversal (graphs instrument), assume |V|=n, |E|=m. Fill costs: store adj list, store matrix, iterate neighbors(v), test edge (u,v).',
      },
      {
        id: 'gl2',
        title: 'P2 · Sparse instance',
        points: 35,
        prompt:
          'On paper use edges {0-1,1-2,2-3,3-0,0-2}. Prefer list or matrix for n=4? Run BFS from 0: visit order and parent pointers.',
      },
      {
        id: 'gl3',
        title: 'P3 · DFS contrast',
        points: 30,
        prompt:
          'Same graph, DFS from 0 (stack or recursion). Discovery order; name one edge that is a back edge if the graph is treated as undirected.',
      },
    ],
  },
  {
    workId: 'ds-m8-reading',
    timeEstimate: '45–60 min',
    sources: [{ label: 'CLRS — B-trees / union-find surveys', kind: 'textbook' }],
    deliverables: ['One-page structure map', 'Use-case + M1–M7 prereq links'],
    selfCheck: ['Concrete system named', 'At least two M1–M7 topics cited as prerequisites'],
    problems: [
      {
        id: 'r1',
        title: 'P1 · Pick a structure',
        points: 30,
        prompt:
          'Choose one of: B-tree, trie, or union-find. In ≤1 paragraph, define the ADT operations it primarily supports.',
      },
      {
        id: 'r2',
        title: 'P2 · Prerequisite map',
        points: 35,
        prompt:
          'Map your structure to ≥3 ideas from M1–M7 (e.g. trees, hashing, amortization). Explain how each prerequisite is used inside the structure.',
      },
      {
        id: 'r3',
        title: 'P3 · Real system',
        points: 35,
        prompt:
          'Name one real system or library use case (DB index, filesystem, network connectivity, autocomplete, etc.). Why not a plain BST or hash table alone?',
      },
    ],
  },
]
