import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const softwareEngineeringMeta: CourseMeta = {
  id: 'software-engineering',
  title: 'Software Engineering',
  status: 'partial',
  track: 'Core / practice',
  level: 'undergraduate',
  moduleCount: 7,
  liveLabCount: 0,
  academicNote: 'Building software that lasts beyond a homework',
  blurb:
    'Process, design, testing, and maintenance at scale — building software that lasts beyond a homework.',
  cs2023Areas: ['SE', 'SDF'],
}

export const softwareEngineeringCourse: CourseDetail = {
  ...softwareEngineeringMeta,
  peerAnchors: [
    {
      school: 'CMU',
      courseCode: '17-313 / 15-413',
      title: 'Foundations of Software Engineering',
      note: 'Process + quality-focused SE',
    },
    {
      school: 'UC Berkeley',
      courseCode: 'CS 169',
      title: 'Software Engineering',
      note: 'Agile/product-oriented undergrad SE',
    },
    {
      school: 'University of Washington',
      courseCode: 'CSE 403',
      title: 'Software Engineering',
      note: 'Team project tradition',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['SE', 'SDF'],
  overview: `**Software Engineering** focuses on process, design, quality, and teamwork for systems larger than a single assignment. It complements Programming Languages (abstraction) and Algorithms (correctness/performance) with **lifecycle and quality** skills.

Team projects are offline by nature; this site provides structured modules, checklists, and reading maps—not a full LMS.`,
  prerequisites: [
    'Data Structures',
    'Ability to build multi-file programs',
    'Prior course project experience helpful',
  ],
  learningGoals: [
    'Choose process practices appropriate to risk and team size',
    'Produce designs with clear module boundaries and trade-off notes',
    'Plan testing strategies beyond happy paths',
    'Run retrospectives and risk tracking on a project narrative',
  ],
  modules: [
    moduleOf({
      id: 'se-m1',
      code: 'M1',
      title: 'SE lifecycle & process models',
      schedule: 'Week 1',
      summary: 'Waterfall, iterative, agile flavors, and when process helps or hurts.',
      topics: ['Lifecycle stages', 'Plan-driven vs agile', 'Risk-driven process', 'Definition of done'],
      outcomes: [
        'Select a process sketch for a given risk profile',
        'Name failure modes of process theater',
      ],
      lectureBeats: [
        'Lifecycle stages exist; how you sequence them depends on risk',
        'Plan-driven fits stable requirements and heavy audit; agile fits learning',
        'Process theater: ceremonies without feedback or decision rights',
        'Risk-driven process spends early effort on the scariest unknowns',
        'Definition of Done makes “finished” testable for the team',
      ],
      readings: [
        { label: 'Sommerville Software Engineering — process chapters', kind: 'textbook' },
        { label: 'CMU SE materials (public) selected', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'se-m1-ps',
          'Case analysis: process fit',
          'Given 2 project scenarios, recommend process practices with risks.',
          'Written memo format.',
          'partial',
        ),
        {
          id: 'se-m1-lab',
          title: 'Lab: lifecycle states (metaphor)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Use process state machine as a metaphor for work-item lifecycle (new→ready→doing→blocked→done); map states in a short note.',
          brief:
            'Honest scope: OS process demo reused as SE metaphor, not a real issue tracker. systemsDemo process-lifecycle.',
          config: { systemsDemo: 'process-lifecycle' },
          sources: [{ label: 'Sommerville — process chapters', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'se-m2',
      code: 'M2',
      title: 'Requirements & stakeholder communication',
      schedule: 'Week 2',
      summary: 'Goals vs features, acceptance criteria, and ambiguity.',
      topics: ['Problem vs solution', 'User stories / use cases', 'Acceptance criteria', 'Non-functionals', 'Prioritization'],
      outcomes: [
        'Write testable acceptance criteria',
        'Separate problem statements from premature design',
      ],
      lectureBeats: [
        'Problem statements first; solutions are options, not requirements',
        'Acceptance criteria must be testable — no “user-friendly” alone',
        'NFRs: latency, availability, security, accessibility with numbers',
        'Prioritization: value vs risk vs cost; not all stories are equal',
        'Ambiguity is a defect in requirements work — rewrite, don’t guess',
      ],
      readings: [{ label: 'SE textbook — requirements', kind: 'textbook' }],
      work: [
        analysisWork(
          'se-m2-ps',
          'Requirements clinic',
          'Rewrite ambiguous requirements into measurable acceptance criteria.',
          'Written critique + rewrite.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'se-m3',
      code: 'M3',
      title: 'Design & architecture',
      schedule: 'Weeks 3–4',
      summary: 'Module boundaries, styles, and design documentation that engineers actually use.',
      topics: ['Coupling/cohesion', 'Layered & hexagonal ideas', 'API design', 'ADRs', 'Trade-off records'],
      outcomes: [
        'Sketch an architecture with explicit trade-offs',
        'Write a short Architecture Decision Record',
      ],
      lectureBeats: [
        'Coupling and cohesion guide where module cuts belong',
        'Styles (layered, hexagonal) are patterns with known failure modes',
        'APIs are long-lived contracts; design for evolution',
        'ADRs capture context, decision, and consequences — not slideware',
        'Trade-offs must name what you gave up, not only benefits',
      ],
      readings: [
        { label: 'Bass et al. Software Architecture in Practice (selected)', kind: 'textbook' },
        { label: 'Cross-link: Operating Systems / Networks for system boundaries', kind: 'notes' },
      ],
      work: [
        analysisWork(
          'se-m3-ps',
          'Design package',
          'Produce module diagram + 1 ADR for a small system description.',
          'Written design deliverable.',
          'partial',
        ),
        {
          id: 'se-m3-lab-fcfs',
          title: 'Lab: single-queue delivery (FCFS metaphor)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Treat CPU FCFS as a single shared delivery queue; discuss convoy effect as blocked high-value work.',
          brief:
            'Honest metaphor: schedule-fcfs is OS scheduling, not a real sprint board. Map jobs→tickets; note when short work waits behind long.',
          config: { systemsDemo: 'schedule-fcfs' },
          sources: [{ label: 'SE process / flow efficiency landscape', kind: 'notes' }],
        },
        {
          id: 'se-m3-lab-rr',
          title: 'Lab: context-switch thrash (RR metaphor)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Use round-robin time slices as a metaphor for excessive WIP / multitasking; argue for WIP limits.',
          brief:
            'systemsDemo schedule-rr. Honest: not Kanban software. Count slice switches; relate to thrash from too many in-progress tickets.',
          config: { systemsDemo: 'schedule-rr' },
          sources: [{ label: 'Lean/WIP limits (public engineering blogs)', kind: 'other' }],
        },
      ],
    }),
    moduleOf({
      id: 'se-m4',
      code: 'M4',
      title: 'Testing & quality',
      schedule: 'Weeks 5–6',
      summary: 'Test levels, risk-based coverage, and automation boundaries.',
      topics: ['Unit/integration/E2E', 'Oracles', 'Risk-based testing', 'Flaky tests', 'Coverage myths'],
      outcomes: [
        'Design a test strategy for a feature with risk ranking',
        'Critique over-reliance on coverage percentages',
      ],
      lectureBeats: [
        'Test pyramid: many fast unit tests; fewer brittle E2E',
        'Risk-based testing: spend effort where failure hurts most',
        'Oracles: how do you know the answer is right?',
        'Coverage is necessary but not sufficient — myths kill quality debates',
        'Flakes destroy trust; quarantine and fix root causes',
      ],
      readings: [{ label: 'SE testing chapters / Google Testing Blog selected', kind: 'other' }],
      work: [
        analysisWork(
          'se-m4-ps',
          'Test strategy memo',
          'For a described feature, list risks, test levels, and automation boundaries.',
          'Written. No proprietary autograder.',
          'partial',
        ),
        {
          id: 'se-m4-lab-stack',
          title: 'Lab: production stack trace (metaphor)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Read a nested call stack as an incident artifact; write a 5-line “where to put the unit test” note.',
          brief:
            'systemsDemo stack-calls. Map top frames to likely unit vs integration test seams. Metaphor only.',
          config: { systemsDemo: 'stack-calls' },
          sources: [{ label: 'SE testing / debugging practice', kind: 'other' }],
        },
      ],
    }),
    moduleOf({
      id: 'se-m5',
      code: 'M5',
      title: 'Construction practices',
      schedule: 'Week 7',
      summary: 'Code review, CI, branching, and technical debt.',
      topics: ['Code review', 'CI pipelines', 'Branching strategies', 'Tech debt', 'Refactoring safety'],
      outcomes: [
        'Write constructive review comments on a sample diff',
        'Propose a CI gate set for a small team',
      ],
      lectureBeats: [
        'Code review is a quality and knowledge channel — comments should be actionable',
        'CI gates: lint, test, security scans; not every check blocks merge',
        'Branching strategy matches release risk and team size',
        'Tech debt is a risk portfolio; prioritize by blast radius',
        'Safe refactoring needs tests and small steps',
      ],
      readings: [{ label: 'Industry engineering handbooks (public) selected', kind: 'other' }],
      work: [
        analysisWork(
          'se-m5-ps',
          'Review & CI exercise',
          'Review a provided patch narrative; propose CI checks and debt paydown order.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'se-m6',
      code: 'M6',
      title: 'Teamwork, estimation & risk',
      schedule: 'Weeks 8–9',
      summary: 'Coordination, estimation humility, and risk registers.',
      topics: ['Roles', 'Estimation uncertainty', 'Risk registers', 'Incidents & postmortems', 'Ethics & responsibility'],
      outcomes: [
        'Maintain a lightweight risk register for a project story',
        'Write a blameless postmortem outline',
      ],
      lectureBeats: [
        'Roles and interfaces reduce coordination failure',
        'Estimates are distributions; humility beats false precision',
        'Risk registers: likelihood, impact, owner, trigger, mitigation',
        'Blameless postmortems fix systems, not people',
        'Ethics and responsibility: shipping is a social act',
      ],
      readings: [
        { label: 'SE process chapters — teams & project management', kind: 'textbook' },
        { label: 'Public postmortem exemplars', kind: 'other' },
      ],
      work: [
        analysisWork(
          'se-m6-ps',
          'Risk & postmortem pack',
          'Build a risk register and a postmortem outline for a fictional outage.',
          'Written team-process deliverable.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'se-m7',
      code: 'M7',
      title: 'Maintenance, evolution & course project framing',
      schedule: 'Week 10',
      summary: 'Living systems, versioning, and capstone project expectations.',
      topics: ['Compatibility', 'Versioning', 'Observability intro', 'Deprecation', 'Capstone planning'],
      outcomes: [
        'Plan evolution of an API with compatibility constraints',
        'Scope a multi-week team project with milestones and risks',
      ],
      lectureBeats: [
        'Most lifetime cost is after v1 — design for change',
        'Versioning and deprecation windows protect clients',
        'Observability: logs, metrics, traces as product requirements',
        'Capstone planning: milestones, risks, DoD, test strategy',
        'Compatibility constraints turn “rewrite” into disciplined evolution',
      ],
      readings: [{ label: 'SE textbook — maintenance & evolution', kind: 'textbook' }],
      work: [
        readingWork(
          'se-m7-project-plan',
          'Capstone plan (template)',
          'Produce a project plan: problem, milestones, risks, test strategy, and DoD.',
          'Use as scaffold for offline team work. Not graded by this site.',
          'partial',
        ),
      ],
    }),
  ],
}
