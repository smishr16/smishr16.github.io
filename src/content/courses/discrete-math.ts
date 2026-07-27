import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisHandout } from '../handouts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const discreteMathMeta: CourseMeta = {
  id: 'discrete-math',
  title: 'Discrete Mathematics',
  status: 'partial',
  track: 'Core · required',
  level: 'undergraduate',
  moduleCount: 7,
  liveLabCount: 0,
  academicNote: 'Math foundations for CS · often early major',
  blurb:
    'Logic, proofs, sets, combinatorics, graphs, and recurrence relations that underwrite algorithm analysis and theory.',
  cs2023Areas: ['MSF'],
}

export const discreteMathCourse: CourseDetail = {
  ...discreteMathMeta,
  peerAnchors: [
    {
      school: 'UC Berkeley',
      courseCode: 'CS 70',
      title: 'Discrete Mathematics and Probability Theory',
      note: 'Proofs + probability for CS',
    },
    {
      school: 'MIT',
      courseCode: '6.042J',
      title: 'Mathematics for Computer Science',
      url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
      note: 'Classic MCS OCW',
    },
    {
      school: 'CMU',
      courseCode: '15-151 / 21-127',
      title: 'Mathematical Foundations / Concepts of Math',
      note: 'Proof-oriented foundations vary by path',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['MSF'],
  overview: `**Discrete Mathematics** builds the language of CS: logic, proof techniques, sets, counting, graphs, and recurrences. Probability appears where CS programs integrate it (Berkeley CS70-style); full measure-theoretic probability is out of scope.

This course is **written-work first**. Visualizers are secondary; mastery is on paper.`,
  prerequisites: [
    'Precalculus / algebra fluency',
    'Intro programming helpful but not required for pure math modules',
  ],
  learningGoals: [
    'Write direct, contrapositive, contradiction, and induction proofs',
    'Use set notation and relations correctly',
    'Solve standard counting problems and recognize when models apply',
    'Work with graphs as mathematical objects (before algorithms depth)',
    'Set up and solve basic recurrences used in algorithm analysis',
  ],
  modules: [
    moduleOf({
      id: 'dm-m1',
      code: 'M1',
      title: 'Logic & proofs',
      schedule: 'Weeks 1–2',
      summary: 'Propositional logic, quantifiers, and core proof patterns.',
      topics: ['Propositions & connectives', 'Truth tables', 'Quantifiers', 'Direct/contrapositive/contradiction', 'Proof hygiene'],
      outcomes: [
        'Translate English claims into logic',
        'Produce short correct proofs in multiple styles',
      ],
      lectureBeats: [
        'Propositions, connectives, and truth tables as a calculation tool',
        'Quantifiers ∀/∃ and the cost of swapping order',
        'Direct proof vs contrapositive vs contradiction — same claim, different shapes',
        'Proof hygiene: assumptions, what is fixed, what is arbitrary',
        'Common fallacy: affirming the consequent; flawed induction previews',
      ],
      readings: [
        {
          label: 'MIT OCW 6.042J — proofs unit',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
        },
        { label: 'Rosen Discrete Mathematics — logic chapters', kind: 'textbook' },
      ],
      work: [
        {
          ...analysisWork(
            'dm-m1-ps',
            'Problem set: proofs',
            'Complete a short portfolio of proof styles on discrete claims.',
            'On paper. Original problem set inspired by standard MCS topics (MIT 6.042 / Rosen style — not copied).',
            'live',
            [
              {
                label: 'MIT OCW 6.042J — proofs',
                kind: 'ocw',
                url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
              },
            ],
          ),
          handout: analysisHandout(
            [
              'Prove one claim by direct proof, one by contrapositive, one by contradiction.',
              'Translate two English statements into quantified logic; negate carefully.',
              'Find the bug in a provided false “proof” (write your own flawed proof then fix it).',
            ],
            { timeEstimate: '60–90 min' },
          ),
        },
      ],
    }),
    moduleOf({
      id: 'dm-m2',
      code: 'M2',
      title: 'Induction & strong induction',
      schedule: 'Week 3',
      summary: 'Mathematical induction for algorithms and discrete structures.',
      topics: ['Ordinary induction', 'Strong induction', 'Structural induction intro', 'Common pitfalls'],
      outcomes: [
        'Write induction proofs with clear base/inductive step',
        'Choose strong vs ordinary induction appropriately',
      ],
      lectureBeats: [
        'Ordinary induction: base + inductive step; template before creativity',
        'Strong induction when the step needs more than n−1',
        'Structural induction preview on lists/trees',
        'Pitfall: empty base or gap at n=1→2 (all-horses-same-color style)',
        'Bridge: induction for algorithm correctness sketches',
      ],
      readings: [
        {
          label: 'MIT OCW 6.042J — induction',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
        },
      ],
      work: [
        analysisWork(
          'dm-m2-ps',
          'Problem set: induction',
          'Prove correctness-style and counting-style claims by induction.',
          'Written. Bridges to Algorithms recurrence proofs.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'dm-m3',
      code: 'M3',
      title: 'Sets, functions & relations',
      schedule: 'Weeks 4–5',
      summary: 'Sets, functions, relations, and equivalence.',
      topics: ['Set operations', 'Functions (injective/surjective)', 'Relations', 'Equivalence relations', 'Partial orders intro'],
      outcomes: [
        'Prove set identities',
        'Classify relations and functions with counterexamples',
      ],
      lectureBeats: [
        'Set operations and double-inclusion proofs (not only Venn pictures)',
        'Injective / surjective / bijective with small finite examples',
        'Relations as sets of pairs; reflexive/symmetric/transitive checklist',
        'Equivalence relations ↔ partitions',
        'Partial orders intro: reflexivity, antisymmetry, transitivity',
      ],
      readings: [{ label: 'Rosen / Epp — sets & relations', kind: 'textbook' }],
      work: [
        analysisWork(
          'dm-m3-ps',
          'Problem set: sets & relations',
          'Prove identities and classify relations on small sets.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'dm-m4',
      code: 'M4',
      title: 'Counting & combinatorics',
      schedule: 'Weeks 6–7',
      summary: 'Sum/product rules, binomial coefficients, and pigeonhole.',
      topics: ['Sum/product rules', 'Permutations/combinations', 'Binomial theorem', 'Pigeonhole', 'Stars and bars intro'],
      outcomes: [
        'Select the right counting model for a story problem',
        'Apply pigeonhole with a clear proof structure',
      ],
      lectureBeats: [
        'Sum and product rules; when order matters (permutations vs combinations)',
        'Binomial coefficients and the binomial theorem',
        'Pigeonhole: statement + one clean proof pattern',
        'Stars and bars for non-negative integer solutions',
        'Overcounting audit: divide by symmetry only when justified',
      ],
      readings: [
        {
          label: 'MIT OCW 6.042J — counting',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
        },
      ],
      work: [
        analysisWork(
          'dm-m4-ps',
          'Problem set: counting',
          'Solve a mixed set of counting and pigeonhole problems.',
          'Written midterm-style set.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'dm-m5',
      code: 'M5',
      title: 'Graphs (mathematical)',
      schedule: 'Weeks 8–9',
      summary: 'Graphs as math objects: paths, trees, bipartite, Euler/Hamilton landscape.',
      topics: ['Graph definitions', 'Degree, paths, cycles', 'Trees', 'Bipartite graphs', 'Euler/Hamilton ideas'],
      outcomes: [
        'Prove basic graph facts (handshaking, tree properties)',
        'Distinguish existence claims (Euler vs Hamilton difficulty)',
      ],
      lectureBeats: [
        'Graphs as math objects: vertices, edges, degrees, handshaking lemma',
        'Paths, cycles, connectivity; trees as acyclic connected graphs',
        'Bipartite graphs and odd-cycle characterization (idea)',
        'Euler circuits vs Hamiltonian cycles — existence difficulty gap',
        'Pointer: algorithm design for graphs lives in Algorithms / DS',
      ],
      readings: [
        { label: 'Rosen — graphs chapters', kind: 'textbook' },
        { label: 'Cross-link: Algorithms M4 / Data Structures M7', kind: 'notes' },
      ],
      work: [
        analysisWork(
          'dm-m5-ps',
          'Problem set: graph theory',
          'Prove short graph claims; construct counterexamples to false statements.',
          'Written math; algorithm design deferred to Algorithms.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'dm-m6',
      code: 'M6',
      title: 'Recurrences & asymptotics bridge',
      schedule: 'Week 10',
      summary: 'Recurrences that feed algorithm analysis; sums and growth.',
      topics: ['Linear recurrences intro', 'Recursion trees', 'Sums', 'Growth rates for CS'],
      outcomes: [
        'Solve simple recurrences by unrolling or Master-style intuition',
        'Connect discrete math language to Algorithms M1–M2',
      ],
      lectureBeats: [
        'Linear recurrences by unrolling; check base cases',
        'Recursion trees: work per level and geometric sums',
        'Mergesort-style T(n)=2T(n/2)+n → Θ(n log n) intuition',
        'Master-method cases at survey depth (root/leaf/balanced)',
        'Growth rates vocabulary that Algorithms M1–M2 reuse',
      ],
      readings: [
        {
          label: 'MIT OCW 6.042J — recurrences',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
        },
        { label: 'Cross-link: Algorithms M2', kind: 'notes' },
      ],
      work: [
        analysisWork(
          'dm-m6-ps',
          'Problem set: recurrences',
          'Solve recurrences that reappear in mergesort-style analysis.',
          'Written bridge to Algorithms.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'dm-m7',
      code: 'M7',
      title: 'Probability for CS (intro)',
      schedule: 'Weeks 11–12',
      summary: 'Discrete probability used in randomized algorithms and hashing intuition.',
      topics: ['Sample spaces', 'Conditional probability', 'Independence', 'Expectation linearity', 'Hashing collision intuition'],
      outcomes: [
        'Compute simple discrete probabilities and expectations',
        'Apply linearity of expectation on counting indicators',
      ],
      lectureBeats: [
        'Sample spaces and events; uniform vs non-uniform',
        'Conditional probability and independence (definition, not slogans)',
        'Linearity of expectation — works without independence',
        'Indicators for counting; hashing collision intuition',
        'Birthday paradox product; randomized algorithms teaser',
      ],
      readings: [
        { label: 'Berkeley CS 70 — probability units (public notes vary)', kind: 'curriculum' },
        {
          label: 'MIT OCW 6.042J — probability chapters',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/',
        },
      ],
      work: [
        analysisWork(
          'dm-m7-ps',
          'Problem set: discrete probability',
          'Solve conditional probability and expectation problems with CS flavor (hashing, randomized picks).',
          'Written. Not a full probability course.',
          'partial',
        ),
        readingWork(
          'dm-m7-reading',
          'Reading: probability in algorithms',
          'Summarize one use of randomness in algorithms (e.g. randomized quicksort intuition) citing a textbook.',
          'One page + citations.',
          'partial',
        ),
      ],
    }),
  ],
}
