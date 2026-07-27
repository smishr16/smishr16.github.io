import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const databasesMeta: CourseMeta = {
  id: 'databases',
  title: 'Databases',
  status: 'partial',
  track: 'Core / systems elective',
  level: 'undergraduate',
  moduleCount: 7,
  liveLabCount: 0,
  academicNote: 'Data as a systems problem · often junior elective/required',
  blurb:
    'Relational model, query languages, indexing, transactions, and storage — data as a systems problem.',
  cs2023Areas: ['DM'],
}

export const databasesCourse: CourseDetail = {
  ...databasesMeta,
  peerAnchors: [
    {
      school: 'UC Berkeley',
      courseCode: 'CS 186',
      title: 'Introduction to Database Systems',
      note: 'Classic undergrad DB systems',
    },
    {
      school: 'Stanford',
      courseCode: 'CS145 / CS245',
      title: 'Databases / Database Systems Principles',
      note: 'Undergrad + systems depth paths',
    },
    {
      school: 'CMU',
      courseCode: '15-445/645',
      title: 'Database Systems',
      note: 'Systems-leaning DB course',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['DM'],
  overview: `**Databases** covers the relational model, SQL, schema design, indexing, query execution, and transactions. Emphasis is on **systems thinking** (how queries run and why isolation matters), not only ORM usage.

No production DBMS is required in-browser for Phase syllabus; written design work and SQL-on-paper come first. Instruments may later include join/index toys.`,
  prerequisites: [
    'Data Structures',
    'Some systems exposure helpful (files, concurrency intuition)',
  ],
  learningGoals: [
    'Design normalized relational schemas with clear integrity constraints',
    'Write and reason about SQL including joins and aggregation',
    'Explain index choices and basic query plan ideas',
    'State ACID and isolation anomalies with examples',
  ],
  modules: [
    moduleOf({
      id: 'db-m1',
      code: 'M1',
      title: 'Relational model & algebra',
      schedule: 'Weeks 1–2',
      summary: 'Relations, keys, and relational algebra operators.',
      topics: ['Relations & schemas', 'Keys & foreign keys', 'Selection/projection', 'Joins', 'Set operators'],
      outcomes: [
        'Express queries in relational algebra',
        'Identify key constraints on a schema',
      ],
      lectureBeats: [
        'Relation = set (or bag) of tuples over a fixed schema; keys enforce identity',
        'Selection filters rows; projection filters columns; beware duplicate policies',
        'Joins are derived from product + selection; natural vs theta vs outer',
        'Division and “for all” queries need careful algebra (or nested SQL later)',
        'Integrity: primary keys, foreign keys, and what “cascade” means operationally',
      ],
      readings: [
        { label: 'Ramakrishnan & Gehrke or Silberschatz — relational model', kind: 'textbook' },
        { label: 'Berkeley CS 186 — relational model unit', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'db-m1-ps',
          'Problem set: relational algebra',
          'Translate English requests into algebra and check key constraints.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'db-m2',
      code: 'M2',
      title: 'SQL',
      schedule: 'Weeks 3–4',
      summary: 'Declarative queries, joins, aggregation, and nulls.',
      topics: ['SELECT core', 'Joins', 'GROUP BY/HAVING', 'Nested queries', 'NULLs & three-valued logic', 'Views intro'],
      outcomes: [
        'Write correct multi-join SQL for mid-complexity tasks',
        'Explain NULL semantics that surprise application developers',
      ],
      lectureBeats: [
        'SQL is declarative: specify what, optimizer chooses how',
        'JOIN types change null-padding; know INNER vs LEFT outcomes on examples',
        'GROUP BY + HAVING: aggregate after groups; WHERE cannot see aggregates',
        'NULL: three-valued logic; NOT IN with NULL is a classic footgun',
        'Correlated vs uncorrelated subqueries; EXISTS often safer than NOT IN',
      ],
      readings: [{ label: 'Textbook SQL chapters + public SQL tutorials as practice', kind: 'textbook' }],
      work: [
        analysisWork(
          'db-m2-ps',
          'Problem set: SQL',
          'Write SQL for a provided schema; include aggregation and nested queries.',
          'Written / offline DB practice. Not an official university dump.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'db-m3',
      code: 'M3',
      title: 'Schema design & normalization',
      schedule: 'Week 5',
      summary: 'ER modeling, FDs, and normal forms.',
      topics: ['ER diagrams', 'Functional dependencies', '3NF/BCNF', 'Decomposition', 'Trade-offs of normalization'],
      outcomes: [
        'Normalize a schema to BCNF/3NF with justification',
        'Argue when denormalization is intentional',
      ],
      lectureBeats: [
        'ER → relations is a design step; cardinality drives key placement',
        'FDs capture real-world constraints; attribute closure finds keys',
        'BCNF: every determinant is a superkey; 3NF allows limited exceptions',
        'Lossless-join and dependency-preserving decompositions are not automatic',
        'Denormalization is a performance choice with anomaly cost — name it',
      ],
      readings: [{ label: 'DB textbook — design theory chapters', kind: 'textbook' }],
      work: [
        analysisWork(
          'db-m3-ps',
          'Problem set: normalization',
          'Find FDs, decompose, and discuss anomalies.',
          'Written design set.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'db-m4',
      code: 'M4',
      title: 'Storage & indexing',
      schedule: 'Weeks 6–7',
      summary: 'Pages, indexes, and access methods.',
      topics: ['Heap files', 'B+ trees', 'Hash indexes', 'Clustered vs unclustered', 'Index-only scans idea'],
      outcomes: [
        'Choose indexes for a workload sketch',
        'Explain B+ tree height intuition',
      ],
      lectureBeats: [
        'I/O units are pages; buffer pool makes “hot” pages cheap',
        'Heap scan vs index lookup: selectivity decides the winner',
        'B+ trees: balanced height, sibling leaves for range scans',
        'Clustered index orders table data; unclustered points into heap',
        'Covering / index-only scans avoid heap fetches when columns fit',
      ],
      readings: [
        { label: 'DB textbook — storage & indexing', kind: 'textbook' },
        { label: 'CMU 15-445 public notes (selected)', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'db-m4-ps',
          'Problem set: indexes',
          'Recommend indexes and estimate I/O at order-of-magnitude level.',
          'Written systems reasoning.',
          'partial',
        ),
        {
          id: 'db-m4-lab',
          title: 'Lab: B+ leaf packing (toy)',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective: 'Insert keys into an order-3 B+ leaf toy; observe packing and split to new leaves.',
          brief:
            'structureDemo bplus-insert. Honest scope: leaves only (no full internal index). Values [10,20,5,30,15,25,35].',
          config: { structureDemo: 'bplus-insert', values: [10, 20, 5, 30, 15, 25, 35] },
          sources: [{ label: 'DB textbook — B+ trees', kind: 'textbook' }],
        },
        {
          id: 'db-m4-lab-bplus-full',
          title: 'Lab: B+ tree with internal nodes',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective:
            'Insert keys into a full B+ (max 2 keys/node): watch leaf splits, separator promotion, and root growth.',
          brief:
            'structureDemo bplus-tree, values [10,20,30,40,50,5,15,25]. Draw internal ⟨separators⟩ vs leaf [data] after each split.',
          config: { structureDemo: 'bplus-tree', values: [10, 20, 30, 40, 50, 5, 15, 25] },
          sources: [{ label: 'DB textbook / CMU 15-445 — B+ trees', kind: 'textbook' }],
        },
        {
          id: 'db-m4-lab-hash',
          title: 'Lab: hash index (chaining)',
          kind: 'lab',
          status: 'live',
          labId: 'structures',
          objective: 'Insert keys with chaining hash; relate buckets to hash index leaves for equality lookups.',
          brief: 'structureDemo hash-insert. Note collisions and chain length; contrast with B+ range scans.',
          config: { structureDemo: 'hash-insert', values: [7, 3, 11, 1, 9, 5, 15] },
          sources: [{ label: 'DB textbook — hash indexes', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'db-m5',
      code: 'M5',
      title: 'Query processing & optimization',
      schedule: 'Weeks 8–9',
      summary: 'Operators, join algorithms, and cost-based choice (intro).',
      topics: ['Iterator model', 'Nested-loop / hash / sort-merge joins', 'Selectivity intuition', 'Plans & cost models intro'],
      outcomes: [
        'Compare join algorithms for given sizes',
        'Read a simple plan shape and critique it',
      ],
      lectureBeats: [
        'Plans are trees of operators; cost models estimate I/O and CPU',
        'Nested-loop is simple; blocking/hash/sort-merge win at scale',
        'Push selections and projections early when legal',
        'Join order matters: intermediate sizes dominate total cost',
        'Statistics and selectivity mistakes → “optimizer chose a bad plan” stories',
      ],
      readings: [{ label: 'DB textbook — query processing', kind: 'textbook' }],
      work: [
        analysisWork(
          'db-m5-ps',
          'Problem set: query plans',
          'Estimate costs for alternative plans on toy cardinalities.',
          'Written.',
          'partial',
        ),
        {
          id: 'db-m5-lab-nlj',
          title: 'Lab: nested-loop join',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective: 'Step nested-loop join of tiny R⋈S on a; count probes and result tuples.',
          brief: 'systemsDemo nl-join. |R|=|S|=3 → 9 probes; list emitted join rows.',
          config: { systemsDemo: 'nl-join' },
          sources: [{ label: 'DB textbook — join algorithms', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'db-m6',
      code: 'M6',
      title: 'Transactions & concurrency control',
      schedule: 'Weeks 10–11',
      summary: 'ACID, schedules, locking, and isolation levels.',
      topics: ['Transactions', 'Conflict serializability', '2PL', 'Isolation levels', 'Deadlocks', 'MVCC landscape'],
      outcomes: [
        'Identify anomalies under weak isolation',
        'Reason about simple locking schedules',
      ],
      lectureBeats: [
        'ACID: atomicity and durability via logging; isolation via concurrency control',
        'Anomalies: dirty read, non-repeatable read, phantom — concrete histories',
        'Conflict serializability and precedence graphs; cycles mean trouble',
        '2PL: growing then shrinking lock phase; deadlocks need detection/prevention',
        'Isolation levels trade anomalies for throughput; MVCC is the modern default story',
      ],
      readings: [{ label: 'DB textbook — transactions', kind: 'textbook' }],
      work: [
        analysisWork(
          'db-m6-ps',
          'Problem set: transactions',
          'Classify schedules and isolation anomalies on short histories.',
          'Written concurrency-for-data problems.',
          'partial',
        ),
        {
          id: 'db-m6-lab-buf',
          title: 'Lab: buffer pool eviction (FIFO metaphor)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Treat page frames as a buffer pool; FIFO eviction under a page ref string; count faults as pool misses.',
          brief:
            'Honest scope: OS page-FIFO demo reused as DB buffer pool metaphor. systemsDemo page-fifo. Map frames→buffer slots in a short note.',
          config: { systemsDemo: 'page-fifo' },
          sources: [{ label: 'DB textbook — buffer management', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'db-m7',
      code: 'M7',
      title: 'Recovery, distribution & modern landscape',
      schedule: 'Week 12',
      summary: 'Logging/recovery intro; NoSQL/NewSQL survey.',
      topics: ['WAL idea', 'ARIES landscape', 'Replication/sharding survey', 'NoSQL trade-offs', 'Course synthesis'],
      outcomes: [
        'Explain why logging enables recovery',
        'Map CAP-style trade-offs at undergrad survey depth',
      ],
      lectureBeats: [
        'WAL: log before data page; recovery replays committed work',
        'ARIES landscape: analysis, redo, undo at systems-course depth',
        'Replication vs sharding: availability, scale, and consistency knobs',
        'NoSQL/NewSQL: data model and consistency spectrum — not “SQL bad”',
        'Course synthesis: schema → access methods → plans → transactions → distribution',
      ],
      readings: [
        { label: 'DB textbook — recovery & distributed survey', kind: 'textbook' },
        { label: 'Selected systems papers (public) optional', kind: 'paper' },
      ],
      work: [
        readingWork(
          'db-m7-reading',
          'Reading: one modern data system',
          'One-page design map of one modern store onto relational systems concepts.',
          'Cite public docs/papers; no proprietary materials.',
          'partial',
        ),
      ],
    }),
  ],
}
