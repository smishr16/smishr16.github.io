import type { MeatPack } from './types'

export const databasesMeat: MeatPack[] = [
  {
    workId: 'db-m1-ps',
    timeEstimate: '70 min',
    deliverables: ['Algebra expressions + key analysis'],
    selfCheck: ['Attribute sets match schema you defined'],
    solutionSketch: {
      problemId: 'd1',
      sketch:
        'Student(sid PK), Course(cid PK), Enroll(sid,cid,grade) FK→Student,Course; key (sid,cid) if one grade/term. History: add term or EnrollId.',
    },

    problems: [
      {
        id: 'd1',
        title: 'P1 · Schema',
        points: 25,
        prompt:
          'Design relations Student(sid,name,major), Course(cid,title), Enroll(sid,cid,grade). Underline keys; state FKs.',
      },
      {
        id: 'd2',
        title: 'P2 · Algebra',
        points: 40,
        prompt:
          'Write RA for: (i) names of CS majors; (ii) titles of courses Alice (sid=1) took; (iii) students who took every course (division or equivalent).',
      },
      {
        id: 'd3',
        title: 'P3 · Keys',
        points: 35,
        prompt: 'Could (sid,cid) be key of Enroll if a student can retake? Redesign if grades history is kept.',
      },
    ],
  },
  {
    workId: 'db-m2-ps',
    timeEstimate: '80 min',
    deliverables: ['SQL queries'],
    selfCheck: ['NULL semantics considered for outer joins if used'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        'DB focus (P1 · Joins): fix a concrete schema/history/cost number from the prompt; justify with keys, I/O, or anomaly example. SQL: list student name and course title for all enrollments with grade ≥ 3.0.…',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · Joins',
        points: 35,
        prompt: 'SQL: list student name and course title for all enrollments with grade ≥ 3.0.',
      },
      {
        id: 's2',
        title: 'P2 · Aggregation',
        points: 35,
        prompt: 'SQL: for each major, count students; only majors with ≥10 students.',
      },
      {
        id: 's3',
        title: 'P3 · Nested',
        points: 30,
        prompt: 'SQL: students who never enrolled in cid=‘CS101’ (use NOT EXISTS or LEFT JOIN).',
      },
    ],
  },
  {
    workId: 'db-m6-ps',
    timeEstimate: '65 min',
    deliverables: ['Schedule classifications'],
    selfCheck: ['Conflict serializability graph used if needed'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'Dirty read / non-repeatable / phantom histories. 2PL grow then shrink. RC vs SERIALIZABLE anomaly table.',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · Anomalies',
        points: 35,
        prompt: 'Exhibit dirty read, non-repeatable read, and phantom with short histories (R/W on X,Y).',
      },
      {
        id: 't2',
        title: 'P2 · 2PL',
        points: 35,
        prompt: 'Define two-phase locking. Show a schedule allowed by 2PL and one that deadlocks.',
      },
      {
        id: 't3',
        title: 'P3 · Isolation',
        points: 30,
        prompt: 'Map READ COMMITTED vs SERIALIZABLE to which anomalies they prevent (table).',
      },
    ],
  },
  {
    workId: 'db-m3-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'Ramakrishnan & Gehrke — design theory / FDs', kind: 'textbook' }],
    deliverables: ['FD set + closure computations', 'Decomposed schemas with keys and lossless check'],
    selfCheck: [
      'Decomposition is lossless-join (tableau or chase argument)',
      'Each relation’s keys justified from FDs',
    ],
    solutionSketch: {
      problemId: 'n1',
      sketch:
        'For P1 · FDs & closure: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'n1',
        title: 'P1 · FDs & closure',
        points: 30,
        prompt:
          'Relation R(A,B,C,D,E) with FDs: A→BC, CD→E, B→D, E→A. Compute (A)⁺, (B)⁺, and a candidate key. Show intermediate attribute-closure steps.',
      },
      {
        id: 'n2',
        title: 'P2 · BCNF violation',
        points: 35,
        prompt:
          'Using F from P1, list all BCNF violations (X→Y where X is not a superkey). Decompose to BCNF; for each piece state a key. Argue lossless join.',
      },
      {
        id: 'n3',
        title: 'P3 · Anomalies vs denorm',
        points: 35,
        prompt:
          'On the unnormalized R of P1, give a concrete insert anomaly and update anomaly (example tuples). Name one workload where intentional denormalization is reasonable and what consistency cost you accept.',
      },
    ],
  },
  {
    workId: 'db-m4-ps',
    timeEstimate: '70 min',
    sources: [{ label: 'DB textbook — storage & indexing / CMU 15-445 notes', kind: 'textbook' }],
    deliverables: ['Index recommendation table', 'Order-of-magnitude I/O estimates'],
    selfCheck: [
      'Clustered vs unclustered distinguished',
      'Assumptions on page size and selectivity stated',
    ],
    solutionSketch: {
      problemId: 'i1',
      sketch:
        'Systems/OS (P1 · Workload indexes): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. Table Emp(eid PK, dept, salary, name) 1M rows, 100 bytes/row, 4KB pages. Workloa…',
    },

    problems: [
      {
        id: 'i1',
        title: 'P1 · Workload indexes',
        points: 35,
        prompt:
          'Table Emp(eid PK, dept, salary, name) 1M rows, 100 bytes/row, 4KB pages. Workload: (Q1) equality on eid; (Q2) range on salary for one dept (≈1% of table); (Q3) full table avg(salary). Recommend indexes (type + columns) for Q1–Q2 and say what you would not index for Q3.',
      },
      {
        id: 'i2',
        title: 'P2 · B+ height',
        points: 35,
        prompt:
          'B+ tree, order d=100 (≤200 keys/internal node), N=10⁷ leaf entries, nearly full leaves. Bound tree height h and worst-case I/Os to fetch one key (root in memory vs cold cache).',
      },
      {
        id: 'i3',
        title: 'P3 · Covering',
        points: 30,
        prompt:
          'Query: SELECT name FROM Emp WHERE dept=‘CS’. When is an unclustered index on (dept) worse than a scan? When does a covering index on (dept,name) help? Give a numeric selectivity threshold sketch.',
      },
    ],
  },
  {
    workId: 'db-m4-lab',
    timeEstimate: '45 min',
    sources: [{ label: 'DB textbook — B+ trees', kind: 'textbook' }],
    deliverables: ['Step-by-step tree diagrams after each insert/split', 'Final leaf chain order'],
    selfCheck: [
      'Splits preserve sorted order and parent separators',
      'Max keys per node consistent with stated order',
    ],
    solutionSketch: {
      problemId: 'b1',
      sketch:
        'Order-3 leaves: pack keys; split when 4th key. Missing: internal separators, root split, sibling links (see bplus-tree lab).',
    },
    problems: [
      {
        id: 'b1',
        title: 'P1 · Insert sequence',
        points: 40,
        prompt:
          'Paper B+ tree of order d=2 (max 4 keys/node). Insert keys 10,20,30,40,50,5,15,25 in order. Draw the tree after each split (not every insert if no split). Label leaves L→R.',
      },
      {
        id: 'b2',
        title: 'P2 · Range scan',
        points: 30,
        prompt:
          'On your final tree, list leaf pages touched for range [12, 35]. How many sibling pointers are followed after the first leaf?',
      },
      {
        id: 'b3',
        title: 'P3 · Delete sketch',
        points: 30,
        prompt:
          'Delete key 40 from the final tree. If underflow occurs, show either redistribution or merge (state which) and the resulting tree. Instrument note: when the B+ toy ships, re-run the same insert sequence and compare heights.',
      },
    ],
  },
  {
    workId: 'db-m5-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'DB textbook — query processing & join algorithms', kind: 'textbook' }],
    deliverables: ['Cost formulas with plugged-in numbers', 'Chosen plan shape with justification'],
    selfCheck: [
      'Units are page I/Os (state buffer assumptions)',
      'Join result size estimates use stated selectivities',
    ],
    solutionSketch: {
      problemId: 'q1',
      sketch:
        'DB focus (P1 · Nested-loop vs hash): fix a concrete schema/history/cost number from the prompt; justify with keys, I/O, or anomaly example. R has 10,000 pages, S has 2,000 pages, B=102 buffer pages. Estimate I/O for bloc…',
    },

    problems: [
      {
        id: 'q1',
        title: 'P1 · Nested-loop vs hash',
        points: 40,
        prompt:
          'R has 10,000 pages, S has 2,000 pages, B=102 buffer pages. Estimate I/O for block nested-loop join (R outer) vs simple hash join (build on S, assume hash fits). Show formulas before numbers.',
      },
      {
        id: 'q2',
        title: 'P2 · Sort-merge',
        points: 30,
        prompt:
          'Same sizes: cost of sort-merge join if both inputs are unsorted (external sort, 2-pass if possible). When is sort-merge preferable to hash join?',
      },
      {
        id: 'q3',
        title: 'P3 · Plan critique',
        points: 30,
        prompt:
          'Query: σ_{year=2024}(Orders) ⨝_{cid} Customer, |Orders|=1e7 rows, 1% match year=2024, |Customer|=1e5, cid FK. Sketch two plan shapes (filter-then-join vs join-then-filter). Which is cheaper at order-of-magnitude and why?',
      },
    ],
  },
  {
    workId: 'db-m7-reading',
    timeEstimate: '70 min',
    sources: [
      { label: 'DB textbook — recovery / distributed survey', kind: 'textbook' },
      { label: 'Public system docs or paper (cite your choice)', kind: 'other' },
    ],
    deliverables: ['One-page design map', 'Citation list with locators'],
    selfCheck: [
      'Maps system features onto WAL / isolation / partitioning concepts',
      'No proprietary internal materials',
    ],
    solutionSketch: {
      problemId: 'rd1',
      sketch:
        'DB focus (P1 · System pick): fix a concrete schema/history/cost number from the prompt; justify with keys, I/O, or anomaly example. Choose one modern store (e.g. Postgres, Spanner overview, Dynamo-style, or a pub…',
    },

    problems: [
      {
        id: 'rd1',
        title: 'P1 · System pick',
        points: 25,
        prompt:
          'Choose one modern store (e.g. Postgres, Spanner overview, Dynamo-style, or a public NewSQL paper). Cite primary public docs/paper. State its data model in ≤5 sentences.',
      },
      {
        id: 'rd2',
        title: 'P2 · Concept map',
        points: 45,
        prompt:
          'Map the system to course concepts: (i) logging/recovery or durability story; (ii) concurrency/isolation (or lack); (iii) sharding/replication. For each, quote or paraphrase a public claim and interpret it in M1–M6 vocabulary.',
      },
      {
        id: 'rd3',
        title: 'P3 · Trade-off',
        points: 30,
        prompt:
          'Name one CAP-style or consistency/latency trade-off the system makes. Give a workload that fits and one that does not. Write two exam-style questions an instructor could ask from your map.',
      },
    ],
  },
]

export const networksMeat: MeatPack[] = [
  {
    workId: 'net-m1-ps',
    timeEstimate: '55 min',
    sources: [{ label: 'Kurose & Ross Ch. 1', kind: 'textbook' }],
    deliverables: ['Numeric delay calculations'],
    selfCheck: ['Units: bits, bps, meters, c'],
    solutionSketch: {
      problemId: 'n1',
      sketch:
        'L=1500B=12000b, R=10Mbps → tx=1.2ms; d=1000km s=2e8 → prop=5ms; +1ms proc. End-to-end: reliability at ends.',
    },
    problems: [
      {
        id: 'n1',
        title: 'P1 · Delays',
        points: 40,
        prompt:
          'Packet L=1500 bytes, R=10 Mbps, distance 1000 km, propagation 2×10⁸ m/s, processing 1ms. Compute transmission, propagation, and total one-hop delay (ignore queue).',
      },
      {
        id: 'n2',
        title: 'P2 · End-to-end',
        points: 30,
        prompt:
          'State the end-to-end argument in your own words; give one function that should not live only in the network core (e.g. reliable delivery). Cite one counterexample where hop-by-hop still helps.',
      },
      {
        id: 'n3',
        title: 'P3 · Packet vs circuit',
        points: 30,
        prompt:
          'Compare packet and circuit switching: for 10 users each needing 1 Mbps peaks but average 0.1 Mbps on a 5 Mbps link, who fits? Name one failure mode each.',
      },
    ],
  },
  {
    workId: 'net-m3-ps',
    timeEstimate: '75 min',
    deliverables: ['Sequence diagrams'],
    selfCheck: ['Window size and ACK numbers consistent'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'Networks (P1 · Stop-and-wait): plug numbers into L/R or d/s or cwnd rules; state units. Compare packet and circuit switching: for 10 users each needing 1 Mbps peaks but…',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · Stop-and-wait',
        points: 30,
        prompt: 'RTT=100ms, R=1 Mbps, L=1000 bytes. Utilization of stop-and-wait? (ignore processing).',
      },
      {
        id: 't2',
        title: 'P2 · GBN',
        points: 40,
        prompt: 'Window N=4, packets 0..6, loss of packet 2. Show sender/receiver with GBN (cumulative ACK).',
      },
      {
        id: 't3',
        title: 'P3 · TCP handshake',
        points: 30,
        prompt: 'Draw 3-way handshake with example sequence numbers; what does ACK number mean?',
      },
    ],
  },
  {
    workId: 'net-m5-ps',
    timeEstimate: '70 min',
    deliverables: ['Routing tables after iterations'],
    selfCheck: ['Count-to-infinity mentioned if relevant'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'Networks (P3 · TCP handshake): plug numbers into L/R or d/s or cwnd rules; state units. Draw 3-way handshake with example sequence numbers; what does ACK number mean?…',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · DV',
        points: 40,
        prompt:
          'Triangle A-B 1, B-C 1, A-C 4. Run distance vector until stable; show tables each round from A’s view of C.',
      },
      {
        id: 'r2',
        title: 'P2 · LS',
        points: 35,
        prompt: 'Same graph, Dijkstra from A: settle order and distances.',
      },
      {
        id: 'r3',
        title: 'P3 · CIDR',
        points: 25,
        prompt: 'Can 192.168.0.0/16 and 192.168.1.0/24 both appear in a table? Longest-prefix match for 192.168.1.10?',
      },
    ],
  },
  {
    workId: 'net-m2-ps',
    timeEstimate: '65 min',
    sources: [{ label: 'Kurose & Ross — application layer', kind: 'textbook' }],
    deliverables: ['DNS/HTTP timeline with RTTs labeled', 'Short protocol critique memo'],
    selfCheck: [
      'Distinguish iterative vs recursive DNS resolution',
      'TLS placement relative to HTTP stated correctly',
    ],
    solutionSketch: {
      problemId: 'a1',
      sketch:
        'For P3 · CIDR: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'a1',
        title: 'P1 · Web fetch timeline',
        points: 40,
        prompt:
          'User types https://www.example.com/index.html (cold cache). Sketch ordered steps: DNS (assume iterative from stub), TCP handshake, TLS, HTTP GET/response. Label which steps need RTT. Assume non-persistent HTTP/1.0 for one object.',
      },
      {
        id: 'a2',
        title: 'P2 · DNS records',
        points: 30,
        prompt:
          'Given: example.com NS ns1.example.com; ns1 A 203.0.113.10; www CNAME origin.cdn.net; origin.cdn.net A 198.51.100.5. Starting from root hints, list queries and answers until the browser has the IP for www.example.com.',
      },
      {
        id: 'a3',
        title: 'P3 · Protocol design',
        points: 30,
        prompt:
          'Critique a chat protocol that opens a new TCP connection per message and includes no message IDs. Name three failure modes (reorder, duplicate, partial send) and propose minimal fixes (≤8 sentences).',
      },
    ],
  },
  {
    workId: 'net-m4-ps',
    timeEstimate: '70 min',
    sources: [{ label: 'Kurose & Ross — congestion control', kind: 'textbook' }],
    deliverables: ['AIMD cwnd table by RTT', 'Loss- vs delay-based short essay'],
    selfCheck: [
      'Slow start vs congestion avoidance phases labeled',
      'Fairness claim scoped to AIMD model assumptions',
    ],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'Networks (P1 · AIMD trace): plug numbers into L/R or d/s or cwnd rules; state units. Critique a chat protocol that opens a new TCP connection per message and include…',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · AIMD trace',
        points: 40,
        prompt:
          'TCP Reno-like: MSS=1 segment unit, ssthresh=8, start cwnd=1. Trace cwnd each RTT under no loss until cwnd reaches 12, then a triple-duplicate ACK at cwnd=12. Show cwnd and ssthresh after Fast Recovery entry (classic Reno: ssthresh=⌊cwnd/2⌋, cwnd=ssthresh). Table ≥10 rows.',
      },
      {
        id: 'c2',
        title: 'P2 · Throughput sketch',
        points: 30,
        prompt:
          'RTT=100ms, MSS=1KB, average cwnd=20 segments in CA. Approximate goodput ignoring loss. If loss rate doubles and average cwnd halves, what happens to throughput?',
      },
      {
        id: 'c3',
        title: 'P3 · Signals',
        points: 30,
        prompt:
          'In ≤10 sentences: contrast loss-based (classic Reno) vs delay-based congestion signals. Give one scenario where loss is a poor congestion signal (e.g. wireless) and one risk of pure delay-based control.',
      },
    ],
  },
  {
    workId: 'net-m6-ps',
    timeEstimate: '65 min',
    sources: [{ label: 'Kurose & Ross — link layer', kind: 'textbook' }],
    deliverables: ['MAC scenario answers', 'Switch learning table after each frame'],
    selfCheck: [
      'Learning switch only learns from source MAC',
      'Hidden terminal defined with topology sketch',
    ],
    solutionSketch: {
      problemId: 'l1',
      sketch:
        'ML (P3 · Signals): report the numeric metric from the lab/prompt; state underfit/overfit or update equation. In ≤10 sentences: contrast loss-based (classic Reno) vs delay-based congestion s…',
    },

    problems: [
      {
        id: 'l1',
        title: 'P1 · Switch learning',
        points: 40,
        prompt:
          'Switch S with ports 1–4, empty table. Frames in order: A→B on port1; B→A on port2; C→A on port3; A→C on port1. After each frame: table contents and whether flooded or forwarded. Final path for D→A arriving on port4?',
      },
      {
        id: 'l2',
        title: 'P2 · MAC compare',
        points: 30,
        prompt:
          'Compare TDMA, CSMA/CD, and CSMA/CA on: need for clock sync, collision handling, and fit for wireless half-duplex. Table with 3 rows × 3 columns.',
      },
      {
        id: 'l3',
        title: 'P3 · Hidden terminal',
        points: 30,
        prompt:
          'Nodes A—B—C: A and C cannot hear each other; both send to B. Explain the hidden terminal problem and how RTS/CTS (at intuition level) mitigates it. Draw a 4-step timeline.',
      },
    ],
  },
  {
    workId: 'net-m7-reading',
    timeEstimate: '60 min',
    sources: [
      { label: 'Kurose & Ross — security / synthesis chapters', kind: 'textbook' },
      { label: 'Public system or measurement paper (your choice)', kind: 'paper' },
    ],
    deliverables: ['One-page concept connection', 'Method caveats list'],
    selfCheck: [
      'TLS placed correctly relative to TCP/app',
      'Measurement claims distinguish correlation vs causation',
    ],
    solutionSketch: {
      problemId: 'rd1',
      sketch:
        'SE (P3 · Hidden terminal): give measurable numbers (counts, ms, %) or a 3-part ADR (context/decision/consequences). Nodes A—B—C: A and C cannot hear each other; both send to B. Explain the hidden …',
    },

    problems: [
      {
        id: 'rd1',
        title: 'P1 · Source map',
        points: 30,
        prompt:
          'Pick one modern network system or public paper (CDN, QUIC, BGP incident postmortem, measurement study). Cite it. Summarize the problem it addresses in ≤6 sentences.',
      },
      {
        id: 'rd2',
        title: 'P2 · Layer links',
        points: 40,
        prompt:
          'Connect the source to ≥3 of M1–M6 ideas (e.g. delay, reliability, congestion, routing, MAC). For each, state which layer and what mechanism. Include where TLS sits if the system is web-facing.',
      },
      {
        id: 'rd3',
        title: 'P3 · Measurement critique',
        points: 30,
        prompt:
          'Write a ½-page critique of a performance claim (from the paper or a headline you invent carefully). List method pitfalls: vantage point, sampling bias, conflating bandwidth with latency, middleboxes. Propose one better measurement design.',
      },
    ],
  },
]

export const plMeat: MeatPack[] = [
  {
    workId: 'pl-m1-ps',
    timeEstimate: '80 min',
    deliverables: ['AST + eval rules'],
    selfCheck: ['Environments explicit in traces'],
    solutionSketch: {
      problemId: 'p1',
      sketch:
        'Systems/OS (P3 · Measurement critique): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. Write a ½-page critique of a performance claim (from the paper or a headline you…',
    },

    problems: [
      {
        id: 'p1',
        title: 'P1 · AST',
        points: 30,
        prompt: 'AST for let x = 2+3 in x*x (or equivalent). Label nodes.',
      },
      {
        id: 'p2',
        title: 'P2 · Big-step',
        points: 40,
        prompt: 'Write big-step rules for numbers, +, and let-binding. Derive evaluation of the program in P1.',
      },
      {
        id: 'p3',
        title: 'P3 · Errors',
        points: 30,
        prompt: 'Extend with boolean if and type errors as stuck states vs error values—pick one design and justify.',
      },
    ],
  },
  {
    workId: 'pl-m4-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'Pierce TAPL early chapters', kind: 'textbook' }],
    deliverables: ['Typing derivations'],
    selfCheck: ['Context Γ managed correctly'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'T-Abs/T-App/T-Var. Progress: well-typed closed terms value or step. Bad cast ⇒ stuck well-typed term.',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · STLC',
        points: 40,
        prompt: 'Give typing rules for λ-abstraction and application. Derive ⊢ (λx:Bool. x) true : Bool.',
      },
      {
        id: 't2',
        title: 'P2 · Progress idea',
        points: 30,
        prompt: 'State progress theorem informally. Why does it fail if you add a wrong cast rule?',
      },
      {
        id: 't3',
        title: 'P3 · Counterexample',
        points: 30,
        prompt:
          'Show a term that is well-typed under an unsound cast rule you invent (e.g. Bool → Nat free), but stuck at runtime. Give the typing derivation outline and the stuck redex.',
      },
    ],
  },
  {
    workId: 'pl-m2-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'PLAI / PL textbook — functions & scope', kind: 'textbook' }],
    deliverables: ['Evaluation traces under both scoping regimes', 'Closure diagrams (code + env)'],
    selfCheck: [
      'Static scope resolves free vars in defining environment',
      'Dynamic scope resolves in calling environment',
    ],
    solutionSketch: {
      problemId: 'sc1',
      sketch:
        'For P2 · Progress idea: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'sc1',
        title: 'P1 · Static vs dynamic',
        points: 40,
        prompt:
          'Program: let x = 1 in let f = (λy. x+y) in let x = 10 in f(2). Trace evaluation under static scope and under dynamic scope. Final values? Draw environments at the call to f.',
      },
      {
        id: 'sc2',
        title: 'P2 · Closures',
        points: 35,
        prompt:
          'Explain the value of f after: let x = 5 in let f = (λz. x*z) in f — as a closure (code + environment). Then evaluate (let x = 0 in f(3)) under static scope. Why does x=0 not affect f?',
      },
      {
        id: 'sc3',
        title: 'P3 · Recursion binding',
        points: 25,
        prompt:
          'Why does a naive let rec need a special binding form (or backpatch) for recursive functions? Show a 3-line example where a non-recursive let fails to define factorial-style recursion.',
      },
    ],
  },
  {
    workId: 'pl-m3-ps',
    timeEstimate: '80 min',
    sources: [{ label: 'Harper PFPL / Winskel-style SOS notes (selected)', kind: 'textbook' }],
    deliverables: ['Inference rules in SOS style', 'Multi-step reduction derivation'],
    selfCheck: [
      'Judgment forms declared before rules',
      'Small-step congruence rules included if needed',
    ],
    solutionSketch: {
      problemId: 'os1',
      sketch:
        'PL (P3 · Recursion binding): write the judgment or reduction sequence; name the rule (T-App, E-Add, …). Explain the value of f after: let x = 5 in let f = (λz. x*z) in f — as a closure…',
    },

    problems: [
      {
        id: 'os1',
        title: 'P1 · Small-step arithmetic',
        points: 35,
        prompt:
          'Language: n | e+e. Give small-step rules for + (left-to-right) including congruence. Derive (1+2)+(3+4) →* 10 with each step labeled by rule name.',
      },
      {
        id: 'os2',
        title: 'P2 · Big-step if',
        points: 35,
        prompt:
          'Add booleans and if e then e else e. Write big-step rules for if-true and if-false. Evaluate if (1<2) then (3+4) else 0 under your rules (you may treat 1<2 as primitive true).',
      },
      {
        id: 'os3',
        title: 'P3 · Equivalence',
        points: 30,
        prompt:
          'In ≤8 sentences: when can small-step and big-step disagree in the presence of nontermination or errors? Give one term that loops under small-step and say what big-step “says” about it.',
      },
    ],
  },
  {
    workId: 'pl-m5-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'TAPL / PL textbooks — ADTs & polymorphism intro', kind: 'textbook' }],
    deliverables: ['Typed variant rules + example programs', 'Polymorphic type schemes for given terms'],
    selfCheck: [
      'Pattern match exhaustiveness considered',
      'Type variables quantified correctly (∀) where claimed',
    ],
    solutionSketch: {
      problemId: 'd1',
      sketch:
        'PL (P2 · Big-step if): write the judgment or reduction sequence; name the rule (T-App, E-Add, …). Add booleans and if e then e else e. Write big-step rules for if-true and if-fal…',
    },

    problems: [
      {
        id: 'd1',
        title: 'P1 · Variants',
        points: 35,
        prompt:
          'Design typed variants for Option[T] = None | Some(T). Give intro/elim typing rules (or match). Type-check: match Some(3) with None → 0 | Some(x) → x+1. Show derivation sketch.',
      },
      {
        id: 'd2',
        title: 'P2 · Parametric id',
        points: 35,
        prompt:
          'Give a polymorphic type for id = λx. x (Hindley–Milner style ∀α. α→α). Instantiate at Bool and at Int→Int. Why is λx. x+1 not polymorphic over all α?',
      },
      {
        id: 'd3',
        title: 'P3 · Parametricity intuition',
        points: 30,
        prompt:
          'In ≤10 sentences: what does parametricity say (informally) about any function of type ∀α. α→α? Name one free theorem idea. Contrast with a monomorphic Int→Int function that can inspect bits.',
      },
    ],
  },
  {
    workId: 'pl-m6-ps',
    timeEstimate: '70 min',
    sources: [{ label: 'PL textbooks — state, aliasing, and effects', kind: 'textbook' }],
    deliverables: ['Store-based evaluation traces', 'Safer interface redesign note'],
    selfCheck: [
      'Aliasing shown with shared locations',
      'Evaluation order effect on side effects made explicit',
    ],
    solutionSketch: {
      problemId: 'st1',
      sketch:
        'PL (P2 · Parametric id): write the judgment or reduction sequence; name the rule (T-App, E-Add, …). Give a polymorphic type for id = λx. x (Hindley–Milner style ∀α. α→α). Instantia…',
    },

    problems: [
      {
        id: 'st1',
        title: 'P1 · Ref trace',
        points: 40,
        prompt:
          'With ML-style refs: let r = ref 0 in let s = r in (r := 1; !s). Trace store σ and result. Then: let r = ref 0 in let s = ref 0 in (r := 1; !s) — contrast. Draw store diagrams.',
      },
      {
        id: 'st2',
        title: 'P2 · Order',
        points: 30,
        prompt:
          'Expression (r:=1; !r) + (r:=2; !r) under left-to-right vs right-to-left operand evaluation (same r). Possible results? Why do pure languages dodge this class of bugs?',
      },
      {
        id: 'st3',
        title: 'P3 · Interface',
        points: 30,
        prompt:
          'API: getBalance(acct) and setBalance(acct,n) on a shared bank map. Show an interleaving of two threads that loses an update. Propose a safer interface (e.g. atomic transfer or compare-and-set) and state the effect boundary you encapsulate.',
      },
    ],
  },
  {
    workId: 'pl-m7-reading',
    timeEstimate: '80 min',
    sources: [
      { label: 'Selected compiler/PL implementation chapters', kind: 'textbook' },
      { label: 'Course notes — language design axes', kind: 'notes' },
    ],
    deliverables: ['Tiny language design memo (1–2 pages)', 'Feature→cost trade-off table'],
    selfCheck: [
      'Syntax, semantics, and types each addressed',
      'Alternatives considered, not only the chosen design',
    ],
    solutionSketch: {
      problemId: 'des1',
      sketch:
        'PL (P2 · Order): write the judgment or reduction sequence; name the rule (T-App, E-Add, …). Expression (r:=1; !r) + (r:=2; !r) under left-to-right vs right-to-left operand …',
    },

    problems: [
      {
        id: 'des1',
        title: 'P1 · Domain & goals',
        points: 25,
        prompt:
          'Propose a tiny language for a concrete domain (e.g. config validation, educational turtle graphics, or query snippets). State 3 non-goals. Who is the user?',
      },
      {
        id: 'des2',
        title: 'P2 · Feature set',
        points: 40,
        prompt:
          'Specify: (i) abstract syntax (5–12 constructs); (ii) evaluation strategy (eager/lazy, pure/effectful); (iii) type discipline (dynamic, STLC-like, or gradual). Justify each against one rejected alternative with a cost/benefit sentence.',
      },
      {
        id: 'des3',
        title: 'P3 · Implementation cost',
        points: 35,
        prompt:
          'Map 4 features to implementation axes (interpreter vs bytecode, GC need, closure representation, error model). Estimate relative complexity (S/M/L). End with a ½-page “why not just embed in Python/JS?” defense.',
      },
    ],
  },
]

export const seMeat: MeatPack[] = [
  {
    workId: 'se-m1-ps',
    timeEstimate: '50 min',
    deliverables: ['Process recommendation memo'],
    selfCheck: ['Risks named, not slogans'],
    solutionSketch: {
      problemId: 's3',
      sketch:
        'DoD sample bullets: code reviewed by ≥1 peer; unit tests for new paths; integration test for happy path; docs updated; feature flag off-by-default; monitoring dashboard link; WCAG AA checklist on primary flow.',
    },
    problems: [
      {
        id: 's1',
        title: 'P1 · Scenario A',
        points: 40,
        prompt:
          'Safety-critical medical device firmware, 8 engineers, IEC 62304-style audit. Recommend process practices (phases, change control) and name ≥3 risks of “agile theater” (ceremonies without evidence).',
      },
      {
        id: 's2',
        title: 'P2 · Scenario B',
        points: 40,
        prompt:
          'Early-stage consumer mobile app, 3 founders, unknown market, 12-week runway. Different recommendation; justify with ≥2 measurable learning goals (e.g. activation %, retention D7).',
      },
      {
        id: 's3',
        title: 'P3 · DoD',
        points: 20,
        prompt:
          'Write a Definition of Done checklist for a user-facing feature (8–12 bullets) including tests, review, and a11y (WCAG 2.2 AA) gates.',
      },
    ],
  },
  {
    workId: 'se-m2-ps',
    timeEstimate: '55 min',
    deliverables: ['Rewritten acceptance criteria'],
    selfCheck: ['Each criterion is testable'],
    solutionSketch: {
      problemId: 'r3',
      sketch:
        'Example NFRs: p95 API latency ≤200ms at 100 RPS; availability ≥99.9% monthly; WCAG 2.2 AA on auth + checkout; error rate ≤0.1%.',
    },
    problems: [
      {
        id: 'r1',
        title: 'P1 · Ambiguity',
        points: 50,
        prompt:
          'Rewrite into testable ACs: “The system should be fast, user-friendly, and secure for all users.” Produce ≥6 criteria with numbers or binary checks (latency ms, WCAG level, auth cases).',
      },
      {
        id: 'r2',
        title: 'P2 · Split',
        points: 30,
        prompt:
          'Separate problem statement vs solution for: “We need a chatbot on the homepage.” List ≥3 problem hypotheses and ≥2 solution options (chatbot is only one).',
      },
      {
        id: 'r3',
        title: 'P3 · NFR',
        points: 20,
        prompt:
          'Add measurable NFRs for latency (p95 ms), availability (%), and accessibility (WCAG 2.2 level). State load assumptions (RPS or concurrent users).',
      },
    ],
  },
  {
    workId: 'se-m4-ps',
    timeEstimate: '60 min',
    deliverables: ['Risk-ranked test plan'],
    selfCheck: ['Not only happy path'],
    solutionSketch: {
      problemId: 't2',
      sketch:
        'Password-reset: unit token TTL, integration email, E2E full flow. 100% coverage ≠ correct oracle. Flakes: timing, shared state.',
    },
    problems: [
      {
        id: 't1',
        title: 'P1 · Feature',
        points: 50,
        prompt:
          'Feature: password reset via email link (token TTL=15 min, single use). List ≥5 risks; map unit/integration/E2E tests; note what not to automate.',
      },
      {
        id: 't2',
        title: 'P2 · Coverage myth',
        points: 25,
        prompt:
          'Why 100% line coverage can still miss critical bugs—give a concrete example (wrong oracle, race, missing branch in auth).',
      },
      {
        id: 't3',
        title: 'P3 · Flakes',
        points: 25,
        prompt:
          'Name two flake sources in UI E2E (timing, shared state, network) and mitigations (wait for role, isolate DB, retry policy ≤2).',
      },
    ],
  },
  {
    workId: 'se-m3-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'Bass et al. Software Architecture in Practice (selected)', kind: 'textbook' }],
    deliverables: ['Module/component diagram with boundaries labeled', 'One ADR in standard template'],
    selfCheck: [
      'Trade-offs named (not only benefits)',
      'ADR has context, decision, and consequences',
    ],
    solutionSketch: {
      problemId: 'd1',
      sketch:
        'SE (P2 · Coverage myth): give measurable numbers (counts, ms, %) or a 3-part ADR (context/decision/consequences). Feature: password reset via email link (token TTL=15 min, single use). List ≥5 r…',
    },

    problems: [
      {
        id: 'd1',
        title: 'P1 · System sketch',
        points: 35,
        prompt:
          'System: campus lost-and-found web app (report item, search, claim, staff moderate). Draw a module diagram (≥5 modules) with trust boundaries (browser, app server, DB, email). Mark coupling hotspots.',
      },
      {
        id: 'd2',
        title: 'P2 · ADR',
        points: 40,
        prompt:
          'Write one ADR: “Sync REST monolith vs separate search service for item search.” Use sections Context / Decision / Status / Consequences (good and bad). Decision may go either way if justified.',
      },
      {
        id: 'd3',
        title: 'P3 · API boundary',
        points: 25,
        prompt:
          'Specify 4 public endpoints (method + path + auth note) for claim flow. State one non-goal the API deliberately does not support and why (scope control).',
      },
    ],
  },
  {
    workId: 'se-m5-ps',
    timeEstimate: '65 min',
    sources: [{ label: 'Industry engineering handbooks (public) selected', kind: 'other' }],
    deliverables: ['Review comments on the sample patch', 'CI gate proposal for a 4-person team'],
    selfCheck: [
      'Review comments are actionable and kind',
      'CI gates distinguish blocking vs informative',
    ],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'SE (P2 · ADR): give measurable numbers (counts, ms, %) or a 3-part ADR (context/decision/consequences). Write one ADR: “Sync REST monolith vs separate search service for item search.” …',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · Code review',
        points: 40,
        prompt:
          'Patch narrative: PR adds password reset; stores reset tokens as plaintext in DB; email send is inline in request thread; no rate limit; tests only happy path. Write ≥6 review comments (severity: severity + location + ask). Include one praise if anything is sound.',
      },
      {
        id: 'c2',
        title: 'P2 · CI gates',
        points: 35,
        prompt:
          'Propose a CI pipeline for this team: list stages (lint, unit, integration, security scan, deploy preview). Mark each required-to-merge vs optional. Justify omitting full E2E on every commit.',
      },
      {
        id: 'c3',
        title: 'P3 · Debt order',
        points: 25,
        prompt:
          'Given debt items: (A) no token hashing, (B) flaky UI test suite, (C) inconsistent folder naming, (D) missing runbooks. Order paydown for the next sprint and justify with risk (not aesthetics).',
      },
    ],
  },
  {
    workId: 'se-m6-ps',
    timeEstimate: '70 min',
    sources: [
      { label: 'SE process chapters — teams & project management', kind: 'textbook' },
      { label: 'Public postmortem exemplars', kind: 'other' },
    ],
    deliverables: ['Risk register table', 'Blameless postmortem outline'],
    selfCheck: [
      'Risks have likelihood × impact and owners',
      'Postmortem focuses on systems, not individuals',
    ],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'SE (P2 · CI gates): give measurable numbers (counts, ms, %) or a 3-part ADR (context/decision/consequences). Propose a CI pipeline for this team: list stages (lint, unit, integration, secur…',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Risk register',
        points: 40,
        prompt:
          'Project: 6-week team builds the lost-and-found app for a campus club. Create a risk register with ≥6 rows: risk, likelihood (L/M/H), impact (L/M/H), mitigation, owner role, trigger. Include at least one people risk and one technical risk.',
      },
      {
        id: 'r2',
        title: 'P2 · Postmortem',
        points: 40,
        prompt:
          'Fictional outage: deploy Friday 5pm; reset-email job deadlocks DB; queue backs up; users cannot log in for 90 minutes. Write a blameless postmortem outline: summary, timeline (≥5 events), root cause(s), what went well, action items with owners.',
      },
      {
        id: 'r3',
        title: 'P3 · Estimation humility',
        points: 20,
        prompt:
          'The team estimated “auth in 3 days.” It took 8. List 3 uncertainty sources and a process change (e.g. spike, buffer, slice) for the next feature. ≤8 sentences.',
      },
    ],
  },
  {
    workId: 'se-m7-project-plan',
    timeEstimate: '90 min',
    sources: [{ label: 'SE textbook — maintenance, evolution, project framing', kind: 'textbook' }],
    deliverables: [
      'Capstone plan document (problem, milestones, risks, tests, DoD)',
      'API evolution note with compatibility constraints',
    ],
    selfCheck: [
      'Milestones are time-bounded and testable',
      'DoD is checklist-form, not slogans',
    ],
    solutionSketch: {
      problemId: 'p1',
      sketch:
        'Networks (P2 · Postmortem): plug numbers into L/R or d/s or cwnd rules; state units. Fictional outage: deploy Friday 5pm; reset-email job deadlocks DB; queue backs u…',
    },

    problems: [
      {
        id: 'p1',
        title: 'P1 · Scope & milestones',
        points: 35,
        prompt:
          'Using the lost-and-found domain (or your own approved scope), write: problem statement, out-of-scope list, and 4 milestones over 6 weeks each with a demoable outcome. Name team roles (even if solo, list hats).',
      },
      {
        id: 'p2',
        title: 'P2 · Test strategy & DoD',
        points: 35,
        prompt:
          'Produce a test strategy (unit/integration/E2E boundaries + top risks) and a Definition of Done checklist (8–12 bullets) covering code, tests, docs, and deployability. Link DoD items to milestone 2 explicitly.',
      },
      {
        id: 'p3',
        title: 'P3 · Evolution',
        points: 30,
        prompt:
          'API v1 has GET /items?q=. You need richer filters and pagination without breaking an existing mobile client for 90 days. Plan versioning/deprecation (URL or header), compatibility tests, and observability signals you would watch after deploy.',
      },
    ],
  },
]

/** Lab meat for instrumented assignments */
export const labMeat: MeatPack[] = [
  {
    workId: 'm1-inversions-lab',
    timeEstimate: '45–60 min',
    sources: [{ label: 'CLRS Ch. 2 (insertion sort analysis)', kind: 'textbook' }],
    deliverables: [
      'Table: array snapshot + compare counts for insertion and bubble (shuffled + nearly-sorted)',
      '3–5 sentence claim linking inversions/disorder to compare work',
    ],
    selfCheck: [
      'Identical arrays used for both algorithms in each regime',
      'Metrics are compare counts (not wall-clock steps alone)',
    ],
    solutionSketch: {
      problemId: 'l1',
      sketch:
        'SE (P2 · Test strategy & DoD): give measurable numbers (counts, ms, %) or a 3-part ADR (context/decision/consequences). Produce a test strategy (unit/integration/E2E boundaries + top risks) and a Defi…',
    },

    problems: [
      {
        id: 'l1',
        title: 'P1 · Setup',
        points: 20,
        prompt:
          'Open the assignment lab: insertion vs bubble, n=16, compare mode, reference engine. Record the array after one shuffle (or reshuffle thrice and pick one fixed array). Write the 16 values.',
      },
      {
        id: 'l2',
        title: 'P2 · Metrics',
        points: 40,
        prompt:
          'On that same array, dual-run and record compare counts for insertion and bubble. Then create a nearly-sorted regime (e.g. sorted array with 1–2 adjacent swaps) and repeat. Build a 2×2 table of (algo × regime).',
      },
      {
        id: 'l3',
        title: 'P3 · Claim',
        points: 40,
        prompt:
          'Write a claim linking disorder/inversions to compare work. In your trials, does bubble ever beat insertion on compares? Relate to insertion’s best-case Θ(n) on sorted input.',
      },
    ],
  },
  {
    workId: 'm2-adaptive-lab',
    timeEstimate: '45–60 min',
    sources: [{ label: 'CLRS Ch. 2 (insertion sort; adaptive behavior)', kind: 'textbook' }],
    deliverables: [
      'Compare-count table for ≥3 input families at n=20',
      'Paragraph explaining which algorithm is adaptive and why',
    ],
    selfCheck: [
      'Same n=20 and identical arrays within each family for insertion vs bubble',
      'At least one nearly-sorted and one reverse-sorted (or high-disorder) family',
    ],
    solutionSketch: {
      problemId: 'ad1',
      sketch:
        'Systems/OS (P1 · Setup): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. Open the assignment lab: insertion vs bubble, n=16, compare mode, reference engi…',
    },

    problems: [
      {
        id: 'ad1',
        title: 'P1 · Families',
        points: 25,
        prompt:
          'Open adaptive lab: insertion vs bubble, n=20, compare mode, reference. Construct three fixed arrays of length 20: (A) fully reverse-sorted [20..1], (B) already sorted [1..20], (C) one random shuffle you record. List all three arrays.',
      },
      {
        id: 'ad2',
        title: 'P2 · Dual metrics',
        points: 40,
        prompt:
          'For each family A/B/C, dual-run insertion and bubble on the identical array. Record compare counts (and swaps if shown). Tabulate 3 families × 2 algorithms.',
      },
      {
        id: 'ad3',
        title: 'P3 · Adaptivity claim',
        points: 35,
        prompt:
          'Which algorithm’s compare count collapses on sorted input B? Explain with insertion’s early-exit / inversion structure. Is bubble adaptive in the same sense on your data? ≤8 sentences.',
      },
    ],
  },
  {
    workId: 'm2-implement-insertion',
    timeEstimate: '50–75 min',
    sources: [{ label: 'CLRS Ch. 2 (INSERTION-SORT)', kind: 'textbook' }],
    deliverables: [
      'Python insertion sort using only lab compare/swap hooks',
      'Validation note: matches reference on ≥3 arrays of n≈10–16',
    ],
    selfCheck: [
      'No direct a[i]<a[j] outside hooks; all ordering goes through compare',
      'Stable insertion: equal keys keep relative order on a deliberate test',
    ],
    solutionSketch: {
      problemId: 'ii1',
      sketch:
        'Systems/OS (P1 · Families): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. Open adaptive lab: insertion vs bubble, n=20, compare mode, reference. Construct…',
    },

    problems: [
      {
        id: 'ii1',
        title: 'P1 · Hook contract',
        points: 25,
        prompt:
          'Open implementation lab: insertion, Python mode, n=12. State the compare/swap hook API the template exposes. Hand-trace insertion on [5,2,4,6,1,3] listing each compare and swap until sorted.',
      },
      {
        id: 'ii2',
        title: 'P2 · Implement',
        points: 45,
        prompt:
          'Implement instrumented insertion sort so every ordering decision uses hooks. Run against the reference engine on a shuffled n=12 array and on [3,1,4,1,5,9,2,6]. Record final arrays and whether metrics match reference behavior.',
      },
      {
        id: 'ii3',
        title: 'P3 · Stability check',
        points: 30,
        prompt:
          'Using equal keys (e.g. pairs (key,tag): (2,a),(1,x),(2,b),(1,y)), argue whether your insertion keeps (2,a) before (2,b). If the lab only shows bare ints, describe the tag experiment on paper with the same compare order.',
      },
    ],
  },
  {
    workId: 'm3-asymptotic-lab',
    timeEstimate: '50–70 min',
    sources: [{ label: 'CLRS Ch. 2 & 4 (insertion, mergesort)', kind: 'textbook' }],
    deliverables: [
      'Growth table for n∈{12,24,32}: compares for insertion and merge',
      'Normalized ratios compares/n² and compares/(n log n) with a growth claim',
    ],
    selfCheck: [
      'Compare counts used (not wall-clock) for asymptotic discussion',
      'Same array family policy stated when reshaping at each n',
    ],
    solutionSketch: {
      problemId: 'a1',
      sketch:
        'Systems/OS (P1 · Dual run): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. Open asymptotic lab: insertion vs merge, compare mode, reference. For n=12, 24, …',
    },

    problems: [
      {
        id: 'a1',
        title: 'P1 · Dual run',
        points: 30,
        prompt:
          'Open asymptotic lab: insertion vs merge, compare mode, reference. For n=12, 24, and 32, reshape a shuffled array each size and record compare counts for both algorithms.',
      },
      {
        id: 'a2',
        title: 'P2 · Growth',
        points: 40,
        prompt:
          'Compute ratios compares(n)/n² and compares(n)/(n log₂ n) for both algorithms at each n. Which ratio stabilizes for insertion? For merge? State a one-sentence growth claim.',
      },
      {
        id: 'a3',
        title: 'P3 · Caveat',
        points: 30,
        prompt:
          'List two reasons wall-clock timing on a laptop would mislead asymptotic conclusions even when merge “wins” at n=32 (constants, caches, language, interpreter noise).',
      },
    ],
  },
  {
    workId: 'm3-implement-merge',
    timeEstimate: '60–90 min',
    sources: [{ label: 'CLRS Ch. 2 & 4 (mergesort)', kind: 'textbook' }],
    deliverables: [
      'Python mergesort with explicit divide → conquer → combine via hooks',
      'Trace of one full merge of two sorted runs (e.g. [1,4,7] and [2,3,8])',
    ],
    selfCheck: [
      'Base case n≤1 correct; no off-by-one in mid = ⌊(lo+hi)/2⌋ style split',
      'Matches reference on shuffled n=12 and on reverse-sorted [12..1]',
    ],
    solutionSketch: {
      problemId: 'im1',
      sketch:
        'Merge structure: divide mid, recurse, combine sorted halves. Instrumentation should count compares in merge; validate vs reference on fixed array.',
    },

    problems: [
      {
        id: 'im1',
        title: 'P1 · Structure',
        points: 25,
        prompt:
          'Open merge implementation lab: algo=merge, Python mode, n=12. Sketch the recursion tree for n=8 (how many merge calls at each level?). State the mergesort recurrence T(n)=2T(n/2)+Θ(n).',
      },
      {
        id: 'im2',
        title: 'P2 · Implement + validate',
        points: 45,
        prompt:
          'Complete the mergesort template so compare/swap (or merge) hooks drive the visualizer. Validate against reference on a shuffled n=12 array and on [9,1,8,2,7,3,6,4,5,0,11,10]. Report pass/fail and final sorted order.',
      },
      {
        id: 'im3',
        title: 'P3 · Merge step',
        points: 30,
        prompt:
          'Hand-simulate merging sorted runs L=[1,4,7,9] and R=[0,2,3,8] into an output buffer: list each compare and the output array after each pick. How many compares in the worst case for |L|+|R|=n?',
      },
    ],
  },
  {
    workId: 'm6-empirical-study',
    timeEstimate: '2–3 hr',
    sources: [
      { label: 'CLRS Ch. 2 & 4 (sorting analysis)', kind: 'textbook' },
      {
        label: 'MIT OCW 6.006 — sorting unit',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      },
    ],
    deliverables: [
      'Lab-report write-up (≤2 pages): method, tables, plots optional, theory interpretation',
      'Raw data table: ≥2 algorithms × ≥3 regimes × ≥2 sizes (baseline insertion vs merge)',
    ],
    selfCheck: [
      'Fair comparison: identical inputs for dual-run pairs; compare counts primary',
      'Conclusions separate empirical observation from asymptotic proof',
    ],
    solutionSketch: {
      problemId: 'e1',
      sketch:
        'Map new/ready/running/blocked/terminated → backlog/ready/doing/blocked/done. Metaphor fails: multi-person, no single CPU.',
    },

    problems: [
      {
        id: 'e1',
        title: 'P1 · Design',
        points: 20,
        prompt:
          'Open empirical bake-off lab: insertion vs merge, compare mode, reference, baseline n=28. Write a protocol: algorithms (≥2), regimes (shuffled, nearly-sorted, reverse), sizes (e.g. n∈{16,28} or {16,24,32}), and primary metric (compares).',
      },
      {
        id: 'e2',
        title: 'P2 · Collect data',
        points: 40,
        prompt:
          'Execute the protocol. For each cell (algo, regime, n) record compare counts (repeat reshuffle 2–3 times if seedless and report min/median). Deliver a complete data table. Flag any anomalous run.',
      },
      {
        id: 'e3',
        title: 'P3 · Interpret with theory',
        points: 40,
        prompt:
          'Relate tables to Θ(n²) vs Θ(n log n): where does insertion win or nearly tie? Where does merge dominate? Include one caveat (constants, adaptive best case, implementation). End with a 5-sentence examiner-ready conclusion.',
      },
    ],
  },
  {
    workId: 'alg-m4-bfs-dfs-lab',
    timeEstimate: '40–55 min',
    sources: [
      { label: 'CLRS Ch. 22 (BFS/DFS)', kind: 'textbook' },
      {
        label: 'MIT OCW 6.006 graph unit',
        kind: 'ocw',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      },
    ],
    deliverables: [
      'BFS and DFS expansion orders, paths, and hop lengths on City A→F',
      'Short write-up: FIFO vs LIFO frontiers and hop-optimality',
    ],
    selfCheck: [
      'Same graph (city-6), start A, goal F for both runs',
      'Expansion order listed node-by-node, not only the final path',
    ],
    solutionSketch: {
      problemId: 'g1',
      sketch:
        'Settle order: extract-min from priority queue; final dist labels. Path cost = sum of weights, not hop count.',
    },

    problems: [
      {
        id: 'g1',
        title: 'P1 · BFS',
        points: 35,
        prompt:
          'Open graph lab preconfigured: City A→F, BFS (graphId city-6). Run to completion. List expansion order, the path returned, and hop length (number of edges).',
      },
      {
        id: 'g2',
        title: 'P2 · DFS',
        points: 35,
        prompt:
          'Switch to DFS with the same start A and goal F on City. List expansion order, path, and hop length. Note any nodes expanded that BFS did not need.',
      },
      {
        id: 'g3',
        title: 'P3 · Theory',
        points: 30,
        prompt:
          'Which path is hop-optimal? Explain using FIFO (queue) vs LIFO (stack) frontiers. Are BFS and DFS complete on finite undirected graphs with a visited set? ≤8 sentences.',
      },
    ],
  },
  {
    workId: 'alg-m4-dijkstra-lab',
    timeEstimate: '40–55 min',
    sources: [{ label: 'CLRS Ch. 24 (single-source shortest paths)', kind: 'textbook' }],
    deliverables: [
      'Dijkstra settle order and final A→F path cost on City weighted graph',
      'Paper counterexample: 3-node graph with a negative edge breaking Dijkstra',
    ],
    selfCheck: [
      'All City edge weights treated as non-negative in the lab run',
      'At least one relaxation that improved a tentative distance is recorded',
    ],
    solutionSketch: {
      problemId: 'd1',
      sketch:
        'Algorithms (P1 · Trace): run the named algorithm on the given instance; record order/distances; give Θ where asked. Run Dijkstra A→F on City (graphId city-6, graphAlgo dijkstra). Record settle ord…',
    },

    problems: [
      {
        id: 'd1',
        title: 'P1 · Trace',
        points: 40,
        prompt:
          'Run Dijkstra A→F on City (graphId city-6, graphAlgo dijkstra). Record settle order and final path cost. List one edge relaxation that improved a distance label (before→after).',
      },
      {
        id: 'd2',
        title: 'P2 · Negative edge',
        points: 35,
        prompt:
          'On paper: draw a 3-node directed graph with a negative-weight edge where Dijkstra’s settle-order invariant fails (wrong shortest-path distances). Explain the failure in ≤6 sentences.',
      },
      {
        id: 'd3',
        title: 'P3 · Compare BFS',
        points: 25,
        prompt:
          'On unit-weight graphs, how does Dijkstra relate to BFS? Answer in ≤6 sentences using a City unit-weights thought experiment (every edge weight = 1).',
      },
    ],
  },
  {
    workId: 'ds-m4-lab',
    timeEstimate: '35 min',
    sources: [{ label: 'Berkeley 61B — BSTs', kind: 'curriculum' }],
    deliverables: ['Two tree sketches', 'Height comparison paragraph'],
    selfCheck: ['Inorder is sorted for both', 'structureDemo bst-insert used'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'RR q=2: slice log P1,P2,…; count switches until done. Response time for P4 improves vs FCFS.',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · Balanced-ish',
        points: 40,
        prompt: 'BST insert 7,3,11,1,9,5: final tree height and inorder.',
      },
      {
        id: 't2',
        title: 'P2 · Spine',
        points: 40,
        prompt: 'Insert 1,2,3,4,5,6: height? Search cost for 6?',
      },
      {
        id: 't3',
        title: 'P3 · Fix',
        points: 20,
        prompt: 'Name one balanced BST family and what invariant prevents spines.',
      },
    ],
  },
  {
    workId: 'os-m3-lab-rr',
    timeEstimate: '35 min',
    sources: [{ label: 'OSTEP — scheduling', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Slice table matching lab', 'Policy comparison notes'],
    selfCheck: ['Quantum 2', 'systemsDemo schedule-rr; same 4-job instance'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'linreg GD: m,b path; loss should trend down if η small. Squared loss sensitive to outliers (one far point pulls line).',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Slices',
        points: 40,
        prompt: 'From RR lab q=2 on P1..P4: list all [start,end) slices in order.',
      },
      {
        id: 'r2',
        title: 'P2 · Compare',
        points: 35,
        prompt: 'Who finishes first under RR vs FCFS lab? Response-time intuition for short P4?',
      },
      {
        id: 'r3',
        title: 'P3 · Quantum',
        points: 25,
        prompt: 'If quantum were q=1, how would the Gantt change qualitatively (more switches)? Trade-off vs q=∞ (FCFS)?',
      },
    ],
  },
  {
    workId: 'ml-m2-lab',
    timeEstimate: '30 min',
    deliverables: ['Epoch table'],
    selfCheck: ['Toy data only'],
    solutionSketch: {
      problemId: 'm1',
      sketch:
        'Systems/OS (P3 · Quantum): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. If quantum were q=1, how would the Gantt change qualitatively (more switches)? T…',
    },

    problems: [
      {
        id: 'm1',
        title: 'P1 · Record',
        points: 40,
        prompt: 'linreg-1d lab: record m and b at epochs 0, 4, 8, and 12 in a table.',
      },
      {
        id: 'm2',
        title: 'P2 · Interpret',
        points: 35,
        prompt: 'Does the fit line approach the cloud of points? What would a too-large learning rate η do?',
      },
      {
        id: 'm3',
        title: 'P3 · Loss',
        points: 25,
        prompt: 'Why is squared loss sensitive to outliers? Give a one-point outlier thought experiment.',
      },
    ],
  },
  {
    workId: 'ml-m3-lab',
    timeEstimate: '30 min',
    deliverables: ['Separability answer'],
    selfCheck: ['Client-side toy expectations'],
    solutionSketch: {
      problemId: 'p1',
      sketch:
        'BFS expansion order; optimal path length in hops on unweighted graph.',
    },

    problems: [
      {
        id: 'p1',
        title: 'P1 · Separability',
        points: 40,
        prompt: 'Is the perceptron toy set linearly separable? Cite evidence from the lab animation.',
      },
      {
        id: 'p2',
        title: 'P2 · Equation',
        points: 35,
        prompt: 'Estimate final boundary w·x+b=0 from the visualization (approximate coefficients OK).',
      },
      {
        id: 'p3',
        title: 'P3 · Failure mode',
        points: 25,
        prompt: 'Describe a 2D dataset where a linear boundary cannot achieve zero training error.',
      },
    ],
  },
  {
    workId: 'ai-m2-lab-bfs',
    timeEstimate: '40 min',
    sources: [{ label: 'AIMA — uninformed search', kind: 'textbook' }],
    deliverables: ['Expansion order tables', 'Path comparison paragraph'],
    selfCheck: ['Same Ladder graph S→G for both BFS and DFS', 'Tie-break order recorded'],
    solutionSketch: {
      problemId: 'bf1',
      sketch:
        'A* with consistent heuristic; f=g+h; compare expansion count to BFS.',
    },

    problems: [
      {
        id: 'bf1',
        title: 'P1 · BFS trace',
        points: 35,
        prompt:
          'Open graphs lab: Ladder/grid-ish graph, algo=bfs, start=S, goal=G (config graphId grid-ish). Record BFS expansion (or dequeue) order and the path S↝G with hop length.',
      },
      {
        id: 'bf2',
        title: 'P2 · DFS trace',
        points: 35,
        prompt:
          'Switch to DFS on the identical graph and terminals. Record expansion order and path. Does DFS find a shortest hop path here? Why/why not?',
      },
      {
        id: 'bf3',
        title: 'P3 · Completeness',
        points: 30,
        prompt:
          'In ≤6 sentences: completeness and optimality of BFS vs DFS on finite unweighted graphs. Reference your traces (e.g. which expanded more nodes before goal).',
      },
    ],
  },
  {
    workId: 'ai-m2-lab-astar',
    timeEstimate: '50 min',
    sources: [
      { label: 'AIMA — informed search', kind: 'textbook' },
      { label: 'Berkeley CS 188 — search (concepts)', kind: 'curriculum' },
    ],
    deliverables: ['Dijkstra vs A* expansion lists', 'Heuristic critique essay (≤½ page)'],
    selfCheck: ['City graph A→F for both runs', 'Did not treat layout Euclidean h as domain-optimal without argument'],
    solutionSketch: {
      problemId: 'as1',
      sketch:
        'Assign→update until centers stable; k choice via elbow/silhouette (toy). Sensitive to init.',
    },

    problems: [
      {
        id: 'as1',
        title: 'P1 · Dijkstra',
        points: 30,
        prompt:
          'graphs lab: city-6, Dijkstra (or UCS), A→F. List expanded/settled nodes in order and final path cost.',
      },
      {
        id: 'as2',
        title: 'P2 · A*',
        points: 35,
        prompt:
          'Same graph A→F with A*. List expanded nodes and path cost. Did A* expand fewer nodes than Dijkstra here? Same path cost?',
      },
      {
        id: 'as3',
        title: 'P3 · Heuristic essay',
        points: 35,
        prompt:
          '≤½ page: the lab’s layout Euclidean h is a teaching toy. When is Euclidean admissible for pathfinding? Why might it be only approximately meaningful on this abstract city graph?',
      },
    ],
  },
  {
    workId: 'ml-m8-lab-kmeans',
    timeEstimate: '40 min',
    sources: [{ label: 'ISL — unsupervised / clustering chapters', kind: 'textbook' }],
    deliverables: ['Centroid table over iterations', 'Compare to supervised lab note'],
    selfCheck: ['k=2 on fixed 2D demo only', 'Assign then update order respected'],
    solutionSketch: {
      problemId: 'k1',
      sketch:
        'Assign points to nearest center; update means; stop when centers stable. k choice: elbow of inertia. Sensitive to init — try multiple seeds.',
    },

    problems: [
      {
        id: 'km1',
        title: 'P1 · Init & step',
        points: 35,
        prompt:
          'ml lab config mlDemo=kmeans-2d, k=2. Record initial centroids (or first shown). After one assign step, list which points belong to each cluster (by eye/coords). After one update, record new centroids.',
      },
      {
        id: 'km2',
        title: 'P2 · Convergence',
        points: 35,
        prompt:
          'Step until centroids stop moving (or 5 iterations). Tabulate centroid coordinates each iteration. Did any point flip clusters late? Final within-cluster SSE qualitative comment.',
      },
      {
        id: 'km3',
        title: 'P3 · Supervised contrast',
        points: 30,
        prompt:
          'Contrast this lab with M3 decision-boundary lab: what is missing (labels, loss, generalization)? One sentence on a failure mode of k-means (k wrong, non-spherical clusters, init sensitivity).',
      },
    ],
  },
  {
    workId: 'sys-m4-lab-cache',
    timeEstimate: '40 min',
    sources: [{ label: 'CSAPP — cache chapters', kind: 'textbook' }],
    deliverables: ['Hit/miss table for the address stream', 'Conflict-miss identification'],
    selfCheck: ['Used cache-direct demo', 'line=(addr/4) mod 4 model'],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'For P1 · Stream: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · Stream',
        points: 40,
        prompt:
          'systemsDemo cache-direct. Address stream [0,4,8,0,16,4,20,8,0]. For each access record HIT/MISS and final tag in the touched line.',
      },
      {
        id: 'c2',
        title: 'P2 · Hit rate',
        points: 30,
        prompt: 'Compute hit rate. Which misses are cold (first use of a line) vs conflict (tag replace)?',
      },
      {
        id: 'c3',
        title: 'P3 · Design',
        points: 30,
        prompt: 'If we doubled lines to 8, which conflict might disappear? Answer with one concrete address pair from the stream.',
      },
    ],
  },
  {
    workId: 'ai-m2-lab-campus',
    timeEstimate: '40 min',
    sources: [{ label: 'AIMA — uninformed search', kind: 'textbook' }],
    deliverables: ['BFS hop path + Dijkstra cost path'],
    selfCheck: ['graphId=campus Gate→Lab'],
    solutionSketch: {
      problemId: 'cp1',
      sketch:
        'Leaves up; min then max; root value 3 choose left. Alpha-beta can skip some right branches.',
    },

    problems: [
      {
        id: 'cp1',
        title: 'P1 · BFS',
        points: 35,
        prompt: 'Campus graph BFS Gate→Lab: expansion order and hop path length.',
      },
      {
        id: 'cp2',
        title: 'P2 · Dijkstra',
        points: 35,
        prompt: 'Same terminals Dijkstra: path and total weight. Does it match BFS hops?',
      },
      {
        id: 'cp3',
        title: 'P3 · When they differ',
        points: 30,
        prompt: 'When do unit-weight BFS and Dijkstra agree? Cite this campus instance.',
      },
    ],
  },
  {
    workId: 'ai-m5-lab-minimax',
    timeEstimate: '35 min',
    sources: [{ label: 'AIMA — adversarial search', kind: 'textbook' }],
    deliverables: ['Node values B,C,A + action'],
    selfCheck: ['Leaf order 3,12 under B and 8,2 under C'],
    solutionSketch: {
      problemId: 'mm1',
      sketch:
        'For P1 · Bottom-up: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'mm1',
        title: 'P1 · Bottom-up',
        points: 40,
        prompt: 'minimax-tree lab: compute B=min(3,12), C=min(8,2), A=max(B,C). Confirm lab animation.',
      },
      {
        id: 'mm2',
        title: 'P2 · Action',
        points: 30,
        prompt: 'Which first move does max choose? What is the optimal value?',
      },
      {
        id: 'mm3',
        title: 'P3 · Alpha-beta',
        points: 30,
        prompt: 'On paper (same tree L→R): which leaf comparisons can alpha-beta skip? Brief argument.',
      },
    ],
  },
  {
    workId: 'ml-m1-lab-curves',
    timeEstimate: '30 min',
    sources: [{ label: 'ISL / CS229 generalization', kind: 'curriculum', url: 'https://cs229.stanford.edu/' }],
    deliverables: ['k* at best test + region labels'],
    selfCheck: ['Cartoon only — not real CV'],
    solutionSketch: {
      problemId: 'tc1',
      sketch:
        'Campus BFS Gate→Lab path; |E_path|=hops; path vs walk (no repeated vertices vs allow).',
    },

    problems: [
      {
        id: 'tc1',
        title: 'P1 · Regions',
        points: 35,
        prompt: 'train-test-curves lab: for k=1,5,10 state whether underfit / sweet spot / overfit per the metrics line.',
      },
      {
        id: 'tc2',
        title: 'P2 · Choose k',
        points: 35,
        prompt: 'Which k minimizes test error in the cartoon? Would you pick lower train error at k=10? Why not?',
      },
      {
        id: 'tc3',
        title: 'P3 · Reality',
        points: 30,
        prompt: 'Name two reasons real learning curves differ from this sketch (noise, non-monotonic capacity, data size).',
      },
    ],
  },
  {
    workId: 'dm-m5-lab',
    timeEstimate: '30 min',
    sources: [{ label: 'Rosen — graphs', kind: 'textbook' }],
    deliverables: ['Path + edge count'],
    selfCheck: ['Campus Gate→Lab BFS'],
    solutionSketch: {
      problemId: 'g1',
      sketch:
        '01001: three 0s → odd → REJECT. Table (i,sym,before,after). Odd #1s DFA tracks parity of 1s instead.',
    },

    problems: [
      {
        id: 'g1',
        title: 'P1 · Path',
        points: 40,
        prompt: 'Campus BFS Gate→Lab: write the vertex sequence of a shortest hop path.',
      },
      {
        id: 'g2',
        title: 'P2 · Counts',
        points: 30,
        prompt: 'How many edges on that path? How many vertices?',
      },
      {
        id: 'g3',
        title: 'P3 · Definition',
        points: 30,
        prompt: 'In ≤4 sentences: define path vs walk using your example (no repeated vertices vs allowing).',
      },
    ],
  },
  {
    workId: 'toc-m1-lab',
    timeEstimate: '30 min',
    sources: [{ label: 'Sipser Ch. 1', kind: 'textbook' }],
    deliverables: ['State trace table'],
    selfCheck: ['Input 01001'],
    solutionSketch: {
      problemId: 'd2',
      sketch:
        'Client→R1→R2→Server cumulative t; R2 prop dominates in toy. Link L/R and d/s formulas.',
    },
    problems: [
      {
        id: 'd1',
        title: 'P1 · Trace',
        points: 40,
        prompt: 'dfa-even0 lab on 01001: fill table (i, symbol, state before, state after).',
      },
      {
        id: 'd2',
        title: 'P2 · Accept',
        points: 30,
        prompt: 'Does the DFA accept? Count of zeros = ? Is that even?',
      },
      {
        id: 'd3',
        title: 'P3 · Design',
        points: 30,
        prompt: 'Modify mentally for odd number of 1s: which state should be accepting? One-sentence justification.',
      },
    ],
  },
  {
    workId: 'net-m1-lab',
    timeEstimate: '30 min',
    sources: [{ label: 'Kurose & Ross Ch. 1', kind: 'textbook' }],
    deliverables: ['Cumulative delay log'],
    selfCheck: ['network-path demo'],
    solutionSketch: {
      problemId: 'n1',
      sketch:
        'Eval order leaves then + then *; value 20. Big-step: ⊢ 2+3 ⇓ 5 under empty env.',
    },

    problems: [
      {
        id: 'n1',
        title: 'P1 · Hops',
        points: 40,
        prompt: 'network-path lab: list nodes in order and cumulative t after each arrival.',
      },
      {
        id: 'n2',
        title: 'P2 · Dominant term',
        points: 30,
        prompt: 'Which hop adds more delay, R1 or R2? tx vs prop — which dominates on R2?',
      },
      {
        id: 'n3',
        title: 'P3 · Paper link',
        points: 30,
        prompt: 'Relate this toy to transmission vs propagation formulas in net-m1-ps (L/R and d/s).',
      },
    ],
  },
  {
    workId: 'pl-m1-lab',
    timeEstimate: '30 min',
    sources: [{ label: 'PLAI / EOPL selected', kind: 'textbook' }],
    deliverables: ['Eval order notes'],
    selfCheck: ['(2+3)*4 → 20'],
    solutionSketch: {
      problemId: 'e1',
      sketch:
        'Theory (P1 · Trace): draw automaton or write production; test ε + one accept + one reject; state the formal claim. dfa-ends01 on 11001: table (i, symbol, state before, state after) for all symbol…',
    },

    problems: [
      {
        id: 'e1',
        title: 'P1 · Order',
        points: 40,
        prompt: 'pl-eval-tree lab for (2+3)*4: list values computed in order (leaves first), ending at 20.',
      },
      {
        id: 'e2',
        title: 'P2 · Result',
        points: 30,
        prompt: 'Final program value? Show  (2+3)*4 arithmetic.',
      },
      {
        id: 'e3',
        title: 'P3 · Big-step',
        points: 30,
        prompt: 'Write one big-step judgment for the + node (environment empty).',
      },
    ],
  },
  {
    workId: 'se-m1-lab',
    timeEstimate: '25 min',
    sources: [{ label: 'Sommerville — process', kind: 'textbook' }],
    deliverables: ['State map table'],
    selfCheck: ['Metaphor only — not Jira'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        'Mergesort n=8: log₂8=3 levels; each level Θ(n) merge; T(n)=2T(n/2)+cn case 2 Master.',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · Map',
        points: 40,
        prompt:
          'process-lifecycle lab: map OS states new/ready/running/blocked/terminated to work-item states (e.g. backlog, ready, in-progress, blocked, done).',
      },
      {
        id: 's2',
        title: 'P2 · Blocked',
        points: 30,
        prompt:
          'Give one real team reason a ticket is “blocked” analogous to I/O wait (e.g. waiting on external API or review). Map to process-lifecycle blocked state.',
      },
      {
        id: 's3',
        title: 'P3 · Limits',
        points: 30,
        prompt:
          'Why the process-lifecycle metaphor fails for SE (≥2 reasons): e.g. parallel work, no single CPU, multi-person ownership. State each as a concrete counterexample.',
      },
    ],
  },
  {
    workId: 'db-m4-lab',
    timeEstimate: '35 min',
    sources: [{ label: 'DB textbook — B+ trees', kind: 'textbook' }],
    deliverables: ['Leaf contents after each insert batch'],
    selfCheck: ['bplus-insert toy — leaves only'],
    solutionSketch: {
      problemId: 'b1',
      sketch:
        'Algorithms (P1 · Pack): run the named algorithm on the given instance; record order/distances; give Θ where asked. bplus-insert values [10,20,5,30,15,25,35], order 3: after all inserts, list each…',
    },

    problems: [
      {
        id: 'b1',
        title: 'P1 · Pack',
        points: 40,
        prompt: 'bplus-insert values [10,20,5,30,15,25,35], order 3: after all inserts, list each leaf’s keys.',
      },
      {
        id: 'b2',
        title: 'P2 · Split',
        points: 30,
        prompt: 'At which insert did a new leaf appear? Why (max keys = 3)?',
      },
      {
        id: 'b3',
        title: 'P3 · Honesty',
        points: 30,
        prompt: 'Name two B+ features missing from this toy (internal nodes, fanout, root splits).',
      },
    ],
  },
  // --- Wave: promote Partial→Live (3 more labs each on 6 courses) ---
  {
    workId: 'dm-m5-lab-dfs',
    timeEstimate: '30 min',
    sources: [{ label: 'Rosen — graphs', kind: 'textbook' }],
    deliverables: ['Discovery order list', 'Reachability set'],
    selfCheck: ['DFS not BFS', 'Campus graph'],
    solutionSketch: {
      problemId: 'd1',
      sketch:
        'Algorithms (P1 · Discovery): run the named algorithm on the given instance; record order/distances; give Θ where asked. Campus DFS from Gate: write the discovery order of vertices as the lab steps (fi…',
    },

    problems: [
      {
        id: 'd1',
        title: 'P1 · Discovery',
        points: 40,
        prompt: 'Campus DFS from Gate: write the discovery order of vertices as the lab steps (first 6–8 if long).',
      },
      {
        id: 'd2',
        title: 'P2 · Reachability',
        points: 30,
        prompt:
          'DFS from Gate: which vertices are reachable? Is Lab among them? One-sentence proof idea (path of length k in the DFS tree/forest).',
      },
      {
        id: 'd3',
        title: 'P3 · Contrast',
        points: 30,
        prompt: 'In ≤4 sentences: how does this discovery order differ from the BFS path in dm-m5-lab (hop shortest path)?',
      },
    ],
  },
  {
    workId: 'dm-m5-lab-sp',
    timeEstimate: '35 min',
    sources: [{ label: 'Rosen / Algorithms — distances', kind: 'notes' }],
    deliverables: ['Distance table for city-6'],
    selfCheck: ['Dijkstra distances', 'Not hop counts only'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        'Lookup x hits g’s x↦9 (shadow); y from f; z unbound. Static scope walks definition chain.',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · Distances',
        points: 40,
        prompt: 'city-6 Dijkstra: list final distance labels for at least 4 nodes from the source the lab uses.',
      },
      {
        id: 's2',
        title: 'P2 · Path cost',
        points: 30,
        prompt:
          'Pick one target on city-6; write a Dijkstra shortest path as vertex sequence and numeric sum of edge weights.',
      },
      {
        id: 's3',
        title: 'P3 · Math object',
        points: 30,
        prompt: 'Define “shortest-path distance” formally (min sum of weights over paths). Why BFS hop count fails on weighted graphs.',
      },
    ],
  },
  {
    workId: 'dm-m6-lab-merge',
    timeEstimate: '40 min',
    sources: [{ label: 'MIT 6.042 / CLRS mergesort', kind: 'textbook' }],
    deliverables: ['Recursion-tree sketch', 'Level work notes'],
    selfCheck: ['algoId merge n=8', 'Linked to T(n)=2T(n/2)+Θ(n)'],
    solutionSketch: {
      problemId: 'm1',
      sketch:
        'For P1 · Levels: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'm1',
        title: 'P1 · Levels',
        points: 35,
        prompt: 'Mergesort n=8 lab: how many divide levels until size-1? Sketch the recursion tree (boxes per level).',
      },
      {
        id: 'm2',
        title: 'P2 · Work/level',
        points: 35,
        prompt: 'Argue each level does Θ(n) merge work; total Θ(n log n). Point to merge steps you observed.',
      },
      {
        id: 'm3',
        title: 'P3 · Bridge',
        points: 30,
        prompt: 'Write the recurrence T(n)=2T(n/2)+cn with base; which Master-method case (survey depth)?',
      },
    ],
  },
  {
    workId: 'toc-m1-lab-ends01',
    timeEstimate: '30 min',
    sources: [{ label: 'Sipser Ch. 1', kind: 'textbook' }],
    deliverables: ['State trace table for 11001'],
    selfCheck: ['dfa-ends01', 'Final accept/reject'],
    solutionSketch: {
      problemId: 'e1',
      sketch:
        'For P1 · Lookups: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'e1',
        title: 'P1 · Trace',
        points: 40,
        prompt: 'dfa-ends01 on 11001: table (i, symbol, state before, state after) for all symbols.',
      },
      {
        id: 'e2',
        title: 'P2 · Accept',
        points: 30,
        prompt: 'Does it accept? Does 11001 end with 01? Consistency check.',
      },
      {
        id: 'e3',
        title: 'P3 · Design',
        points: 30,
        prompt: 'Add one sentence: why three states (S, Saw0, Acc) are enough for “ends with 01”.',
      },
    ],
  },
  {
    workId: 'toc-m3-lab-cfg',
    timeEstimate: '30 min',
    sources: [{ label: 'Sipser Ch. 2', kind: 'textbook' }],
    deliverables: ['Sentential forms list', 'Parse tree sketch'],
    selfCheck: ['cfg-anbn aabb', 'S→aSb|ε'],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'aabb: stack Z→ZA→ZAA→ZA→Z then accept. Height = 1+#a−#b on valid prefixes. abba stuck when b meets wrong top.',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · Derivation',
        points: 40,
        prompt: 'cfg-anbn lab: list every sentential form from S to aabb with the production used.',
      },
      {
        id: 'c2',
        title: 'P2 · Tree',
        points: 30,
        prompt: 'Draw a parse tree for aabb under S→aSb|ε (on paper or ASCII).',
      },
      {
        id: 'c3',
        title: 'P3 · General',
        points: 30,
        prompt: 'How many S→aSb applications for aⁿbⁿ (answer: n)? Why S→ε is needed to finish the derivation.',
      },
    ],
  },
  {
    workId: 'toc-m3-lab-pda',
    timeEstimate: '35 min',
    sources: [{ label: 'Sipser Ch. 2 — PDA', kind: 'textbook' }],
    deliverables: ['Stack trace table for aabb', 'Accept/reject argument'],
    selfCheck: ['pda-anbn demo', 'Stack heights match #unmatched a’s'],
    solutionSketch: {
      problemId: 'p2',
      sketch:
        'aabb: after aa stack ZAA (height 3); after aabb stack Z (height 1) → ε to accept. abba fails when second b needs A but stack may be wrong order / leftover A.',
    },
    problems: [
      {
        id: 'p1',
        title: 'P1 · Trace',
        points: 40,
        prompt:
          'pda-anbn on aabb: for each symbol, record (state, stack bottom→top, action push/pop). Final stack should be [Z] only.',
      },
      {
        id: 'p2',
        title: 'P2 · Heights',
        points: 30,
        prompt:
          'List stack height after each of the 4 symbols of aabb. Prove height = 1 + (#a − #b so far) while processing a valid prefix of aⁿbⁿ.',
      },
      {
        id: 'p3',
        title: 'P3 · Reject',
        points: 30,
        prompt:
          'On paper, simulate abba on the same PDA idea. At which symbol does it get stuck? Relate to aⁿbⁿ membership (n=2 needs aabb not abba).',
      },
    ],
  },
  {
    workId: 'toc-m4-lab-tm',
    timeEstimate: '35 min',
    sources: [{ label: 'Sipser Ch. 3', kind: 'textbook' }],
    deliverables: ['Tape snapshots after each pass', 'High-level TM description'],
    selfCheck: ['tm-anbn on □aabb□', 'Two mark passes for n=2'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'maxKeys=2: splits promote mid separator; root grows when root splits. Range [12,35] walks sibling → links.',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · Tape',
        points: 40,
        prompt:
          'tm-anbn lab: write the tape contents (with head position) after pass 1 marks and after pass 2 marks for input aabb.',
      },
      {
        id: 't2',
        title: 'P2 · Complexity idea',
        points: 30,
        prompt:
          'For general n, about how many full sweeps of the tape does this cross-off strategy need? Express as Θ(·) in n (or tape length).',
      },
      {
        id: 't3',
        title: 'P3 · Reject case',
        points: 30,
        prompt:
          'Describe in ≤6 sentences how the TM should reject aab (unequal counts) without looping forever (decider vs recognizer).',
      },
    ],
  },
  {
    workId: 'db-m4-lab-bplus-full',
    timeEstimate: '40 min',
    sources: [{ label: 'DB textbook / CMU 15-445 — B+', kind: 'textbook' }],
    deliverables: ['Tree diagrams after each split', 'Separator list'],
    selfCheck: ['bplus-tree demo', 'maxKeys=2'],
    solutionSketch: {
      problemId: 'f1',
      sketch:
        'SS doubles until ssthresh; CA +1/RTT; loss: ssthresh=⌊cwnd/2⌋, cwnd→1 in toy. Reno fast recovery differs.',
    },
    problems: [
      {
        id: 'f1',
        title: 'P1 · Splits',
        points: 40,
        prompt:
          'bplus-tree values [10,20,30,40,50,5,15,25]: after which inserts does a leaf split occur? List separator keys promoted to internal nodes.',
      },
      {
        id: 'f2',
        title: 'P2 · Range',
        points: 30,
        prompt:
          'On the final tree, which leaf pages are touched for range scan keys ∈ [12, 35]? Count sibling → hops after the first leaf.',
      },
      {
        id: 'f3',
        title: 'P3 · Contrast toy',
        points: 30,
        prompt:
          'Name 3 features present in bplus-tree but missing from bplus-insert leaf-only toy (internal separators, root split, sibling links, fanout).',
      },
    ],
  },
  {
    workId: 'net-m4-lab-aimd',
    timeEstimate: '35 min',
    sources: [{ label: 'Kurose — congestion control', kind: 'textbook' }],
    deliverables: ['cwnd table by RTT', 'SS vs CA comparison'],
    selfCheck: ['tcp-aimd demo', 'Loss event recorded'],
    solutionSketch: {
      problemId: 'a1',
      sketch:
        'Dijkstra city-6 distances; control plane builds tables; data plane forwards. Missing OSPF: LSA flood, areas, ECMP.',
    },

    problems: [
      {
        id: 'a1',
        title: 'P1 · Trace',
        points: 40,
        prompt:
          'tcp-aimd lab: fill a table (RTT, cwnd, ssthresh, phase) for RTT 0 through the first LOSS event inclusive.',
      },
      {
        id: 'a2',
        title: 'P2 · Growth',
        points: 30,
        prompt:
          'In slow start, does cwnd follow approximately 1,2,4,8…? After ssthresh, is growth +1 per RTT (AIMD additive increase)? Cite two rows from your table.',
      },
      {
        id: 'a3',
        title: 'P3 · Loss',
        points: 30,
        prompt:
          'At LOSS: new ssthresh = ⌊cwnd/2⌋ and cwnd restarts at 1 in this toy. How does classic Reno fast recovery differ (one sentence)? Why is this still useful for AIMD intuition?',
      },
    ],
  },
  {
    workId: 'db-m4-lab-hash',
    timeEstimate: '30 min',
    sources: [{ label: 'DB textbook — hash indexes', kind: 'textbook' }],
    deliverables: ['Bucket occupancy notes'],
    selfCheck: ['hash-insert', 'Collisions observed'],
    solutionSketch: {
      problemId: 'h1',
      sketch:
        '9 probes for |R|=|S|=3; emit matching a. Hash/sort-merge win when intermediate sizes large.',
    },

    problems: [
      {
        id: 'h1',
        title: 'P1 · Buckets',
        points: 40,
        prompt: 'hash-insert lab: for keys [7,3,11,1,9,5,15], list each bucket’s chain after all inserts (or screenshot notes).',
      },
      {
        id: 'h2',
        title: 'P2 · Equality',
        points: 30,
        prompt: 'Why hash indexes shine for equality lookups but not range scans vs B+ trees.',
      },
      {
        id: 'h3',
        title: 'P3 · Cost',
        points: 30,
        prompt:
          'If one chain has length k, what is worst-case probe cost Θ(k) for that key? Relate to load factor α = n/m intuition.',
      },
    ],
  },
  {
    workId: 'db-m5-lab-nlj',
    timeEstimate: '35 min',
    sources: [{ label: 'DB textbook — joins', kind: 'textbook' }],
    deliverables: ['Probe count + result set'],
    selfCheck: ['nl-join demo', '9 probes'],
    solutionSketch: {
      problemId: 'j1',
      sketch:
        'DB focus (P1 · Result): fix a concrete schema/history/cost number from the prompt; justify with keys, I/O, or anomaly example. nl-join lab: list every emitted join tuple for R⋈S on a. How many probes total?…',
    },

    problems: [
      {
        id: 'j1',
        title: 'P1 · Result',
        points: 40,
        prompt: 'nl-join lab: list every emitted join tuple for R⋈S on a. How many probes total?',
      },
      {
        id: 'j2',
        title: 'P2 · Cost model',
        points: 30,
        prompt: 'If |R|=1000 and |S|=1000, order-of-magnitude comparisons for NLJ? When would hash join win?',
      },
      {
        id: 'j3',
        title: 'P3 · Plans',
        points: 30,
        prompt:
          'Name one reason an optimizer might still pick NLJ over hash join (indexes on inner, |outer|≪100, nested correlated subquery).',
      },
    ],
  },
  {
    workId: 'db-m6-lab-buf',
    timeEstimate: '30 min',
    sources: [{ label: 'DB textbook — buffer pool', kind: 'textbook' }],
    deliverables: ['Fault count + frame map'],
    selfCheck: ['page-fifo as buffer metaphor'],
    solutionSketch: {
      problemId: 'b1',
      sketch:
        'Systems/OS (P1 · Faults): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. page-fifo lab: record number of page faults and final frame contents.…',
    },

    problems: [
      {
        id: 'b1',
        title: 'P1 · Faults',
        points: 40,
        prompt: 'page-fifo lab: record number of page faults and final frame contents.',
      },
      {
        id: 'b2',
        title: 'P2 · Map',
        points: 30,
        prompt: 'Map OS frames→DB buffer slots and page refs→page ids of a table scan (2–3 sentences).',
      },
      {
        id: 'b3',
        title: 'P3 · Policy',
        points: 30,
        prompt: 'Why DBMS buffer managers often use clock/LRU variants rather than pure FIFO (one reason).',
      },
    ],
  },
  {
    workId: 'net-m2-lab-cache',
    timeEstimate: '25 min',
    sources: [{ label: 'Kurose — CDN/caching', kind: 'textbook' }],
    deliverables: ['Hit/miss log'],
    selfCheck: ['cache-direct metaphor', 'Not real HTTP keys'],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'For P1 · Stream: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.',
    },

    problems: [
      {
        id: 'c1',
        title: 'P1 · Stream',
        points: 40,
        prompt: 'cache-direct lab: list hit vs miss for each access in the demo stream (or first 8).',
      },
      {
        id: 'c2',
        title: 'P2 · CDN map',
        points: 30,
        prompt: 'Map cache lines→edge cache entries and tags→content keys in ≤4 sentences (metaphor).',
      },
      {
        id: 'c3',
        title: 'P3 · Limits',
        points: 30,
        prompt: 'Two reasons real web caches differ (TTL, hierarchical DNS, consistency, multi-level).',
      },
    ],
  },
  {
    workId: 'net-m3-lab-arq',
    timeEstimate: '30 min',
    sources: [{ label: 'Kurose — ARQ', kind: 'textbook' }],
    deliverables: ['Phase comparison notes'],
    selfCheck: ['sliding-window demo'],
    solutionSketch: {
      problemId: 'a1',
      sketch:
        'Stop-and-wait: 1 outstanding. Window=2 pipelines two DATAs. Utilization ↑ when RTT≫tx. GBN rewinds from base; SR retransmits lost only.',
    },

    problems: [
      {
        id: 'a1',
        title: 'P1 · Stop-and-wait',
        points: 35,
        prompt: 'sliding-window lab phase 1: how many outstanding packets max? Sequence of DATA/ACK events.',
      },
      {
        id: 'a2',
        title: 'P2 · Window=2',
        points: 35,
        prompt: 'Phase 2: what is pipelined? Why utilization rises when RTT is large relative to tx time.',
      },
      {
        id: 'a3',
        title: 'P3 · GBN vs SR',
        points: 30,
        prompt: 'In one paragraph: after a loss, what does Go-Back-N retransmit vs Selective Repeat (no need for full sim).',
      },
    ],
  },
  {
    workId: 'net-m5-lab-route',
    timeEstimate: '35 min',
    sources: [{ label: 'Kurose — link state', kind: 'textbook' }],
    deliverables: ['Distance / next-hop notes'],
    selfCheck: ['Dijkstra city-6', 'LS piece only'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'Algorithms (P1 · Distances): run the named algorithm on the given instance; record order/distances; give Θ where asked. Dijkstra city-6: final distances from source for ≥4 nodes; one shortest path seq…',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Distances',
        points: 40,
        prompt: 'Dijkstra city-6: final distances from source for ≥4 nodes; one shortest path sequence.',
      },
      {
        id: 'r2',
        title: 'P2 · Control vs data',
        points: 30,
        prompt: 'Which plane is Dijkstra (control/data)? What does the data plane do with the result?',
      },
      {
        id: 'r3',
        title: 'P3 · Honesty',
        points: 30,
        prompt:
          'Name ≥2 OSPF/LS pieces missing from this Dijkstra toy (flooding, LSA aging, areas, ECMP). One sentence each.',
      },
    ],
  },
  {
    workId: 'pl-m2-lab-stack',
    timeEstimate: '30 min',
    sources: [{ label: 'PL calling conventions landscape', kind: 'notes' }],
    deliverables: ['Frame order at max depth'],
    selfCheck: ['stack-calls'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        'Example 40/12/4 unit/integration/E2E; unit on PR, E2E nightly. Risks: auth, mail delivery, token reuse.',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · Frames',
        points: 40,
        prompt: 'stack-calls lab: list stack frames bottom→top at maximum depth; which is the active call?',
      },
      {
        id: 's2',
        title: 'P2 · Return',
        points: 30,
        prompt:
          'stack-calls: as frames pop, what value/control returns to the caller? Relate to callee→caller return in interpreters (1–2 sentences + example).',
      },
      {
        id: 's3',
        title: 'P3 · Closures preview',
        points: 30,
        prompt: 'Why a closure needs an environment pointer beyond the bare call stack (1–2 sentences).',
      },
    ],
  },
  {
    workId: 'pl-m2-lab-env',
    timeEstimate: '30 min',
    sources: [{ label: 'PLAI — environments', kind: 'textbook' }],
    deliverables: ['Lookup table x/y/z'],
    selfCheck: ['env-lookup', 'Shadowing x'],
    solutionSketch: {
      problemId: 'e1',
      sketch:
        'x hits local g binding 9 (shadows global 1); y from parent f; z unbound. Static chain follows definition, not call stack.',
    },

    problems: [
      {
        id: 'e1',
        title: 'P1 · Lookups',
        points: 40,
        prompt: 'env-lookup lab: for x, y, and z — which frame answers (or unbound)? Values for hits.',
      },
      {
        id: 'e2',
        title: 'P2 · Shadow',
        points: 30,
        prompt: 'Explain why x is 9 not 1 under static scope with the given chain.',
      },
      {
        id: 'e3',
        title: 'P3 · Dynamic',
        points: 30,
        prompt: 'In ≤4 sentences: how dynamic scope would differ when looking up a free variable (call-stack walk).',
      },
    ],
  },
  {
    workId: 'pl-m5-lab-list',
    timeEstimate: '25 min',
    sources: [{ label: 'PL — algebraic lists', kind: 'textbook' }],
    deliverables: ['Cons spine sketch'],
    selfCheck: ['list-append', 'Immutable mental model'],
    solutionSketch: {
      problemId: 'l1',
      sketch:
        'Systems/OS (P1 · Spine): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. list-append lab values [1,2,3,4]: sketch the list spine after all inserts (boxes…',
    },

    problems: [
      {
        id: 'l1',
        title: 'P1 · Spine',
        points: 40,
        prompt: 'list-append lab values [1,2,3,4]: sketch the list spine after all inserts (boxes and next pointers).',
      },
      {
        id: 'l2',
        title: 'P2 · Cons',
        points: 30,
        prompt: 'Write 1::2::3::nil style notation matching your sketch; state head and tail of the list.',
      },
      {
        id: 'l3',
        title: 'P3 · Honesty',
        points: 30,
        prompt: 'This viz may mutate cells; name one difference vs pure functional cons (sharing, immutability).',
      },
    ],
  },
  {
    workId: 'se-m3-lab-fcfs',
    timeEstimate: '25 min',
    sources: [{ label: 'SE flow / process landscape', kind: 'notes' }],
    deliverables: ['Ticket map + convoy note'],
    selfCheck: ['Metaphor — not Jira'],
    solutionSketch: {
      problemId: 'f1',
      sketch:
        'Systems/OS (P1 · Map): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. schedule-fcfs lab: map each job to a fictional ticket title; note finish order.…',
    },

    problems: [
      {
        id: 'f1',
        title: 'P1 · Map',
        points: 40,
        prompt: 'schedule-fcfs lab: map each job to a fictional ticket title; note finish order.',
      },
      {
        id: 'f2',
        title: 'P2 · Convoy',
        points: 30,
        prompt: 'Identify a short job waiting behind a long one; SE analogue (blocked high-priority feature).',
      },
      {
        id: 'f3',
        title: 'P3 · Limits',
        points: 30,
        prompt:
          '≥2 reasons real delivery queues differ from schedule-fcfs (parallelism N>1, priority classes, dependencies). Give one numeric or named example each.',
      },
    ],
  },
  {
    workId: 'se-m3-lab-rr',
    timeEstimate: '25 min',
    sources: [{ label: 'WIP limits / lean (public)', kind: 'other' }],
    deliverables: ['Slice-switch count + WIP argument'],
    selfCheck: ['schedule-rr metaphor'],
    solutionSketch: {
      problemId: 'r1',
      sketch:
        'Systems/OS (P1 · Switches): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. schedule-rr lab: roughly how many time-slice switches until completion? List 3 c…',
    },

    problems: [
      {
        id: 'r1',
        title: 'P1 · Switches',
        points: 40,
        prompt: 'schedule-rr lab: roughly how many time-slice switches until completion? List 3 consecutive slices.',
      },
      {
        id: 'r2',
        title: 'P2 · WIP',
        points: 30,
        prompt:
          'Argue how WIP≫capacity (e.g. 12 tickets in progress for 3 people) resembles RR thrash: context loss, not just CPU. Cite schedule-rr slice switches.',
      },
      {
        id: 'r3',
        title: 'P3 · Policy',
        points: 30,
        prompt: 'Propose a WIP limit for a 4-person team and one metric to watch (cycle time / throughput).',
      },
    ],
  },
  {
    workId: 'se-m4-lab-stack',
    timeEstimate: '25 min',
    sources: [{ label: 'SE testing / debugging', kind: 'other' }],
    deliverables: ['Test seam note'],
    selfCheck: ['stack-calls as incident artifact'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'Lomuto-last: each partition places pivot; count partitions ≈ n on sorted input. Compares spike vs random. Adversary array [1,2,3,4,5,6] for last-pivot.',
    },

    problems: [
      {
        id: 't1',
        title: 'P1 · Frames',
        points: 35,
        prompt: 'stack-calls lab: list frames at max depth; mark which frame you would unit-test first and why.',
      },
      {
        id: 't2',
        title: 'P2 · Seams',
        points: 35,
        prompt:
          'Which boundary is better as an integration test (I/O, network, DB)? One sentence with a concrete seam (e.g. HTTP 200 + row count=1).',
      },
      {
        id: 't3',
        title: 'P3 · Oracle',
        points: 30,
        prompt:
          'For your chosen unit test, state the oracle: expected return value or property (e.g. pure function f(x)=y for x=3).',
      },
    ],
  },
  // --- Gap-closure wave labs ---
  {
    workId: 'm3-quicksort-lab',
    timeEstimate: '40 min',
    sources: [{ label: 'CLRS Ch. 7', kind: 'textbook' }],
    deliverables: ['Partition pivot log', 'Worst-case note'],
    selfCheck: ['algoId quicksort', 'Lomuto last pivot'],
    solutionSketch: {
      problemId: 'q1',
      sketch:
        'r:=(2r+b) mod 3 each bit. 1101₂=13, 13 mod 3=1. General mod k needs k states.',
    },
    problems: [
      {
        id: 'q1',
        title: 'P1 · Pivots',
        points: 40,
        prompt: 'quicksort lab n=12: list pivot values (or indices) after each partition until sorted. How many partitions?',
      },
      {
        id: 'q2',
        title: 'P2 · Compares',
        points: 30,
        prompt: 'Record approximate compare count from the lab metrics. Is it closer to n log n or n² for this shuffle?',
      },
      {
        id: 'q3',
        title: 'P3 · Worst case',
        points: 30,
        prompt: 'Give an array of length 6 that forces Θ(n²) Lomuto-last-pivot behavior and one sentence why.',
      },
    ],
  },
  {
    workId: 'toc-m1-lab-mod3',
    timeEstimate: '30 min',
    sources: [{ label: 'Sipser Ch. 1', kind: 'textbook' }],
    deliverables: ['State table for 1101'],
    selfCheck: ['dfa-mod3', 'final r=1'],
    solutionSketch: {
      problemId: 'm1',
      sketch:
        'Window N=3; lost DATA1; retransmit from base (1,2,3) not only 1. SR would retransmit only lost.',
    },

    problems: [
      {
        id: 'm1',
        title: 'P1 · Trace',
        points: 40,
        prompt: 'dfa-mod3 on 1101: table (symbol, r before, r after) using r:=(2r+b) mod 3.',
      },
      {
        id: 'm2',
        title: 'P2 · Check',
        points: 30,
        prompt: 'Confirm 1101₂ = 13₁₀ and 13 mod 3 equals final state index.',
      },
      {
        id: 'm3',
        title: 'P3 · Design',
        points: 30,
        prompt: 'How many states for mod k in general? Answer: k. Why is the update 2r+b (binary left shift)?',
      },
    ],
  },
  {
    workId: 'net-m3-lab-gbn',
    timeEstimate: '30 min',
    sources: [{ label: 'Kurose — GBN', kind: 'textbook' }],
    deliverables: ['Event timeline', 'Rexmit list'],
    selfCheck: ['gbn-loss', 'window=3'],
    solutionSketch: {
      problemId: 'g1',
      sketch:
        'Build R buckets then |S| probes (=3). Join arity 2 on toy. Grace hash when build exceeds memory.',
    },

    problems: [
      {
        id: 'g1',
        title: 'P1 · Loss',
        points: 40,
        prompt: 'gbn-loss lab: which DATA is lost? After timeout, which sequence numbers retransmit?',
      },
      {
        id: 'g2',
        title: 'P2 · Window',
        points: 30,
        prompt: 'What is N=3 maximum outstanding? After ACK0, what is the new base?',
      },
      {
        id: 'g3',
        title: 'P3 · SR contrast',
        points: 30,
        prompt: 'Under Selective Repeat, which packets would retransmit after DATA1 loss? One sentence vs GBN.',
      },
    ],
  },
  {
    workId: 'db-m5-lab-hj',
    timeEstimate: '30 min',
    sources: [{ label: 'DB textbook — hash join', kind: 'textbook' }],
    deliverables: ['Build buckets', 'Probe log'],
    selfCheck: ['hash-join', '3 probes'],
    solutionSketch: {
      problemId: 'h1',
      sketch:
        '(2+3)*4 → 5*4 → 20. Congruence reduces left redex of * first. Differs from big-step single judgment.',
    },

    problems: [
      {
        id: 'h1',
        title: 'P1 · Build/probe',
        points: 40,
        prompt: 'hash-join lab: list build buckets for R and each S probe hit/miss. Final join arity (expect 2 tuples)?',
      },
      {
        id: 'h2',
        title: 'P2 · Cost',
        points: 30,
        prompt: 'Compare probe count to nl-join’s 9 on the same tables. When is hash join Θ(|R|+|S|)?',
      },
      {
        id: 'h3',
        title: 'P3 · Memory',
        points: 30,
        prompt:
          'Name one reason hash join falls back to partition/grace-hash when |R| exceeds memory (e.g. spill to disk). Cite Θ(|R|+|S|) when it fits.',
      },
    ],
  },
  {
    workId: 'pl-m3-lab-sos',
    timeEstimate: '25 min',
    sources: [{ label: 'SOS notes', kind: 'textbook' }],
    deliverables: ['Reduction sequence'],
    selfCheck: ['pl-small-step', '(2+3)*4'],
    solutionSketch: {
      problemId: 's1',
      sketch:
        '(2+3)*4 → 5*4 → 20. Congruence reduces addition inside mul context first. Big-step collapses to one ⇓ judgment.',
    },

    problems: [
      {
        id: 's1',
        title: 'P1 · Steps',
        points: 40,
        prompt: 'pl-small-step: write the term after each reduction of (2+3)*4 until a value.',
      },
      {
        id: 's2',
        title: 'P2 · Contrast',
        points: 30,
        prompt: 'How does this differ from big-step pl-eval-tree (one judgment to value)? ≤4 sentences.',
      },
      {
        id: 's3',
        title: 'P3 · Congruence',
        points: 30,
        prompt: 'Why reduce 2+3 before multiplying by 4? Name the congruence/context rule idea.',
      },
    ],
  },
  {
    workId: 'se-m4-pyramid',
    timeEstimate: '40 min',
    sources: [{ label: 'SE testing practice', kind: 'other' }],
    deliverables: ['Pyramid table with counts', 'Runtime budget'],
    selfCheck: ['Non-metaphor numbers', 'Risks named'],
    solutionSketch: {
      problemId: 'p1',
      sketch:
        'Merge: always Θ(n log n) compares (stable, extra array). Quicksort: expected ~1.39 n ln n, worst Θ(n²). One trial at n=16 is noisy — report both counts and a caveat.',
    },
    problems: [
      {
        id: 'p1',
        title: 'P1 · Counts',
        points: 40,
        prompt:
          'For a 4-person team shipping password-reset REST: propose unit/integration/E2E test counts (integers) and justify ratios.',
      },
      {
        id: 'p2',
        title: 'P2 · Budgets',
        points: 30,
        prompt: 'Give CI runtime budgets: unit suite ≤? min, integration ≤? min, E2E ≤? min. What runs on every PR?',
      },
      {
        id: 'p3',
        title: 'P3 · Risk',
        points: 30,
        prompt: 'Name top 3 risks for this feature and which pyramid layer catches each (or “manual”).',
      },
    ],
  },
  {
    workId: 'm3-quick-vs-merge-lab',
    timeEstimate: '45 min',
    sources: [{ label: 'CLRS Ch. 2 & 7', kind: 'textbook' }],
    deliverables: ['Compare-count table', 'Theory interpretation'],
    selfCheck: ['Same array dual-run', 'quicksort vs merge'],
    solutionSketch: {
      problemId: 'd2',
      sketch:
        'Toy: NLJ 9 vs hash ~6. Scale 10³: NLJ 10⁶ vs hash ~2·10³. NLJ wins with tiny outer + index on inner.',
    },
    problems: [
      {
        id: 'd1',
        title: 'P1 · Setup',
        points: 30,
        prompt: 'Dual-run quicksort vs merge, n=16, same shuffle. Record compare counts for both algorithms.',
      },
      {
        id: 'd2',
        title: 'P2 · Interpret',
        points: 40,
        prompt: 'Which won on compares? Relate to Θ(n log n) merge guarantee vs quicksort expected/worst cases (one paragraph).',
      },
      {
        id: 'd3',
        title: 'P3 · Caveat',
        points: 30,
        prompt: 'Name two reasons one trial is not enough (constants, pivot randomness, n small). What n would you try next?',
      },
    ],
  },
  {
    workId: 'db-m5-lab-join-cost',
    timeEstimate: '30 min',
    sources: [{ label: 'DB textbook — joins', kind: 'textbook' }],
    deliverables: ['Cost table', 'Workload pick'],
    selfCheck: ['join-compare demo', '9 vs 6 toy'],
    solutionSketch: {
      problemId: 'c1',
      sketch:
        'Toy |R|=|S|=3: NLJ probes=9, hash build+probe≈6. Scale 10³: NLJ ~10⁶ vs hash ~2·10³. NLJ wins with tiny outer + index on inner.',
    },
    problems: [
      {
        id: 'c1',
        title: 'P1 · Toy',
        points: 35,
        prompt: 'join-compare: state NLJ probe count and hash build+probe count for |R|=|S|=3.',
      },
      {
        id: 'c2',
        title: 'P2 · Scale',
        points: 35,
        prompt: 'For |R|=|S|=1000, give order-of-magnitude NLJ vs hash ops. When does hash need partitioning?',
      },
      {
        id: 'c3',
        title: 'P3 · Optimizer',
        points: 30,
        prompt: 'Name one workload where NLJ still wins (indexed inner, outer size n<=10). One sentence.',
      },
    ],
  },
  {
    workId: 'pl-m4-lab-stlc',
    timeEstimate: '30 min',
    sources: [{ label: 'TAPL Ch. 9', kind: 'textbook' }],
    deliverables: ['Paper derivation tree'],
    selfCheck: ['pl-type-stlc', 'Γ explicit'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        '⊢ (λx:Bool.x) true : Bool via T-Abs (gives Bool→Bool) and T-App. Paper tree needs Γ,x:Bool ⊢ x:Bool. Unsound cast breaks progress.',
    },
    problems: [
      {
        id: 't1',
        title: 'P1 · Goal',
        points: 30,
        prompt: 'pl-type-stlc: write the final judgment ⊢ (λx:Bool. x) true : Bool with empty Γ.',
      },
      {
        id: 't2',
        title: 'P2 · Tree',
        points: 40,
        prompt: 'On paper, expand T-Abs and T-App nodes (include Γ,x:Bool ⊢ x:Bool).',
      },
      {
        id: 't3',
        title: 'P3 · Unsound',
        points: 30,
        prompt: 'Invent one unsound cast rule and show a term that types but gets stuck (≤5 sentences).',
      },
    ],
  },
  {
    workId: 'ai-m4-lab',
    timeEstimate: '30 min',
    sources: [{ label: 'AIMA CSP', kind: 'textbook' }],
    deliverables: ['Domain table after each step'],
    selfCheck: ['csp-ac', 'A=R then AC'],
    solutionSketch: {
      problemId: 'c2',
      sketch:
        'Growth: √n < n log n < n² < 2ⁿ < n!. Master T=2T(n/2)+n → Θ(n log n). BFS distances. Prefer merge for worst-case/stability; quicksort for average in-place.',
    },
    problems: [
      {
        id: 'c1',
        title: 'P1 · Domains',
        points: 40,
        prompt: 'csp-ac lab: list domains of A,B,C after assign A=R and after full AC (table).',
      },
      {
        id: 'c2',
        title: 'P2 · Solution',
        points: 30,
        prompt: 'Give one complete coloring consistent with the final domains. Is it unique up to renaming?',
      },
      {
        id: 'c3',
        title: 'P3 · Honesty',
        points: 30,
        prompt: 'Name two AC-3 features missing (queue of arcs, revision count, Australia map).',
      },
    ],
  },
  {
    workId: 'alg-midterm',
    timeEstimate: '90 min',
    sources: [{ label: 'CLRS Ch. 2–4, 22–24', kind: 'textbook' }],
    deliverables: ['Full written exam responses'],
    selfCheck: ['Show work', 'Θ claims justified'],
    solutionSketch: {
      problemId: 'm2',
      sketch:
        'FCFS vs SJF avg waiting on lab jobs; FIFO faults on 3 frames; thrashing = high fault rate + low useful CPU. User cannot write PTEs — needs privileged trap/kernel.',
    },
    problems: [
      {
        id: 'm1',
        title: 'P1 · Growth',
        points: 25,
        prompt:
          'Order by growth (slowest→fastest): n log n, 2^n, n², n!, √n. Justify one adjacent pair with a limit.',
      },
      {
        id: 'm2',
        title: 'P2 · Recurrence + graph',
        points: 40,
        prompt:
          '(a) Solve T(n)=2T(n/2)+n via Master (state case). (b) On undirected edges {AB,AC,BD,CD}, BFS from A: distances to B,C,D.',
      },
      {
        id: 'm3',
        title: 'P3 · Sorting design',
        points: 35,
        prompt:
          'When prefer mergesort over quicksort? When the reverse? Mention stability, worst-case Θ, and extra memory (≤8 sentences).',
      },
    ],
  },
  {
    workId: 'os-midterm',
    timeEstimate: '90 min',
    sources: [{ label: 'OSTEP scheduling & VM', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Gantts + page table', 'Short essays'],
    selfCheck: ['Use lab job set where relevant'],
    solutionSketch: {
      problemId: 'o1',
      sketch:
        'DFA ends-01 3 states; pump {0ⁿ1ⁿ}; CFG S→aSb|ε; A_TM recognizable not decidable.',
    },
    problems: [
      {
        id: 'o1',
        title: 'P1 · Scheduling',
        points: 40,
        prompt:
          'Jobs P1(0,5) P2(1,3) P3(2,8) P4(3,2): compute average waiting under FCFS and non-preemptive SJF. Which is lower?',
      },
      {
        id: 'o2',
        title: 'P2 · Memory',
        points: 35,
        prompt:
          '3 frames, refs 1 2 3 2 4 1 5: count FIFO faults. Define thrashing in one sentence with a metric.',
      },
      {
        id: 'o3',
        title: 'P3 · Isolation',
        points: 25,
        prompt:
          'Why user code cannot rewrite page tables directly? Name the trap/kernel mechanism (≤5 sentences).',
      },
    ],
  },
  {
    workId: 'toc-midterm',
    timeEstimate: '90 min',
    sources: [{ label: 'Sipser Ch. 1–3', kind: 'textbook' }],
    deliverables: ['Diagrams + proofs'],
    selfCheck: ['Test strings for every automaton'],
    solutionSketch: {
      problemId: 't1',
      sketch:
        'DFA for ends-with-01: 3 states. Pumping: |xy|≤p, |y|≥1, xy^k z must stay in L. a^n b^n needs stack (PDA) / CFG S→aSb|ε.',
    },
    problems: [
      {
        id: 't1',
        title: 'P1 · DFA',
        points: 30,
        prompt: 'Build a DFA for { w ∈ {0,1}* | w ends with 01 }. Give δ table and test 3 strings.',
      },
      {
        id: 't2',
        title: 'P2 · Pumping',
        points: 35,
        prompt: 'Prove {0^n 1^n | n≥0} is not regular via pumping lemma (careful case split).',
      },
      {
        id: 't3',
        title: 'P3 · CFG/TM',
        points: 35,
        prompt:
          '(a) CFG for a^n b^n. (b) In one paragraph: recognizer vs decider for TMs; give one language that is recognizable but not decidable (name only OK).',
      },
    ],
  },
]
