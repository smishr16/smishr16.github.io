import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const artificialIntelligenceMeta: CourseMeta = {
  id: 'artificial-intelligence',
  title: 'Artificial Intelligence',
  status: 'partial',
  track: 'Core / strong elective',
  level: 'undergraduate+graduate',
  moduleCount: 8,
  liveLabCount: 2,
  academicNote: 'Search, knowledge, agents — distinct from Machine Learning',
  blurb:
    'Search, CSPs, adversarial games, logical agents, and probabilistic reasoning — classical AI foundations (not “just LLMs”).',
  cs2023Areas: ['AI'],
}

export const artificialIntelligenceCourse: CourseDetail = {
  ...artificialIntelligenceMeta,
  peerAnchors: [
    {
      school: 'MIT',
      courseCode: '6.034',
      title: 'Artificial Intelligence',
      url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/',
      note: 'Classic MIT AI; search, learning intro, representation',
    },
    {
      school: 'UC Berkeley',
      courseCode: 'CS 188',
      title: 'Introduction to Artificial Intelligence',
      note: 'Search, CSPs, MDPs, Bayes nets, RL intro',
    },
    {
      school: 'Stanford',
      courseCode: 'CS221',
      title: 'Artificial Intelligence: Principles and Techniques',
      note: 'Modern principles course',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['AI'],
  overview: `**Artificial Intelligence** (this course) is the classical principles track: agents, search, constraints, games, logic, and probabilistic reasoning. **Machine Learning** is a separate course focused on statistical learning systems.

Interactive instruments (search visualizer, CSP propagation) are planned; written problem sets define the academic core now. Expectations: rigorous algorithms + modeling, not chatbot demos.`,
  prerequisites: [
    'Data Structures & Algorithms maturity',
    'Discrete Math (logic, graphs, probability intro)',
    'Python comfort for future labs',
  ],
  learningGoals: [
    'Formulate problems as search and analyze uninformed/informed algorithms',
    'Model and solve CSPs with consistency techniques',
    'Apply minimax/expectimax-style reasoning in games',
    'Use propositional/FOL ideas for knowledge representation at course depth',
    'Perform basic Bayesian network queries on small models',
  ],
  modules: [
    moduleOf({
      id: 'ai-m1',
      code: 'M1',
      title: 'Intelligent agents & problem formulation',
      schedule: 'Week 1',
      summary: 'PEAS, environments, and formulating problems for solvers.',
      topics: ['Agent types', 'PEAS', 'Environment properties', 'Problem formulation', 'Performance measures'],
      outcomes: [
        'Write PEAS descriptions for agent scenarios',
        'Convert a story problem into a formal search problem',
      ],
      lectureBeats: [
        'Agents, PEAS, and performance measures',
        'Environment properties: observability, determinism, episodic, static',
        'Problem formulation: state, actions, transition, goal, path cost',
        'Vacuum and 8-puzzle as canonical examples',
        'AI course vs ML course: search/knowledge vs statistical learning',
      ],
      readings: [
        { label: 'Russell & Norvig AIMA — Ch. 1–3 (selected)', kind: 'textbook' },
        {
          label: 'MIT OCW 6.034 — intro materials',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/',
        },
      ],
      work: [
        analysisWork(
          'ai-m1-ps',
          'Problem set: formulation',
          'Formulate 2–3 domains as search/CSP candidates with state/action definitions.',
          'Written modeling set.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'ai-m2',
      code: 'M2',
      title: 'Uninformed & informed search',
      schedule: 'Weeks 2–3',
      summary: 'BFS/DFS/IDS, UCS, greedy, A*, and heuristics.',
      topics: ['Tree/graph search', 'BFS/DFS/IDS', 'UCS', 'Greedy best-first', 'A*', 'Admissibility & consistency'],
      outcomes: [
        'Trace search algorithms on small graphs',
        'Prove or disprove admissibility of simple heuristics',
      ],
      lectureBeats: [
        'Tree search vs graph search; frontier and explored set',
        'BFS, DFS, IDS: completeness, optimality, space',
        'UCS and greedy best-first; when costs matter',
        'A*: f=g+h; admissibility and consistency',
        'Labs: Ladder BFS/DFS order; City A* vs Dijkstra expansions',
      ],
      readings: [
        { label: 'AIMA — search chapters', kind: 'textbook' },
        { label: 'Berkeley CS 188 — search projects (public concepts)', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ai-m2-ps',
          'Problem set: search',
          'Hand-simulate BFS/UCS/A* on a tiny graph; prove or disprove admissibility of two heuristics.',
          'Written. Inspired by CS188/AIMA search units — original problems only (no Pacman project dumps).',
          'live',
          [
            { label: 'AIMA — search chapters', kind: 'textbook' },
            {
              label: 'MIT OCW 6.034',
              kind: 'ocw',
              url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/',
            },
          ],
        ),
        {
          id: 'ai-m2-lab-bfs',
          title: 'Lab: uninformed search order',
          kind: 'lab',
          status: 'live',
          labId: 'graphs',
          objective: 'Compare BFS vs DFS expansion on the Ladder graph for S→G.',
          brief:
            'Identical start/goal. Record expansion sequences and paths. Explain completeness/optimality differences in ≤6 sentences.',
          config: {
            graphAlgo: 'bfs',
            graphId: 'grid-ish',
            start: 'S',
            goal: 'G',
          },
          sources: [{ label: 'AIMA — uninformed search', kind: 'textbook' }],
        },
        {
          id: 'ai-m2-lab-astar',
          title: 'Lab: A* vs Dijkstra',
          kind: 'lab',
          status: 'live',
          labId: 'graphs',
          objective: 'Compare A* and Dijkstra expansions on the same weighted graph.',
          brief:
            'Run both on City A→F. Note which nodes each expands. Discuss the Euclidean layout heuristic as a teaching toy.',
          config: {
            graphAlgo: 'astar',
            graphId: 'city-6',
            start: 'A',
            goal: 'F',
          },
          sources: [
            { label: 'AIMA — informed search', kind: 'textbook' },
            { label: 'Berkeley CS 188 — search (concepts)', kind: 'curriculum' },
          ],
        },
        {
          id: 'ai-m2-lab-campus',
          title: 'Lab: campus graph search',
          kind: 'lab',
          status: 'live',
          labId: 'graphs',
          objective: 'BFS from Gate→Lab on the Campus graph; compare hop path to Dijkstra cost path.',
          brief: 'graphId campus, start Gate, goal Lab. Run BFS then Dijkstra; contrast hops vs weights.',
          config: {
            graphAlgo: 'bfs',
            graphId: 'campus',
            start: 'Gate',
            goal: 'Lab',
          },
          sources: [{ label: 'AIMA — uninformed search', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'ai-m3',
      code: 'M3',
      title: 'Local search & optimization landscape',
      schedule: 'Week 4',
      summary: 'Hill climbing, simulated annealing, genetic algorithms overview.',
      topics: ['Hill climbing', 'Random restarts', 'Simulated annealing', 'Genetic algorithms landscape', 'Continuous optimization pointer'],
      outcomes: [
        'Explain local optima failure modes',
        'Choose local vs systematic search for a scenario',
      ],
      lectureBeats: [
        'State-space landscape: local vs global optima',
        'Hill climbing and random restarts',
        'Simulated annealing: temperature and acceptance of uphill moves',
        'Genetic algorithms at survey depth',
        'When to prefer A*/CSP over local search',
      ],
      readings: [{ label: 'AIMA — local search', kind: 'textbook' }],
      work: [
        analysisWork(
          'ai-m3-ps',
          'Problem set: local search',
          'Analyze landscapes and propose restart/annealing strategies.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'ai-m4',
      code: 'M4',
      title: 'Constraint satisfaction',
      schedule: 'Weeks 5–6',
      summary: 'CSP formulation, backtracking, and consistency.',
      topics: ['Variables/domains/constraints', 'Backtracking', 'MRV/LCV', 'Forward checking', 'AC-3 landscape'],
      outcomes: [
        'Model problems as CSPs',
        'Trace backtracking with forward checking on small instances',
      ],
      lectureBeats: [
        'CSP triple: variables, domains, constraints',
        'Backtracking search; MRV and LCV heuristics',
        'Forward checking and arc consistency (AC-3 idea)',
        'Map coloring and scheduling as running examples',
        'Inference vs search trade-off; planned CSP instrument',
      ],
      readings: [
        { label: 'AIMA — CSP chapter', kind: 'textbook' },
        { label: 'Berkeley CS 188 — CSP unit', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ai-m4-ps',
          'Problem set: CSPs',
          'Formulate CSPs and simulate inference + search.',
          'Written.',
          'partial',
        ),
        {
          id: 'ai-m4-lab',
          title: 'Lab: CSP arc consistency (toy)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Step AC-style domain reduction on A–B–C map with {R,G}; record domains after assign A=R.',
          brief:
            'systemsDemo csp-ac. Honest: 3-variable toy, not full AC-3 queue or Australia map.',
          config: { systemsDemo: 'csp-ac' },
          sources: [{ label: 'AIMA — CSP chapter', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'ai-m5',
      code: 'M5',
      title: 'Adversarial search & games',
      schedule: 'Weeks 7–8',
      summary: 'Minimax, alpha-beta, and uncertain games.',
      topics: ['Game trees', 'Minimax', 'Alpha-beta', 'Evaluation functions', 'Expectimax', 'MCTS landscape'],
      outcomes: [
        'Compute minimax/alpha-beta on small trees',
        'Design simple evaluation features thoughtfully',
      ],
      lectureBeats: [
        'Game trees; max and min layers',
        'Minimax value and optimal play assumption',
        'Alpha-beta pruning: what can be skipped',
        'Evaluation functions and horizon effects',
        'Expectimax / MCTS landscape for chance and large games',
      ],
      readings: [{ label: 'AIMA — adversarial search', kind: 'textbook' }],
      work: [
        analysisWork(
          'ai-m5-ps',
          'Problem set: games',
          'Minimax/alpha-beta hand calculations; critique an evaluation function.',
          'Written.',
          'partial',
        ),
        {
          id: 'ai-m5-lab-minimax',
          title: 'Lab: minimax tree',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective: 'Step minimax on the fixed depth-2 tree; record B, C, and root values.',
          brief: 'systemsDemo minimax-tree. Compare result to your paper minimax calculation on the same leaf utilities 3,12,8,2.',
          config: { systemsDemo: 'minimax-tree' },
          sources: [{ label: 'AIMA — adversarial search', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'ai-m6',
      code: 'M6',
      title: 'Logical agents',
      schedule: 'Weeks 9–10',
      summary: 'Propositional/FOL representation and inference intro.',
      topics: ['Propositional logic', 'Resolution idea', 'FOL syntax/semantics', 'Unification landscape', 'Situation calculus sketch'],
      outcomes: [
        'Encode simple domains in logic',
        'Perform short resolution or forward-chaining traces',
      ],
      lectureBeats: [
        'Propositional syntax/semantics; entailment vs implication',
        'CNF and resolution refutation',
        'Forward/backward chaining landscape',
        'FOL quantifiers, unification intro',
        'Wumpus-style KB fragments as agents’ knowledge',
      ],
      readings: [
        { label: 'AIMA — logical agents chapters', kind: 'textbook' },
        {
          label: 'MIT OCW 6.034 — representation units',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/',
        },
      ],
      work: [
        analysisWork(
          'ai-m6-ps',
          'Problem set: logic',
          'Knowledge base encodings and short inference proofs.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'ai-m7',
      code: 'M7',
      title: 'Uncertainty & Bayesian networks',
      schedule: 'Weeks 11–12',
      summary: 'Probability review and exact inference on small Bayes nets.',
      topics: ['Probability review', 'Bayes nets structure', 'Independence', 'Enumeration/variable elimination intro', 'Sampling landscape'],
      outcomes: [
        'Factor joint distributions via a Bayes net',
        'Compute small exact queries by enumeration',
      ],
      lectureBeats: [
        'Probability review: joint, conditional, Bayes rule',
        'Bayes net factorization and conditional independencies',
        'd-separation intuition (common cause / effect)',
        'Exact inference by enumeration on tiny nets',
        'Sampling / approximate inference landscape',
      ],
      readings: [
        { label: 'AIMA — probabilistic reasoning', kind: 'textbook' },
        { label: 'Berkeley CS 188 — Bayes nets', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'ai-m7-ps',
          'Problem set: Bayes nets',
          'Independence questions and exact inference on tiny nets.',
          'Written quantitative set.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'ai-m8',
      code: 'M8',
      title: 'MDPs, RL intro & AI↔ML bridge',
      schedule: 'Week 13',
      summary: 'Sequential decisions overview; handoff to Machine Learning course.',
      topics: ['MDPs', 'Value iteration idea', 'Policies', 'RL landscape (Q-learning idea)', 'What moves to ML course'],
      outcomes: [
        'Define an MDP for a small domain',
        'State what supervised ML adds beyond classical AI search',
      ],
      lectureBeats: [
        'MDP tuple: states, actions, transitions, rewards, discount',
        'Policies and value functions; Bellman optimality idea',
        'Value iteration one-step intuition',
        'RL landscape: Q-learning idea without full deep RL',
        'Bridge essay: classical AI modules vs supervised ML course',
      ],
      readings: [
        { label: 'AIMA — MDPs/RL intro chapters', kind: 'textbook' },
        { label: 'Cross-link: Machine Learning course', kind: 'notes' },
      ],
      work: [
        readingWork(
          'ai-m8-reading',
          'Bridge essay: AI vs ML',
          'One page contrasting classical AI techniques in M2–M7 with supervised learning problems from the ML course.',
          'Cite AIMA + ML course overview; keep claims scoped.',
          'partial',
        ),
      ],
    }),
  ],
}
