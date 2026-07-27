import type { MeatPack } from './types'

export const databasesMeat: MeatPack[] = [
  {
    workId: 'db-m1-ps',
    timeEstimate: '70 min',
    deliverables: ['Algebra expressions + key analysis'],
    selfCheck: ['Attribute sets match schema you defined'],
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
        prompt: 'State the end-to-end argument in your own words; give one function that should not live in the network core.',
      },
      {
        id: 'n3',
        title: 'P3 · Packet vs circuit',
        points: 30,
        prompt: 'Compare packet and circuit switching on statistical multiplexing and failure modes.',
      },
    ],
  },
  {
    workId: 'net-m3-ps',
    timeEstimate: '75 min',
    deliverables: ['Sequence diagrams'],
    selfCheck: ['Window size and ACK numbers consistent'],
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
        prompt: 'Show a term that is well-typed under an unsound rule you invent, but stuck at runtime.',
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
    problems: [
      {
        id: 's1',
        title: 'P1 · Scenario A',
        points: 40,
        prompt:
          'Safety-critical medical device firmware, 8 engineers, regulatory audit. Recommend process practices (with risks of agile theater).',
      },
      {
        id: 's2',
        title: 'P2 · Scenario B',
        points: 40,
        prompt: 'Early-stage consumer mobile app, 3 founders, unknown market. Different recommendation; justify.',
      },
      {
        id: 's3',
        title: 'P3 · DoD',
        points: 20,
        prompt: 'Write a Definition of Done checklist for a user-facing feature (8–12 bullets).',
      },
    ],
  },
  {
    workId: 'se-m2-ps',
    timeEstimate: '55 min',
    deliverables: ['Rewritten acceptance criteria'],
    selfCheck: ['Each criterion is testable'],
    problems: [
      {
        id: 'r1',
        title: 'P1 · Ambiguity',
        points: 50,
        prompt:
          'Rewrite into testable ACs: “The system should be fast, user-friendly, and secure for all users.” Produce ≥6 criteria.',
      },
      {
        id: 'r2',
        title: 'P2 · Split',
        points: 30,
        prompt: 'Separate problem statement vs solution for: “We need a chatbot on the homepage.”',
      },
      {
        id: 'r3',
        title: 'P3 · NFR',
        points: 20,
        prompt: 'Add measurable NFRs for latency, availability, and accessibility (WCAG level).',
      },
    ],
  },
  {
    workId: 'se-m4-ps',
    timeEstimate: '60 min',
    deliverables: ['Risk-ranked test plan'],
    selfCheck: ['Not only happy path'],
    problems: [
      {
        id: 't1',
        title: 'P1 · Feature',
        points: 50,
        prompt:
          'Feature: password reset via email link. List risks; map unit/integration/E2E tests; note what not to automate.',
      },
      {
        id: 't2',
        title: 'P2 · Coverage myth',
        points: 25,
        prompt: 'Why 100% line coverage can still miss critical bugs—give an example.',
      },
      {
        id: 't3',
        title: 'P3 · Flakes',
        points: 25,
        prompt: 'Name two flake sources in UI E2E and mitigations.',
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
]
