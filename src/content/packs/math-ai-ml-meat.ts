import type { MeatPack } from './types'

export const discreteMeat: MeatPack[] = [
  {
    workId: 'dm-m1-ps',
    timeEstimate: '90 min',
    sources: [
      {
        label: 'MIT OCW 6.042J',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      },
    ],
    deliverables: ['Four written proofs', 'Logic translations'],
    selfCheck: ['Quantifier order correct when negating'],
    solutionSketch: {
      problemId: 'p1',
      sketch:
        'n=2k+1 ⇒ n²=4k²+4k+1=2(2k²+2k)+1 odd. Contrapositive of “n² even ⇒ n even” is “n odd ⇒ n² odd” (same calculation). √2: assume p/q reduced, 2q²=p² ⇒ p even ⇒ contradiction on reduction.',
    },
    problems: [
      {
        id: 'p1',
        title: 'P1 · Direct',
        points: 20,
        prompt: 'Prove: if n is an odd integer, then n² is odd. Write n=2k+1 and expand.',
      },
      {
        id: 'p2',
        title: 'P2 · Contrapositive',
        points: 20,
        prompt: 'Prove: if n² is even then n is even, by proving the contrapositive carefully.',
      },
      {
        id: 'p3',
        title: 'P3 · Contradiction',
        points: 20,
        prompt: 'Prove that √2 is irrational (standard contradiction on a reduced fraction p/q).',
      },
      {
        id: 'p4',
        title: 'P4 · Logic',
        points: 20,
        prompt:
          'Translate: “Every even integer greater than 2 is sum of two primes” (Goldbach). Negate formally.',
      },
      {
        id: 'p5',
        title: 'P5 · Flaw',
        points: 20,
        prompt:
          '“Proof” that all horses are the same color by induction on herd size n is flawed. Identify the broken step when going from n=1 to n=2 (or state the bad induction hypothesis application).',
      },
    ],
  },
  {
    workId: 'dm-m2-ps',
    timeEstimate: '60 min',
    deliverables: ['Induction proofs with base + IH + step'],
    selfCheck: ['IH applied to smaller instance explicitly'],
    solutionSketch: {
      problemId: 'i1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'i1',
        title: 'P1 · Sum',
        points: 35,
        prompt: 'Prove by induction: Σ_{i=1}^{n} i = n(n+1)/2.',
      },
      {
        id: 'i2',
        title: 'P2 · Strong',
        points: 35,
        prompt: 'Prove every n≥2 factors into primes (strong induction).',
      },
      {
        id: 'i3',
        title: 'P3 · Algorithm link',
        points: 30,
        prompt: 'State an inductive argument that a simple recursive algorithm (e.g. factorial or mergesort structure) is correct—outline only.',
      },
    ],
  },
  {
    workId: 'dm-m4-ps',
    timeEstimate: '70 min',
    deliverables: ['Numeric counting answers'],
    selfCheck: ['Overcount checked'],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · Choices',
        points: 25,
        prompt: 'How many 5-card poker hands from 52? How many contain all four aces?',
      },
      {
        id: 'c2',
        title: 'P2 · Pigeonhole',
        points: 25,
        prompt: 'Show that among 13 people, at least 2 share a birth month.',
      },
      {
        id: 'c3',
        title: 'P3 · Stars and bars',
        points: 25,
        prompt: 'Non-negative integer solutions to x+y+z=10?',
      },
      {
        id: 'c4',
        title: 'P4 · Binomial',
        points: 25,
        prompt: 'Prove Σ_{k=0}^{n} C(n,k) = 2ⁿ combinatorially and algebraically.',
      },
    ],
  },
  {
    workId: 'dm-m3-ps',
    timeEstimate: '75 min',
    sources: [
      { label: 'Rosen / Epp — sets & relations', kind: 'textbook' },
      {
        label: 'MIT OCW 6.042J',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      },
    ],
    deliverables: ['Set-identity proofs', 'Relation classification table', 'Counterexamples'],
    selfCheck: ['Empty-set edge cases handled', 'Equivalence requires all three properties'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · Set identity',
        points: 30,
        prompt:
          'Prove A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) by double inclusion (x∈LHS ⇒ x∈RHS and converse). Do not only draw a Venn diagram.',
      },
      {
        id: 's2',
        title: 'P2 · Functions',
        points: 35,
        prompt:
          'Let f:{1,2,3,4}→{a,b,c} with f(1)=a, f(2)=b, f(3)=a, f(4)=c. Is f injective? Surjective? Give a g with the same domain/codomain that is bijective, or prove none exists.',
      },
      {
        id: 's3',
        title: 'P3 · Relations',
        points: 35,
        prompt:
          'On S={1,2,3,4}, let R={(1,1),(2,2),(3,3),(4,4),(1,2),(2,1),(3,4),(4,3)}. Prove R is an equivalence relation; list the partition into classes. Is R a partial order? Why/why not?',
      },
    ],
  },
  {
    workId: 'dm-m5-ps',
    timeEstimate: '80 min',
    sources: [
      { label: 'Rosen — graphs chapters', kind: 'textbook' },
      {
        label: 'MIT OCW 6.042J — graphs',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      },
    ],
    deliverables: ['Proofs + one counterexample construction', 'Handshaking / tree calculations'],
    selfCheck: ['Simple undirected graph assumed unless stated', 'Euler vs Hamilton difficulty distinguished'],
    solutionSketch: {
      problemId: 'g1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'g1',
        title: 'P1 · Handshaking',
        points: 30,
        prompt:
          'Graph G has degree sequence 3,3,2,2,2. Does a simple graph with this sequence exist? If yes, draw one and verify Σdeg=2|E|; if no, prove impossibility.',
      },
      {
        id: 'g2',
        title: 'P2 · Trees',
        points: 35,
        prompt:
          'Prove: a connected simple graph on n≥1 vertices is a tree iff it has exactly n−1 edges. (Use handshaking or cycle arguments.) Then: how many edges in a forest of k trees on n vertices?',
      },
      {
        id: 'g3',
        title: 'P3 · Euler / bipartite',
        points: 35,
        prompt:
          'For the graph with vertices {A,B,C,D,E} and edges AB,BC,CD,DE,EA,AC: (i) does an Euler circuit exist? Euler trail? Justify via degrees. (ii) Is the graph bipartite? Prove or give an odd cycle.',
      },
    ],
  },
  {
    workId: 'dm-m6-ps',
    timeEstimate: '75 min',
    sources: [
      {
        label: 'MIT OCW 6.042J — recurrences',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      },
      { label: 'CLRS / Algorithms M2 cross-link — Master-style intuition', kind: 'notes' },
    ],
    deliverables: ['Closed forms', 'Recursion-tree sketch', 'Θ claim with justification'],
    selfCheck: ['Base cases plugged in', 'Unrolling shows the geometric pattern explicitly'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Unroll',
        points: 35,
        prompt:
          'Solve T(n)=T(n−1)+3 with T(1)=2 by unrolling. Give closed form and check T(5) two ways (recurrence + formula).',
      },
      {
        id: 'r2',
        title: 'P2 · Mergesort-style',
        points: 35,
        prompt:
          'Assume T(n)=2T(n/2)+n for n=2^k, T(1)=1. Draw a recursion tree for n=8 (levels, work per level). Conclude T(n)=Θ(n log n) with the sum of levels.',
      },
      {
        id: 'r3',
        title: 'P3 · Master intuition',
        points: 30,
        prompt:
          'Without full Master proof: classify T(n)=3T(n/2)+n and T(n)=2T(n/2)+n² as root-heavy / leaf-heavy / balanced (one sentence each) and state expected Θ growth qualitatively.',
      },
    ],
  },
  {
    workId: 'dm-m7-ps',
    timeEstimate: '85 min',
    sources: [
      {
        label: 'MIT OCW 6.042J — probability',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      },
      { label: 'Berkeley CS 70 — probability units (public notes)', kind: 'curriculum' },
    ],
    deliverables: ['Numeric probability answers with sample space', 'Linearity of expectation derivation'],
    selfCheck: ['Conditional probability uses definition P(A|B)=P(A∩B)/P(B)', 'Independence checked, not assumed'],
    solutionSketch: {
      problemId: 'pr1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'pr1',
        title: 'P1 · Conditional',
        points: 30,
        prompt:
          'Fair die. Let A = “even”, B = “≥4”. Compute P(A), P(B), P(A∩B), P(A|B), P(B|A). Are A and B independent?',
      },
      {
        id: 'pr2',
        title: 'P2 · Linearity',
        points: 40,
        prompt:
          'Throw 10 fair coins. Let X = number of heads. Write X=Σ I_i indicator variables; compute E[X] via linearity (no binomial PMF required). Then: hash n=100 keys into m=50 bins uniformly; expected number of empty bins?',
      },
      {
        id: 'pr3',
        title: 'P3 · Collision',
        points: 30,
        prompt:
          'Birthday-style:  m=365, n people independent uniform birthdays. Write P(all distinct) as a product. For n=23, compute the product numerically (calculator OK) and state P(at least one shared day).',
      },
    ],
  },
  {
    workId: 'dm-m7-reading',
    timeEstimate: '45 min',
    sources: [
      {
        label: 'MIT OCW 6.042J / CLRS randomized algorithms landscape',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      },
    ],
    deliverables: ['One-page summary', 'Cited textbook claim', 'Explicit random experiment'],
    selfCheck: ['Randomness use is algorithmic, not “AI magic”', 'Expectation or high-probability claim named'],
    solutionSketch: {
      problemId: 'rd1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'rd1',
        title: 'P1 · Algorithm pick',
        points: 30,
        prompt:
          'Choose one: randomized quicksort pivot, or hashing collision analysis. State the random experiment (what is drawn uniformly?).',
      },
      {
        id: 'rd2',
        title: 'P2 · Claim',
        points: 40,
        prompt:
          'Quote or paraphrase one quantitative claim (e.g. expected comparisons ≈ 2n ln n for rand-quicksort, or expected chain length). Derive or sketch why indicators/linearity apply (≤½ page).',
      },
      {
        id: 'rd3',
        title: 'P3 · Citation hygiene',
        points: 30,
        prompt:
          'Give full citation (book/OCW + chapter/section if possible). One sentence: what this reading does NOT claim (e.g. not worst-case O(n log n) for every pivot sequence).',
      },
    ],
  },
]

export const theoryMeat: MeatPack[] = [
  {
    workId: 'toc-m1-ps',
    timeEstimate: '80 min',
    sources: [{ label: 'Sipser Ch. 1', kind: 'textbook' }],
    deliverables: ['Automaton diagrams', 'Correctness brief'],
    selfCheck: ['Accept/reject on 3 test strings each'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'Even #0s: 2 states E/O, δ flip on 0, stay on 1, F={E}. Ends with 01: track last bits (S / saw0 / Acc). Product construction for intersection: Q×Q′. Always test ε, shortest accept, shortest reject.',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · DFA',
        points: 30,
        prompt: 'Build a DFA for binary strings with an even number of 0s. Prove correctness informally.',
      },
      {
        id: 't2',
        title: 'P2 · NFA',
        points: 30,
        prompt: 'NFA for strings ending in 01. Convert idea to DFA (subset construction sketch).',
      },
      {
        id: 't3',
        title: 'P3 · Closure',
        points: 40,
        prompt: 'Show regular languages closed under union using automata product or NFA-ε construction.',
      },
    ],
  },
  {
    workId: 'toc-m2-ps',
    timeEstimate: '75 min',
    deliverables: ['Pumping proofs'],
    selfCheck: ['Pumping length p used correctly'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Regex',
        points: 30,
        prompt: 'Give a regex for binary strings with no two consecutive 1s. Argue equivalence briefly.',
      },
      {
        id: 'r2',
        title: 'P2 · Non-regular',
        points: 40,
        prompt: 'Prove {0ⁿ1ⁿ | n≥0} is not regular via pumping lemma.',
      },
      {
        id: 'r3',
        title: 'P3 · Closure use',
        points: 30,
        prompt: 'Using closure properties, show {ww | w∈{0,1}*} is not regular (outline).',
      },
    ],
  },
  {
    workId: 'toc-m6-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'Sipser Ch. 7', kind: 'textbook' }],
    deliverables: ['NP membership + reduction sketch'],
    selfCheck: ['Certificate poly-size and poly-time verifiable'],
    solutionSketch: {
      problemId: 'n1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'n1',
        title: 'P1 · NP membership',
        points: 30,
        prompt: 'Show VERTEX-COVER is in NP: certificate + verifier.',
      },
      {
        id: 'n2',
        title: 'P2 · Reduction',
        points: 40,
        prompt: 'Sketch Independent-Set ≤_p Vertex-Cover (construction + correctness idea).',
      },
      {
        id: 'n3',
        title: 'P3 · Implications',
        points: 30,
        prompt: 'If P=NP, what happens to cryptography intuition and to “hard” optimization (informal but precise)?',
      },
    ],
  },
  {
    workId: 'toc-m3-ps',
    timeEstimate: '85 min',
    sources: [{ label: 'Sipser Ch. 2', kind: 'textbook', locator: 'Ch. 2' }],
    deliverables: ['CFG grammars', 'PDA sketch or parse tree', 'CFL pumping proof'],
    selfCheck: ['Start variable and productions explicit', 'Pumping length used as in Sipser'],
    solutionSketch: {
      problemId: 'cf1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'cf1',
        title: 'P1 · CFG',
        points: 30,
        prompt:
          'Write a CFG for L={a^i b^j c^k | i=j or j=k, i,j,k≥0}. Explain how the grammar enforces the “or” (union of two CFGs is fine).',
      },
      {
        id: 'cf2',
        title: 'P2 · Parse / PDA',
        points: 35,
        prompt:
          'For G: S→(S)|SS|ε (balanced parentheses, one type). Give a leftmost derivation of (())(). Sketch a PDA that accepts the same language (stack discipline in words + transition idea).',
      },
      {
        id: 'cf3',
        title: 'P3 · Non-CFL',
        points: 35,
        prompt:
          'Prove {a^n b^n c^n | n≥0} is not context-free using the CFL pumping lemma (choose w carefully; case analysis on where vxy falls).',
      },
    ],
  },
  {
    workId: 'toc-m4-ps',
    timeEstimate: '80 min',
    sources: [{ label: 'Sipser Ch. 3', kind: 'textbook', locator: 'Ch. 3' }],
    deliverables: ['High-level TM descriptions', 'Recognizer vs decider classifications'],
    selfCheck: ['Looping vs rejecting distinguished', 'Church–Turing claim scoped as thesis not theorem'],
    solutionSketch: {
      problemId: 'tm1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'tm1',
        title: 'P1 · TM design',
        points: 35,
        prompt:
          'Give a high-level TM description that decides {w#w | w∈{0,1}*}. Outline stages: check single #, zigzag compare, accept/reject. (Diagram optional.)',
      },
      {
        id: 'tm2',
        title: 'P2 · Recognizer vs decider',
        points: 35,
        prompt:
          'Define A_TM = {⟨M,w⟩ | M is a TM that accepts w}. Is A_TM Turing-recognizable? Decidable? State Sipser-level facts and sketch why a universal TM recognizes it.',
      },
      {
        id: 'tm3',
        title: 'P3 · Variants',
        points: 30,
        prompt:
          'Explain why multi-tape TMs decide the same class of languages as single-tape TMs (simulation idea, not full proof). What does the Church–Turing thesis claim about “algorithm” vs TM?',
      },
    ],
  },
  {
    workId: 'toc-m5-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'Sipser Ch. 4–5', kind: 'textbook', locator: 'Ch. 4–5' }],
    deliverables: ['Reduction diagrams', 'Undecidability proofs (sketches with correctness idea)'],
    selfCheck: ['Reduction direction: known-undecidable ≤ target', 'Mapping reduction f computable'],
    solutionSketch: {
      problemId: 'u1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'u1',
        title: 'P1 · HALT',
        points: 30,
        prompt:
          'Define HALT_TM = {⟨M,w⟩ | M halts on w}. Sketch a proof that HALT_TM is undecidable by reduction from A_TM (or cite Sipser theorem and fill the construction of the reducer).',
      },
      {
        id: 'u2',
        title: 'P2 · Reduction',
        points: 40,
        prompt:
          'Show E_TM = {⟨M⟩ | L(M)=∅} is undecidable: given ⟨M,w⟩, construct M′ that ignores its input and simulates M on w (accept iff M accepts w). Argue ⟨M,w⟩∈A_TM iff ⟨M′⟩∉E_TM (or the correct polarity you choose—state it carefully).',
      },
      {
        id: 'u3',
        title: 'P3 · Rice landscape',
        points: 30,
        prompt:
          'State Rice’s theorem in one sentence. Apply it (or explain why it applies) to show “L(M) is regular” is undecidable as a property of the language of M. What is a non-trivial semantic property here?',
      },
    ],
  },
  {
    workId: 'toc-m7-reading',
    timeEstimate: '50 min',
    sources: [{ label: 'Sipser — later chapters (PSPACE / approx / randomized landscape)', kind: 'textbook' }],
    deliverables: ['One-page class map', 'Containment diagram', 'Citation'],
    selfCheck: ['Placed relative to P and NP', 'No fake theorem names'],
    solutionSketch: {
      problemId: 'ad1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'ad1',
        title: 'P1 · Pick a topic',
        points: 25,
        prompt:
          'Choose one: PSPACE/TQBF landscape, approximation algorithms idea, or BPP/randomized classes. Define the class/problem in ≤5 sentences with a canonical complete problem or example if standard.',
      },
      {
        id: 'ad2',
        title: 'P2 · Map to M1–M6',
        points: 40,
        prompt:
          'Draw (or list) containments relating your topic to P, NP, and decidable languages where known (e.g. P⊆NP⊆PSPACE⊆EXP). Mark what is theorem vs widely believed.',
      },
      {
        id: 'ad3',
        title: 'P3 · Synthesis',
        points: 35,
        prompt:
          'One paragraph: how automata/computability (M1–M5) differ in flavor from complexity (M6+) for the same informal question “what can machines do?” Cite Sipser chapter.',
      },
    ],
  },
]

export const aiMeat: MeatPack[] = [
  {
    workId: 'ai-m1-ps',
    timeEstimate: '50 min',
    sources: [{ label: 'AIMA Ch. 1–3', kind: 'textbook' }],
    deliverables: ['PEAS tables', 'Formal search tuples'],
    selfCheck: ['Actions and transition model explicit'],
    solutionSketch: {
      problemId: 'a1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'a1',
        title: 'P1 · PEAS',
        points: 40,
        prompt: 'Write PEAS for: (i) vacuum agent on 2 squares; (ii) route-finding GPS; (iii) medical diagnosis assistant.',
      },
      {
        id: 'a2',
        title: 'P2 · Formulation',
        points: 40,
        prompt:
          'Formulate 8-puzzle as a search problem: state, initial, actions, transition, goal test, path cost.',
      },
      {
        id: 'a3',
        title: 'P3 · Properties',
        points: 20,
        prompt: 'Classify environments (fully/partially observable, deterministic/stochastic, episodic/sequential) for chess vs poker.',
      },
    ],
  },
  {
    workId: 'ai-m2-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'AIMA search chapters', kind: 'textbook' }],
    deliverables: ['Traces + admissibility proofs'],
    selfCheck: ['Expansion order matches algorithm'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · BFS vs DFS',
        points: 30,
        prompt:
          'On Ladder graph (lab): edges S-A,S-B,A-C,B-D,C-G,D-G,A-D,C-D. BFS and DFS from S to G (alpha tie-break). Expansion order and path.',
      },
      {
        id: 's2',
        title: 'P2 · A* heuristic',
        points: 35,
        prompt:
          'For grid pathfinding, is Manhattan distance admissible if moves are 4-connected? If diagonal moves allowed? Prove or counterexample.',
      },
      {
        id: 's3',
        title: 'P3 · Consistency',
        points: 35,
        prompt: 'Define consistent heuristic. Show admissible + consistent ⇒ A* optimal with graph-search (sketch).',
      },
    ],
  },
  {
    workId: 'ai-m5-ps',
    timeEstimate: '70 min',
    deliverables: ['Game tree values'],
    selfCheck: ['Max/min levels alternate'],
    solutionSketch: {
      problemId: 'g1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'g1',
        title: 'P1 · Minimax',
        points: 40,
        prompt:
          'Leaves of a depth-2 max tree: left branch leaves 3,12,8; right 2,4,6 (binary). Compute minimax root and best first move.',
      },
      {
        id: 'g2',
        title: 'P2 · Alpha-beta',
        points: 40,
        prompt: 'On the same tree, show alpha-beta pruning order left-to-right; which nodes are skipped?',
      },
      {
        id: 'g3',
        title: 'P3 · Eval',
        points: 20,
        prompt: 'Design a 3-feature evaluation function for tic-tac-toe midgame; discuss overfit risk.',
      },
    ],
  },
  {
    workId: 'ai-m3-ps',
    timeEstimate: '70 min',
    sources: [{ label: 'AIMA — local search', kind: 'textbook' }],
    deliverables: ['Landscape analysis', 'Restart/annealing design', 'Scenario choice table'],
    selfCheck: ['Local optimum ≠ global named', 'Temperature / restart role explicit'],
    solutionSketch: {
      problemId: 'ls1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'ls1',
        title: 'P1 · 8-queens landscape',
        points: 35,
        prompt:
          'State space: permutations of 8 queens (one per column). Neighbor = swap two columns’ rows. Heuristic h = number of attacking pairs. Start from a board with h=3. Describe one hill-climbing step that decreases h (or argue all neighbors have h≥3). Why can HC get stuck with h>0?',
      },
      {
        id: 'ls2',
        title: 'P2 · SA schedule',
        points: 35,
        prompt:
          'Simulated annealing accepts a worse move of ΔE=+2 with probability e^{−ΔE/T}. Compute acceptance probs at T=4 and T=0.5. Design a geometric cooling schedule T_{k+1}=0.9 T_k with T_0=10; give T after 5 cools. When is SA ≈ random walk vs ≈ pure HC?',
      },
      {
        id: 'ls3',
        title: 'P3 · Choose method',
        points: 30,
        prompt:
          'For (i) route on a known city graph with non-negative weights, (ii) VLSI layout with many local optima: pick systematic search (A*/UCS) vs local search. Justify in ≤6 sentences each using completeness/optimality vs scalability.',
      },
    ],
  },
  {
    workId: 'ai-m4-ps',
    timeEstimate: '85 min',
    sources: [
      { label: 'AIMA — CSP chapter', kind: 'textbook' },
      { label: 'Berkeley CS 188 — CSP unit', kind: 'curriculum' },
    ],
    deliverables: ['CSP formalization', 'Backtracking + FC trace', 'Heuristic choices'],
    selfCheck: ['Variables, domains, constraints listed', 'FC removes values from future vars only'],
    solutionSketch: {
      problemId: 'csp1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'csp1',
        title: 'P1 · Map coloring',
        points: 30,
        prompt:
          'Australia-style: variables WA,NT,SA,Q,NSW,V,T; domains {R,G,B}; adjacent regions ≠ color. List binary constraints as pairs. Is the CSP binary? Assign WA=R; after forward checking, which values remain for NT and SA?',
      },
      {
        id: 'csp2',
        title: 'P2 · Trace',
        points: 40,
        prompt:
          'Variables X,Y,Z domains {1,2,3}; constraints X≠Y, Y≠Z, X<Z. Trace backtracking with MRV, order values LCV-style if ties break alphabetically/numerically low-first. Show the search tree until first solution or prove none (there is a solution—find it).',
      },
      {
        id: 'csp3',
        title: 'P3 · AC-3 idea',
        points: 30,
        prompt:
          'Arc (X_i,X_j) is consistent if every x∈D_i has some y∈D_j with constraint satisfied. Domains D_X={1,2,3}, D_Y={1,2}, constraint X>Y. Revise X for arc (X,Y): what is D_X after? One sentence: how AC-3 uses a queue of arcs.',
      },
    ],
  },
  {
    workId: 'ai-m4-lab',
    timeEstimate: '40 min',
    sources: [
      { label: 'AIMA — CSP / AC-3', kind: 'textbook' },
      { label: 'Berkeley CS 188 — CSP', kind: 'curriculum' },
    ],
    deliverables: ['Domain wipeout table', 'Propagation order notes'],
    selfCheck: ['Map-coloring scale instance only', 'Instrument is planned — paper simulation acceptable'],
    solutionSketch: {
      problemId: 'cl1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'cl1',
        title: 'P1 · Instance',
        points: 30,
        prompt:
          'Four regions A–B–C–D in a cycle (A adj B,B adj C,C adj D,D adj A) plus diagonal A–C. Domains {R,G,B}. Fix A=R. List domains of B,C,D after enforcing arc consistency with A (and then among others if needed).',
      },
      {
        id: 'cl2',
        title: 'P2 · Wipeout',
        points: 40,
        prompt:
          'Continue: assign B=G. Show step-by-step domain reductions. Does any domain empty (failure)? If not, give one complete coloring consistent with A=R,B=G.',
      },
      {
        id: 'cl3',
        title: 'P3 · Instrument note',
        points: 30,
        prompt:
          'When a CSP visualizer ships: what three quantities would you record per propagation step (e.g. arc processed, value deleted, domain size)? Why is watching wipeouts better than only final SAT/UNSAT?',
      },
    ],
  },
  {
    workId: 'ai-m6-ps',
    timeEstimate: '80 min',
    sources: [
      { label: 'AIMA — logical agents', kind: 'textbook' },
      {
        label: 'MIT OCW 6.034 — representation',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/',
      },
    ],
    deliverables: ['KB encodings', 'Resolution / chaining traces'],
    selfCheck: ['CNF conversion correct', 'Unification only where FOL used'],
    solutionSketch: {
      problemId: 'lg1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'lg1',
        title: 'P1 · Propositional KB',
        points: 30,
        prompt:
          'Wumpus-scale: encode “If breeze in (1,1) then pit in (1,2) or (2,1)” and “no breeze in (1,1)” in propositional logic. Convert the implication to CNF. Does the KB entail ¬Pit_{1,2}? Show resolution or model checking on the relevant atoms.',
      },
      {
        id: 'lg2',
        title: 'P2 · Resolution',
        points: 40,
        prompt:
          'KB: (P∨Q), (¬P∨R), (¬Q∨R). Prove R by resolution (show clause sequence). Then: add (¬R). Is the KB unsatisfiable? One step.',
      },
      {
        id: 'lg3',
        title: 'P3 · FOL sketch',
        points: 30,
        prompt:
          'Translate: “Every student has some advisor” and “Alex is a student” into FOL. Unify Student(x) with Student(Alex); what substitution? Why does ∃y Advisor(y,x) not ground to a name without more axioms?',
      },
    ],
  },
  {
    workId: 'ai-m7-ps',
    timeEstimate: '85 min',
    sources: [
      { label: 'AIMA — probabilistic reasoning', kind: 'textbook' },
      { label: 'Berkeley CS 188 — Bayes nets', kind: 'curriculum' },
    ],
    deliverables: ['Numeric query answers', 'Factorization + independence claims'],
    selfCheck: ['Normalized posteriors sum to 1', 'Graph d-separation stated carefully'],
    solutionSketch: {
      problemId: 'bn1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'bn1',
        title: 'P1 · Tiny net',
        points: 35,
        prompt:
          'Bayes net: Burglary → Alarm ← Earthquake; Alarm → JohnCalls. Given P(B)=0.001, P(E)=0.002, P(A|B,E)=0.95, P(A|B,¬E)=0.94, P(A|¬B,E)=0.29, P(A|¬B,¬E)=0.001, P(J|A)=0.9, P(J|¬A)=0.05. Compute P(J) by enumerating the relevant joint (show the sum). Approximate numeric OK to 4 decimals.',
      },
      {
        id: 'bn2',
        title: 'P2 · Independence',
        points: 30,
        prompt:
          'In the same graph: is JohnCalls independent of Burglary given Alarm? Is Burglary independent of Earthquake? Justify with d-separation / common-effect intuition (no full algorithm required).',
      },
      {
        id: 'bn3',
        title: 'P3 · Enumeration query',
        points: 35,
        prompt:
          'Binary vars Rain → WetGrass ← Sprinkler; P(R)=0.2, P(S)=0.1, P(W|R,S)=0.99, P(W|R,¬S)=0.9, P(W|¬R,S)=0.9, P(W|¬R,¬S)=0.0. Compute P(R|W=true) by enumeration (Bayes + normalize). Show unnormalized masses for R and ¬R.',
      },
    ],
  },
  {
    workId: 'ai-m8-reading',
    timeEstimate: '50 min',
    sources: [
      { label: 'AIMA — MDPs/RL intro', kind: 'textbook' },
      { label: 'CS Visual Lab — Machine Learning course overview', kind: 'notes' },
    ],
    deliverables: ['One-page bridge essay', 'MDP tuple', 'Contrast table AI vs ML'],
    selfCheck: ['Does not equate RL with supervised learning', 'Scoped claims only'],
    solutionSketch: {
      problemId: 'br1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'br1',
        title: 'P1 · MDP',
        points: 30,
        prompt:
          'Define a 3-state grid MDP (S, A, T, R, γ) for a robot that moves N/E and slips 10% sideways. Specify one transition probability fully for a chosen (s,a).',
      },
      {
        id: 'br2',
        title: 'P2 · Contrast',
        points: 40,
        prompt:
          'Table (or bullets): for search (M2), CSP (M4), Bayes nets (M7), and supervised classification (ML course)—what is the “input,” what is optimized/computed, and whether labels from a dataset are required.',
      },
      {
        id: 'br3',
        title: 'P3 · Value iteration idea',
        points: 30,
        prompt:
          'Write the Bellman optimality update for V(s). One iteration on a 2-state toy: S={Good,Bad}, actions stay/switch with your invented numbers—compute V_1 from V_0=0. Cite AIMA chapter.',
      },
    ],
  },
]

export const mlMeat: MeatPack[] = [
  {
    workId: 'ml-m1-ps',
    timeEstimate: '55 min',
    sources: [{ label: 'ISL intro / CS229', kind: 'curriculum', url: 'https://cs229.stanford.edu/' }],
    deliverables: ['Learning-curve sketches', 'Problem formulation'],
    selfCheck: ['Train/test distinction explicit'],
    solutionSketch: {
      problemId: 'm2',
      sketch:
        'Low capacity: high train+test error (underfit). Mid: min test error. High: train→0, test rises (overfit). Pick min test (or CV) capacity, not min train.',
    },
    problems: [
      {
        id: 'm1',
        title: 'P1 · Formulate',
        points: 30,
        prompt:
          'Spam classification: define X features (list 5), Y∈{0,1}, hypothesis class, and 0-1 or logistic loss. What is a train/test split risk if you tune on test?',
      },
      {
        id: 'm2',
        title: 'P2 · Curves',
        points: 40,
        prompt:
          'Sketch train and test error vs model capacity for underfit → sweet spot → overfit. Mark where you pick a model (min test / CV).',
      },
      {
        id: 'm3',
        title: 'P3 · Bias',
        points: 30,
        prompt:
          'Explain inductive bias of linear models (linear decision surface in R^d) vs decision trees (axis-aligned partitions) in ≤8 sentences.',
      },
    ],
  },
  {
    workId: 'ml-m2-ps',
    timeEstimate: '80 min',
    deliverables: ['Hand calculations'],
    selfCheck: ['Derivative signs correct for GD'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Gradient step',
        points: 40,
        prompt:
          'Data (x,y): (1,2),(2,3),(3,5). Model y=mx+b. Start m=0,b=0, η=0.1, squared loss (1/2n)Σ. Compute one full GD step for (m,b).',
      },
      {
        id: 'r2',
        title: 'P2 · Closed form',
        points: 30,
        prompt: 'For simple linear regression through origin y=mx, write the optimal m in terms of x_i,y_i.',
      },
      {
        id: 'r3',
        title: 'P3 · Lab',
        points: 30,
        prompt:
          'In linreg-1d lab, record m,b at epochs 0,4,8,12. Does loss proxy decrease monotonically? Relate to η choice.',
      },
    ],
  },
  {
    workId: 'ml-m3-ps',
    timeEstimate: '70 min',
    deliverables: ['Boundary geometry + metric choice'],
    selfCheck: ['Positive class defined'],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · Boundary',
        points: 30,
        prompt: 'Linear classifier sign(w·x+b). For w=(1,−1), b=0, sketch boundary in 2D and positive half-space.',
      },
      {
        id: 'c2',
        title: 'P2 · Metrics',
        points: 35,
        prompt:
          'Cancer screening rare positive class: prefer high recall or high precision? Trade-off in ≤6 sentences.',
      },
      {
        id: 'c3',
        title: 'P3 · Lab',
        points: 35,
        prompt: 'Perceptron lab: is the toy set linearly separable? Final boundary: estimate equation from the plot.',
      },
    ],
  },
  {
    workId: 'ml-m5-ps',
    timeEstimate: '60 min',
    deliverables: ['Experimental design critique'],
    selfCheck: ['Leakage named specifically'],
    solutionSketch: {
      problemId: 'e1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'e1',
        title: 'P1 · CV',
        points: 30,
        prompt: 'Explain k-fold CV. Why not tune hyperparameters on the test set?',
      },
      {
        id: 'e2',
        title: 'P2 · Leakage',
        points: 40,
        prompt:
          'Flawed plan: normalize features using mean/variance of entire dataset including test, then split. What leaks? Fix.',
      },
      {
        id: 'e3',
        title: 'P3 · Imbalance',
        points: 30,
        prompt: 'Accuracy 99% on 1% fraud base rate may be useless. Propose two better metrics and why.',
      },
    ],
  },
  {
    workId: 'ml-m4-ps',
    timeEstimate: '75 min',
    sources: [
      { label: 'ISL/ESL — bias-variance & regularization', kind: 'textbook' },
      { label: 'Stanford CS229 notes', kind: 'curriculum', url: 'https://cs229.stanford.edu/' },
    ],
    deliverables: ['Curve interpretations', 'Regularization design choices'],
    selfCheck: ['Bias vs variance not confused with train vs test', 'λ direction correct (larger ⇒ simpler)'],
    solutionSketch: {
      problemId: 'bv1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'bv1',
        title: 'P1 · Curves',
        points: 35,
        prompt:
          'Polynomial regression degree d∈{1,3,15} on a noisy 1D sine. Sketch typical train MSE and test MSE vs d. Mark underfit and overfit regions. Where do you pick d with a validation set?',
      },
      {
        id: 'bv2',
        title: 'P2 · Ridge',
        points: 35,
        prompt:
          'Loss = (1/2n)Σ(y−w·x)² + (λ/2)||w||₂². Write ∂L/∂w_j. If λ→∞, what happens to ||w||? For features on different scales (height in mm vs age in years), why standardize before L2?',
      },
      {
        id: 'bv3',
        title: 'P3 · Feature map',
        points: 30,
        prompt:
          'Binary labels not linearly separable in x∈R, but separable after φ(x)=(x,x²). Give 4 points (x,y) that illustrate this (or argue with a sketch). One sentence: kernel methods compute φ(x)·φ(z) without building φ explicitly—what must hold for k(x,z)?',
      },
    ],
  },
  {
    workId: 'ml-m6-ps',
    timeEstimate: '80 min',
    sources: [{ label: 'ISL — tree-based methods', kind: 'textbook' }],
    deliverables: ['Hand-built tree', 'k-NN region sketch', 'Ensemble intuition paragraph'],
    selfCheck: ['Splits use training labels only', 'k-NN distance metric stated'],
    solutionSketch: {
      problemId: 'tr1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'tr1',
        title: 'P1 · Decision tree',
        points: 40,
        prompt:
          'Binary classification points: (x1,x2,y): (0,0,−),(0,1,+),(1,0,+),(1,1,+),(2,0,−),(2,1,−). Build a depth-≤2 tree with axis-aligned splits (threshold on x1 or x2). Show impurity or misclassification count before/after each split. Give the final leaf predictions.',
      },
      {
        id: 'tr2',
        title: 'P2 · k-NN',
        points: 30,
        prompt:
          'Train points: A(0,0)+, B(0,1)+, C(1,0)−, D(1,1)−. Query q=(0.6,0.6). For k=1 and k=3 with Euclidean distance, what label? Draw the 1-NN Voronoi idea qualitatively for these 4 points.',
      },
      {
        id: 'tr3',
        title: 'P3 · Forests',
        points: 30,
        prompt:
          'Explain bagging: how bootstrap samples + averaging/voting reduce variance. Why does a random forest also subsample features at splits? One risk of a single deep tree on n=20 with p=50 features?',
      },
    ],
  },
  {
    workId: 'ml-m7-ps',
    timeEstimate: '90 min',
    sources: [
      { label: 'CS229 / deep learning primers (public notes)', kind: 'curriculum', url: 'https://cs229.stanford.edu/' },
    ],
    deliverables: ['Numeric forward/backward tables', 'Honest compute note'],
    selfCheck: ['Chain rule factors match graph', 'Activations applied elementwise'],
    solutionSketch: {
      problemId: 'nn1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'nn1',
        title: 'P1 · Forward',
        points: 35,
        prompt:
          '2-layer net: z1=W1 x+b1, h=ReLU(z1), z2=W2 h+b2, ŷ=z2 (regression). Let x=[1,0]ᵀ, W1=[[1,−1],[0.5,2]], b1=[0,0]ᵀ, W2=[1,−1], b2=0. Compute z1, h, ŷ numerically.',
      },
      {
        id: 'nn2',
        title: 'P2 · Backward',
        points: 40,
        prompt:
          'Loss L=(1/2)(ŷ−y)² with y=1 on the network above. Compute ∂L/∂ŷ, then ∂L/∂W2 (row vector), and ∂L/∂h. For ReLU, give ∂L/∂z1 (use indicator h_i>0). One GD step on W2 with η=0.1: W2 ← W2−η ∂L/∂W2.',
      },
      {
        id: 'nn3',
        title: 'P3 · Capacity honesty',
        points: 25,
        prompt:
          'A modern CNN may have >10⁷ parameters. List two reasons this course’s hand calc does not transfer to “train ImageNet in the browser,” and one regularization idea (dropout/early stop/data aug) in one sentence each.',
      },
    ],
  },
  {
    workId: 'ml-m8-reading',
    timeEstimate: '55 min',
    sources: [
      { label: 'ISL — unsupervised chapters', kind: 'textbook' },
      { label: 'Public ML system tech report / blog (student-chosen, citable)', kind: 'notes' },
    ],
    deliverables: ['System critique essay', 'Metric + failure modes list', 'Ethics paragraph'],
    selfCheck: ['Public source cited', 'No proprietary dataset required'],
    solutionSketch: {
      problemId: 'cr1',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },

    problems: [
      {
        id: 'cr1',
        title: 'P1 · System card',
        points: 30,
        prompt:
          'Pick a public write-up (model card, tech report, or reputable blog) of an ML system. State task, data source (as described), and primary metric in ≤8 sentences. Full URL/citation required.',
      },
      {
        id: 'cr2',
        title: 'P2 · Failure modes',
        points: 40,
        prompt:
          'Identify two realistic failure modes (distribution shift, label noise, spurious correlation, thresholding on class imbalance 1:99, etc.). For each: how would accuracy look “fine” while users suffer? Propose one evaluation addition (e.g. per-class F1).',
      },
      {
        id: 'cr3',
        title: 'P3 · Ethics',
        points: 30,
        prompt:
          'One paragraph on dataset bias or dual-use risk relevant to this system. Distinguish measured disparity (if any numbers exist) from speculation. Link back to train/test hygiene from M5.',
      },
    ],
  },
]
