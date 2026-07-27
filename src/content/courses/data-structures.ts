import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { labHandout } from '../handouts'
import { analysisWork, labSoon, moduleOf, readingWork } from '../scaffold'

export const dataStructuresMeta: CourseMeta = {
  id: 'data-structures',
  title: 'Data Structures',
  status: 'partial',
  track: 'Core · required',
  level: 'undergraduate',
  moduleCount: 8,
  liveLabCount: 4,
  academicNote: 'Foundational required · typically sophomore',
  blurb:
    'Abstract data types, representations, and costs: lists, trees, heaps, hash tables, graphs as structures — invariants and when each wins.',
  cs2023Areas: ['AL', 'SF'],
}

export const dataStructuresCourse: CourseDetail = {
  ...dataStructuresMeta,
  peerAnchors: [
    {
      school: 'UC Berkeley',
      courseCode: 'CS 61B',
      title: 'Data Structures',
      note: 'ADT implementations, asymptotic cost, Java-era classic',
    },
    {
      school: 'CMU',
      courseCode: '15-210',
      title: 'Parallel and Sequential Data Structures and Algorithms',
      note: 'DS half + parallel flavor (elective depth)',
    },
    {
      school: 'MIT',
      courseCode: '6.006',
      title: 'Introduction to Algorithms (DS units)',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      note: 'Heaps, hash tables, graph representations as structure',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['AL', 'SF'],
  overview: `Core **Data Structures** course: how we organize data to support operations efficiently. Companion to Algorithms (who often share a year in the curriculum). This is not intro programming—students are expected to implement and analyze ADTs.

Labs will visualize layout, growth, and rebalancing as engines land. The full module plan is published so the catalog reads like a real CSE path; interactive instruments ship progressively.`,
  prerequisites: [
    'Intro programming completed (not CSE 101)',
    'Discrete Math concurrent or prior recommended',
    'Comfort with asymptotic notation (can be concurrent with Algorithms M1)',
  ],
  learningGoals: [
    'Specify ADTs and choose representations with complexity consequences',
    'Implement and analyze lists, trees, heaps, and hash tables',
    'Explain balanced-tree and hash-table performance at course level',
    'Use graphs as a structure (representation) ahead of graph algorithms',
  ],
  modules: [
    moduleOf({
      id: 'ds-m1',
      code: 'M1',
      title: 'Complexity review & ADTs',
      schedule: 'Week 1',
      summary: 'Asymptotics recap, abstract data types, and interface vs representation.',
      topics: ['ADT vs data structure', 'Amortized preview', 'Interface contracts', 'Big-O recap'],
      outcomes: [
        'Specify an ADT with operation complexities',
        'Separate interface from representation in a short design note',
      ],
      lectureBeats: [
        'ADT = operations + contracts; data structure = representation + algorithms',
        'Asymptotics recap before choosing structures',
        'Amortized cost matters for dynamic arrays and resizing tables',
        'Interface first, then pick array vs linked vs tree vs hash',
      ],
      readings: [
        { label: 'Goodrich / Tamassia / Goldwasser — Ch. 1–2 style foundations', kind: 'textbook' },
        { label: 'Berkeley 61B — ADT and asymptotic review (term materials)', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ds-m1-ps',
          'Problem set: ADT specs',
          'Specify 2–3 ADTs with operation costs and one alternative representation each.',
          'Written. Full autograded pack forthcoming; use this as syllabus-aligned homework shape.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'ds-m2',
      code: 'M2',
      title: 'Arrays, lists, stacks, queues',
      schedule: 'Weeks 2–3',
      summary: 'Contiguous vs linked representations; amortized growth of dynamic arrays.',
      topics: ['Dynamic arrays', 'Linked lists', 'Stacks/queues', 'Amortized append', 'Deque variants'],
      outcomes: [
        'Compare array vs linked list for given workloads',
        'Explain amortized O(1) append with geometric growth',
      ],
      lectureBeats: [
        'Array: Θ(1) index, costly middle insert; linked list: Θ(1) splice at known node, Θ(n) index',
        'Dynamic array doubles → amortized Θ(1) append (aggregate or banker’s method)',
        'Stack/queue as ADTs with multiple representations (array circular buffer vs linked)',
        'Lab: list-append on [4,8,2,9,1] builds contiguous layout intuition',
      ],
      readings: [
        { label: 'CLRS / DS texts — dynamic tables & lists', kind: 'textbook' },
        { label: 'Berkeley 61B — lists and arrays unit', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ds-m2-ps',
          'Problem set: list costs',
          'Fill cost tables for insert/delete/index on array vs linked representations for three workloads.',
          'Written analysis. Optional: use the list demo lab to build intuition for append-heavy traces.',
          'live',
          [{ label: 'Goodrich et al. — arrays & linked lists', kind: 'textbook' }],
        ),
        {
          id: 'ds-m2-lab',
          title: 'Lab: list append trace',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective: 'Step appends on a contiguous list and relate index highlights to O(1) access.',
          brief:
            'Run List/array append on a short value sequence. Note which cell is new each step. Write one paragraph on why insert-at-front differs.',
          config: {
            structureDemo: 'list-append',
            values: [4, 8, 2, 9, 1],
          },
          sources: [{ label: 'Berkeley 61B — lists unit (concepts)', kind: 'curriculum' }],
        },
      ],
    }),
    moduleOf({
      id: 'ds-m3',
      code: 'M3',
      title: 'Trees & hierarchical structure',
      schedule: 'Week 4',
      summary: 'Binary trees, traversals, expression trees, and tree ADTs.',
      topics: ['Binary trees', 'Traversals (pre/in/post/level)', 'Tree height/size', 'Expression trees'],
      outcomes: [
        'Implement and analyze basic tree operations',
        'Relate traversal order to problem structure',
      ],
      lectureBeats: [
        'Tree size/height relationships; binary tree with n nodes has h ≥ ⌊log₂ n⌋',
        'Preorder / inorder / postorder / level-order: recursive structure vs queue',
        'Expression trees: leaves are operands; postorder evaluates RPN',
        'Tree ADT operations (root, children, height) separate from BST search invariants',
      ],
      readings: [{ label: 'Standard DS text — binary trees chapter', kind: 'textbook' }],
      work: [
        analysisWork(
          'ds-m3-ps',
          'Problem set: trees',
          'Trace traversals and reason about height vs size relationships.',
          'Written. Include at least one inductive argument on tree size/height.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'ds-m4',
      code: 'M4',
      title: 'Search trees',
      schedule: 'Weeks 5–6',
      summary: 'BSTs, imbalance, and balanced trees (AVL/red-black landscape).',
      topics: ['BST dictionary', 'Imbalance', 'AVL rotations (landscape)', 'Red-black overview'],
      outcomes: [
        'Explain worst-case BST vs balanced guarantees',
        'Sketch why rotations restore balance invariants',
      ],
      lectureBeats: [
        'BST inorder is sorted; search/insert follow left/right by key compare',
        'Sorted inserts build a spine → Θ(n) height and search',
        'Rotations preserve inorder while changing shape (AVL/RB landscape)',
        'Lab: bst-insert on 7,3,11,1,9,5 vs sorted sequence shows imbalance risk',
      ],
      readings: [
        { label: 'CLRS — binary search trees & red-black overview', kind: 'textbook' },
        { label: 'Berkeley 61B — BSTs and balanced trees', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ds-m4-ps',
          'Problem set: BST vs balanced',
          'Construct an adversarial insert sequence that yields a spine; contrast with balanced-tree height claims.',
          'Written. Use BST insert lab to observe a bad order, then analyze on paper.',
          'live',
          [{ label: 'CLRS — binary search trees', kind: 'textbook' }],
        ),
        {
          id: 'ds-m4-lab',
          title: 'Lab: BST insert paths',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective: 'Insert a key sequence and record search paths; identify imbalance risk.',
          brief:
            'Run BST insert on 7,3,11,1,9,5 then on a sorted sequence of your choice. Compare tree shapes and path lengths in a short write-up.',
          config: {
            structureDemo: 'bst-insert',
            values: [7, 3, 11, 1, 9, 5],
          },
          sources: [{ label: 'Berkeley 61B — BSTs', kind: 'curriculum' }],
          handout: labHandout(
            [
              'Run the preconfigured BST sequence; sketch the final tree.',
              'Re-run with a sorted sequence (e.g. 1,2,3,4,5,6); sketch again.',
              'Compare heights and relate to O(n) worst-case search.',
              'Name one balanced-tree approach that would fix the spine case (survey depth).',
            ],
            { timeEstimate: '30–45 min' },
          ),
        },
      ],
    }),
    moduleOf({
      id: 'ds-m5',
      code: 'M5',
      title: 'Heaps & priority queues',
      schedule: 'Week 7',
      summary: 'Binary heaps, heap operations, and priority-queue applications.',
      topics: ['Heap property', 'Insert/extract', 'Heapify', 'PQ ADT', 'Heapsort bridge'],
      outcomes: [
        'Connect heaps to scheduling and algorithms courses',
        'Analyze insert/extract in a binary heap',
      ],
      lectureBeats: [
        'Min-heap: parent ≤ children; complete tree → compact array layout',
        'Insert = append + sift-up O(log n); extract-min = root swap + sift-down O(log n)',
        'BUILD-HEAP is O(n); priority queue ADT powers Dijkstra / scheduling / heapsort',
        'Lab: heap-insert on [9,4,7,1,6,3] — watch root become the minimum',
      ],
      readings: [
        { label: 'CLRS — Chapter 6 (Heapsort)', kind: 'textbook', locator: 'Ch. 6' },
        {
          label: 'MIT OCW 6.006 — priority queues',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
      ],
      work: [
        analysisWork(
          'ds-m5-ps',
          'Problem set: heaps',
          'Trace heap operations and justify O(log n) bounds; connect to priority queues in Algorithms.',
          'Written. Optional bridge to Algorithms M3 heapsort analysis.',
          'live',
          [{ label: 'CLRS Ch. 6 (Heapsort)', kind: 'textbook', locator: 'Ch. 6' }],
        ),
        {
          id: 'ds-m5-lab',
          title: 'Lab: min-heap insert & sift-up',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective: 'Step sift-up after each insert; identify the min at the root.',
          brief:
            'Run min-heap insert on a shuffled sequence. For two inserts, write the swap sequence. State insert cost.',
          config: {
            structureDemo: 'heap-insert',
            values: [9, 4, 7, 1, 6, 3],
          },
          sources: [
            {
              label: 'MIT OCW 6.006 priority queues',
              kind: 'ocw',
              url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
            },
          ],
        },
      ],
    }),
    moduleOf({
      id: 'ds-m6',
      code: 'M6',
      title: 'Hashing',
      schedule: 'Weeks 8–9',
      summary: 'Hash functions, chaining vs open addressing, load factor.',
      topics: [
        'Hash families (intro)',
        'Collision resolution',
        'Load factor',
        'Amortized expected time',
        'Resizing',
      ],
      outcomes: [
        'Tune load factor reasoning; know failure modes',
        'Compare chaining vs open addressing for a stated workload',
      ],
      lectureBeats: [
        'Uniform hashing ideal: expected chain length ≈ α = n/m',
        'Chaining vs open addressing; primary clustering under linear probe',
        'Resize/rehash when α exceeds a threshold → amortized expected insert',
        'Lab: hash-insert m=7, keys 10,3,17,24,31,8,15 — watch chains and α grow',
      ],
      readings: [
        { label: 'CLRS — hash tables chapter', kind: 'textbook' },
        { label: 'Berkeley 61B — hashing unit', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ds-m6-ps',
          'Problem set: hashing',
          'Compute expected chain lengths under uniform hashing; discuss clustering vs chaining.',
          'Written analysis at undergrad midterm depth.',
          'live',
          [{ label: 'CLRS — hash tables', kind: 'textbook' }],
        ),
        {
          id: 'ds-m6-lab',
          title: 'Lab: chaining under load',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective: 'Insert keys with h(k)=k mod m and observe chain growth / load factor.',
          brief:
            'Run hash chaining insert. Note α after each batch. Write when you would resize in a real table.',
          config: {
            structureDemo: 'hash-insert',
            values: [10, 3, 17, 24, 31, 8, 15],
          },
          sources: [{ label: 'Berkeley 61B — hashing', kind: 'curriculum' }],
        },
      ],
    }),
    moduleOf({
      id: 'ds-m7',
      code: 'M7',
      title: 'Graphs as structures',
      schedule: 'Weeks 10–11',
      summary: 'Representations and basic traversal interfaces—before Algorithms graph design.',
      topics: ['Adj list/matrix', 'Degree, paths', 'BFS/DFS as structure ops', 'Sparse vs dense'],
      outcomes: [
        'Pick a representation for a stated constraint set',
        'Implement BFS/DFS as structure traversals (not full shortest-path design)',
      ],
      lectureBeats: [
        'Adj list Θ(V+E) space; matrix Θ(V²); pick by sparsity and query mix',
        'BFS = queue frontier (layers / hop distance); DFS = stack/recursion',
        'Representation choice is a structure decision before algorithm design depth',
        'Cross-link: Algorithms M4 for weighted shortest paths and correctness proofs',
      ],
      readings: [
        { label: 'CLRS — elementary graph representations', kind: 'textbook' },
        { label: 'Cross-link: Algorithms M4 for design depth', kind: 'notes' },
      ],
      work: [
        analysisWork(
          'ds-m7-ps',
          'Problem set: graph representations',
          'Choose representations given memory/query constraints; sketch BFS/DFS.',
          'Written. Graph visualizer shared with Algorithms when shipped.',
          'partial',
        ),
        labSoon(
          'ds-m7-lab',
          'Lab: graph structure traversal',
          'graphs',
          'Step BFS/DFS on shared graph instances focusing on representation cost.',
          'Graph engine forthcoming.',
        ),
      ],
    }),
    moduleOf({
      id: 'ds-m8',
      code: 'M8',
      title: 'Advanced structures (survey)',
      schedule: 'Week 12',
      summary: 'B-trees, tries, union-find landscape—program-dependent depth.',
      topics: ['External search trees (B-tree idea)', 'Tries', 'Disjoint sets / union-find', 'When to reach for each'],
      outcomes: ['Map advanced structures to use cases and next courses'],
      lectureBeats: [
        'B-trees: high fanout for external memory / DB indexes; multi-key nodes',
        'Tries: prefix search and string dictionaries; space vs hash trade-offs',
        'Union-find: near-O(1) amortized connectivity with path compression + union-by-rank',
        'Choose by workload: external search vs strings vs dynamic connectivity',
      ],
      readings: [
        { label: 'CLRS — B-trees / union-find surveys as available', kind: 'textbook' },
        { label: 'CMU 15-210 — parallel/advanced structure themes', kind: 'curriculum' },
      ],
      work: [
        readingWork(
          'ds-m8-reading',
          'Reading: one advanced structure',
          'Write a one-page map of one advanced structure to M1–M7 prerequisites and a real system use case.',
          'Self-directed from a standard DS text chapter.',
          'partial',
        ),
      ],
    }),
  ],
}
