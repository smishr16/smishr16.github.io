/**
 * Upgrade bulk outline solution sketches to pack-specific showcase quality.
 * - Curated map for high-value workIds
 * - Heuristic rewrites for remaining "Outline: state assumptions..." boilerplate
 */
import fs from 'fs'
import path from 'path'

const GENERIC =
  'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.'

const CURATED = {
  // Algorithms
  'alg-m1-problem-set':
    'Growth order: n! ≫ 2ⁿ ≫ n³/log n ≫ n² ≫ n log n ≫ √n. Adjacent pair via lim f/g. Nested loops: (i) Θ(n²); (ii) Θ(n³); (iii) Θ(n). Sums: Σi=n(n+1)/2=Θ(n²); Σ2^i=Θ(2ⁿ).',
  'alg-m2-recurrences':
    'Master: a=2,b=2,f=n → case 2 → Θ(n log n). Substitution: guess cn log n; check base; absorb floors with n≥n₀. Recursion tree for T(n)=T(n/3)+T(2n/3)+n: depth Θ(log n), level cost ≤ n ⇒ Θ(n log n).',
  'm3-quicksort-analysis':
    'Adversary always min/max pivot → T(n)=T(n−1)+Θ(n)=Θ(n²). Random pivot: E[X_{ij}]=2/(|j−i|+1) ⇒ E[compares]≤2n ln n+O(n). Introsort caps depth ~2 log n then heapsort.',
  'm3-quicksort-lab':
    'Lomuto-last: each partition places pivot; count partitions ≈ n on sorted input. Compares spike vs random. Adversary array [1,2,3,4,5,6] for last-pivot.',
  'm3-quick-vs-merge-lab':
    'Merge: always Θ(n log n) compares (stable, extra array). Quicksort: expected ~1.39 n ln n, worst Θ(n²). One trial at n=16 is noisy — report both counts and a caveat.',
  'm4-heapsort-sketch':
    'Build-heap Θ(n); each of n extract-max is O(log n) ⇒ Θ(n log n). Unstable (long-range swaps). PQ connection: heapsort = repeated extract-max into sorted suffix.',
  'alg-m4-graph-ps':
    'Adj list space Θ(n+m); matrix Θ(n²). BFS from A on {AB,AC,BD,BE,CF,EF}: distances A0, B/C1, D/E2, F2. Dijkstra nonneg weights; settle order nondecreasing dist.',
  'alg-m4-bfs-dfs-lab':
    'BFS layers = hop distance; DFS discovery order differs (stack). Record path Gate→Lab; edge count = hops.',
  'alg-m4-dijkstra-lab':
    'Settle order: extract-min from priority queue; final dist labels. Path cost = sum of weights, not hop count.',
  'alg-m5-greedy-ps':
    'Interval scheduling: sort by finish time; exchange: first disagreement swap preserves feasibility and |OPT|. Counterexample for earliest-start greedy: long early job blocks many short ones.',
  'alg-m6-dp-ps':
    'LCS: dp[i][j]=dp[i-1][j-1]+1 if equal else max(left,up). Backtrack from dp[m][n]. Knapsack 0/1: dp[w]=max(dp[w], dp[w−wᵢ]+vᵢ) reverse weight loop.',
  'alg-m8-npc-ps':
    'NP: poly certificate + verifier. Karp reduction f in poly time: x∈A ⇔ f(x)∈B. SAT ≤ₚ 3SAT via clause splitting. If P=NP then poly algorithms for all NP search (crypto intuition collapses).',
  'alg-midterm':
    'Growth: √n < n log n < n² < 2ⁿ < n!. Master T=2T(n/2)+n → Θ(n log n). BFS distances. Prefer merge for worst-case/stability; quicksort for average in-place.',

  // DS
  'ds-m1-ps':
    'Stack/queue array: Θ(1) push/pop at end; insert-front Θ(n). Dictionary: balanced BST Θ(log n) worst; hash average Θ(1), worst Θ(n). Doubling: aggregate 1+2+…+n ≤ 2n ⇒ amortized O(1).',
  'ds-m2-lab':
    'Append [4,8,2,9,1] → indices 0..4; value 2 at index 2; access[i] Θ(1) contiguous. Insert-front shifts all ⇒ Θ(n); linked-list head insert Θ(1).',
  'ds-m5-ps':
    'Insert 9,4,7,1 min-heap: root ends as 1 after sifts. extract-min: swap last to root, sift-down. PQ use: Dijkstra keys=dist; Huffman keys=freq.',
  'ds-m6-lab':
    'Hash chaining h(k)=k mod m; record chains after inserts; load α=n/m; rehash when α>0.75 costs Θ(n) once, amortized O(1) under geometric growth.',
  'ds-m7-lab':
    'Campus BFS then DFS from Gate: contrast discovery order; adj-list iterate neighbors Θ(deg(v)); matrix edge test Θ(1) space Θ(n²).',

  // Systems / OS
  'sys-m1-ps':
    '8-bit TC: −1=0xFF, −128=0x80, 127=0x7F. 100+50=150 → signed wrap −106. Float 0.1+0.2≠0.3 binary. Little-endian 0x12345678 → 78 56 34 12 at ascending addresses.',
  'sys-m2-lab':
    'Call depth f→g→h: three frames; return addr below locals (ABI-dependent). After h returns, %rsp must restore caller frame for next ret.',
  'sys-m4-lab-cache':
    'Direct-mapped: index = addr mod lines; tag compare. Hit rate = hits/refs. Cold = first fill; conflict = same line different tags.',
  'sys-m4-lab-pages':
    'FIFO 3 frames on given refs: count faults; hits when page still resident. Temporal locality explains re-hit of recently used pages under LRU better than FIFO sometimes.',
  'os-m3-ps':
    'P1(0,5) P2(1,3) P3(2,8) P4(3,2). FCFS convoy: short waits behind long. SJF among ready often runs P4 before P3. RR q=2 improves response for short jobs, more switches.',
  'os-m3-lab-fcfs':
    'FCFS Gantt: P1[0,5) P2[5,8) P3[8,16) P4[16,18). waiting=start−arrival; turnaround=finish−arrival. Avg waiting from the four values.',
  'os-m3-lab-sjf':
    'SJF non-preemptive among arrived: after P1, pick shortest ready (P2 then P4 then P3 typically). Compare avg waiting to FCFS numerically.',
  'os-m3-lab-rr':
    'RR q=2: slice log P1,P2,…; count switches until done. Response time for P4 improves vs FCFS.',
  'os-m5-lab-fifo':
    '3 frames FIFO on lab ref string: fault count; final resident set. Belady anomaly possible on other strings (mention only).',
  'os-m5-lab-lru':
    'LRU vs FIFO fault totals on same refs; one ref that hits under LRU but faults under FIFO (recency). Clock approximates LRU with ref bit.',
  'os-midterm':
    'FCFS vs SJF avg waiting on lab jobs; FIFO faults on 3 frames; thrashing = high fault rate + low useful CPU. User cannot write PTEs — needs privileged trap/kernel.',

  // Theory / DM
  'toc-m1-ps':
    'Even #0s: E/O flip on 0. Ends-with-01: S/Saw0/Acc. Always test ε, shortest accept, shortest reject. Product for intersection.',
  'toc-m1-lab':
    '01001: three 0s → odd → REJECT. Table (i,sym,before,after). Odd #1s DFA tracks parity of 1s instead.',
  'toc-m1-lab-mod3':
    'r:=(2r+b) mod 3 each bit. 1101₂=13, 13 mod 3=1. General mod k needs k states.',
  'toc-m2-ps':
    'Pumping: |xy|≤p, |y|≥1, ∀k xyᵏz∈L. {0ⁿ1ⁿ} not regular. Closure: if L regular and L∩R non-regular careful — use homomorphisms carefully.',
  'toc-m3-ps':
    'CFG S→aSb|ε for aⁿbⁿ. PDA push A on a, pop on b. CFL pumping for {aⁿbⁿcⁿ}.',
  'toc-m3-lab-pda':
    'aabb: stack Z→ZA→ZAA→ZA→Z then accept. Height = 1+#a−#b on valid prefixes. abba stuck when b meets wrong top.',
  'toc-midterm':
    'DFA ends-01 3 states; pump {0ⁿ1ⁿ}; CFG S→aSb|ε; A_TM recognizable not decidable.',
  'dm-m1-ps':
    'Direct: n=2k+1⇒n² odd. Contrapositive of even-square. √2 irrational p/q. Goldbach formalization ∀ even n>2 ∃p,q primes. Flawed induction fails at n=1→2.',
  'dm-m5-lab':
    'Campus BFS Gate→Lab path; |E_path|=hops; path vs walk (no repeated vertices vs allow).',
  'dm-m6-lab-merge':
    'Mergesort n=8: log₂8=3 levels; each level Θ(n) merge; T(n)=2T(n/2)+cn case 2 Master.',

  // DB / Net / PL / SE / ML / AI
  'db-m1-ps':
    'Student(sid PK), Course(cid PK), Enroll(sid,cid,grade) FK→Student,Course; key (sid,cid) if one grade/term. History: add term or EnrollId.',
  'db-m4-lab':
    'Order-3 leaves: pack keys; split when 4th key. Missing: internal separators, root split, sibling links (see bplus-tree lab).',
  'db-m4-lab-bplus-full':
    'maxKeys=2: splits promote mid separator; root grows when root splits. Range [12,35] walks sibling → links.',
  'db-m5-lab-nlj':
    '9 probes for |R|=|S|=3; emit matching a. Hash/sort-merge win when intermediate sizes large.',
  'db-m5-lab-hj':
    'Build R buckets then |S| probes (=3). Join arity 2 on toy. Grace hash when build exceeds memory.',
  'db-m5-lab-join-cost':
    'Toy: NLJ 9 vs hash ~6. Scale 10³: NLJ 10⁶ vs hash ~2·10³. NLJ wins with tiny outer + index on inner.',
  'db-m6-ps':
    'Dirty read / non-repeatable / phantom histories. 2PL grow then shrink. RC vs SERIALIZABLE anomaly table.',
  'net-m1-ps':
    'L=1500B=12000b, R=10Mbps → tx=1.2ms; d=1000km s=2e8 → prop=5ms; +1ms proc. End-to-end: reliability at ends.',
  'net-m1-lab':
    'Client→R1→R2→Server cumulative t; R2 prop dominates in toy. Link L/R and d/s formulas.',
  'net-m3-lab-gbn':
    'Window N=3; lost DATA1; retransmit from base (1,2,3) not only 1. SR would retransmit only lost.',
  'net-m4-lab-aimd':
    'SS doubles until ssthresh; CA +1/RTT; loss: ssthresh=⌊cwnd/2⌋, cwnd→1 in toy. Reno fast recovery differs.',
  'net-m5-lab-route':
    'Dijkstra city-6 distances; control plane builds tables; data plane forwards. Missing OSPF: LSA flood, areas, ECMP.',
  'pl-m1-lab':
    'Eval order leaves then + then *; value 20. Big-step: ⊢ 2+3 ⇓ 5 under empty env.',
  'pl-m2-lab-env':
    'Lookup x hits g’s x↦9 (shadow); y from f; z unbound. Static scope walks definition chain.',
  'pl-m3-lab-sos':
    '(2+3)*4 → 5*4 → 20. Congruence reduces left redex of * first. Differs from big-step single judgment.',
  'pl-m4-lab-stlc':
    '⊢ (λx:Bool.x) true : Bool via T-Abs (Bool→Bool) and T-App. Unsound cast breaks progress.',
  'pl-m4-ps':
    'T-Abs/T-App/T-Var. Progress: well-typed closed terms value or step. Bad cast ⇒ stuck well-typed term.',
  'se-m1-lab':
    'Map new/ready/running/blocked/terminated → backlog/ready/doing/blocked/done. Metaphor fails: multi-person, no single CPU.',
  'se-m4-ps':
    'Password-reset: unit token TTL, integration email, E2E full flow. 100% coverage ≠ correct oracle. Flakes: timing, shared state.',
  'se-m4-pyramid':
    'Example 40/12/4 unit/integration/E2E; unit on PR, E2E nightly. Risks: auth, mail delivery, token reuse.',
  'ai-m2-lab-bfs':
    'BFS expansion order; optimal path length in hops on unweighted graph.',
  'ai-m2-lab-astar':
    'A* with consistent heuristic; f=g+h; compare expansion count to BFS.',
  'ai-m4-lab':
    'A=R ⇒ B={G}; C={R} after ≠ constraints. Toy AC not full AC-3 queue.',
  'ai-m5-lab-minimax':
    'Leaves up; min then max; root value 3 choose left. Alpha-beta can skip some right branches.',
  'ml-m1-ps':
    'X features, Y∈{0,1}, 0-1 or logistic loss. Capacity↑: train↓ then test↑ (overfit). Pick min CV/test error.',
  'ml-m2-lab':
    'linreg GD: m,b path; loss should trend down if η small. Squared loss sensitive to outliers (one far point pulls line).',
  'ml-m8-lab-kmeans':
    'Assign→update until centers stable; k choice via elbow/silhouette (toy). Sensitive to init.',
}

const GENERIC_RE =
  /^Outline: state assumptions, show key equation or trace step, conclude with Θ\/complexity or accept\/reject claim\. Expand on paper\.$/

function heuristicSketch(workId, problems) {
  const p0 = problems[0]
  const title = p0?.title ?? workId
  const prompt = (p0?.prompt ?? '').replace(/\s+/g, ' ').slice(0, 120)
  // Keyword routes
  if (/SQL|schema|join|B\+|index|transaction|2PL/i.test(prompt + workId))
    return `DB focus (${title}): fix a concrete schema/history/cost number from the prompt; justify with keys, I/O, or anomaly example. ${prompt.slice(0, 80)}…`
  if (/DFA|NFA|pump|CFG|PDA|TM|regular|decid/i.test(prompt + workId))
    return `Theory (${title}): draw automaton or write production; test ε + one accept + one reject; state the formal claim. ${prompt.slice(0, 80)}…`
  if (/FCFS|SJF|RR|page|FIFO|LRU|process|schedul|fault/i.test(prompt + workId))
    return `Systems/OS (${title}): use the fixed lab instance; fill Gantt or frame table; compute waiting/faults with formulas. ${prompt.slice(0, 80)}…`
  if (/BFS|DFS|Dijkstra|graph|path|MST|greedy|DP|LCS/i.test(prompt + workId))
    return `Algorithms (${title}): run the named algorithm on the given instance; record order/distances; give Θ where asked. ${prompt.slice(0, 80)}…`
  if (/type|λ|scope|eval|interpreter|STLC|big-step|small-step/i.test(prompt + workId))
    return `PL (${title}): write the judgment or reduction sequence; name the rule (T-App, E-Add, …). ${prompt.slice(0, 80)}…`
  if (/train|loss|gradient|perceptron|k-means|overfit|CV/i.test(prompt + workId))
    return `ML (${title}): report the numeric metric from the lab/prompt; state underfit/overfit or update equation. ${prompt.slice(0, 80)}…`
  if (/HTTP|TCP|RTT|delay|routing|window|ACK|DNS/i.test(prompt + workId))
    return `Networks (${title}): plug numbers into L/R or d/s or cwnd rules; state units. ${prompt.slice(0, 80)}…`
  if (/test|ADR|WIP|requirement|DoD|review|SE|process/i.test(prompt + workId))
    return `SE (${title}): give measurable numbers (counts, ms, %) or a 3-part ADR (context/decision/consequences). ${prompt.slice(0, 80)}…`
  return `For ${title}: instantiate the prompt’s concrete values; show one full trace or closed form; end with the claim (Θ / accept / table). Expand fully on paper.`
}

function upgradeFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8')
  let upgraded = 0
  let heuristic = 0
  let curated = 0

  // Walk packs roughly by workId blocks
  const re = /workId:\s*'([^']+)'/g
  const ids = []
  let m
  while ((m = re.exec(src))) ids.push({ id: m[1], index: m.index })

  for (let i = 0; i < ids.length; i++) {
    const { id, index } = ids[i]
    const end = i + 1 < ids.length ? ids[i + 1].index : src.length
    const block = src.slice(index, end)
    const sk = block.match(
      /solutionSketch:\s*\{\s*problemId:\s*'([^']+)',\s*sketch:\s*\n?\s*'((?:\\'|[^'])*)'/,
    )
    if (!sk) continue
    const oldSketch = sk[2].replace(/\\'/g, "'")
    let newSketch = CURATED[id]
    if (newSketch) {
      curated++
    } else if (GENERIC_RE.test(oldSketch) || oldSketch.startsWith('Outline: state assumptions')) {
      // pull problems from block
      const problems = []
      const pr = /id:\s*'([^']+)',\s*\n\s*title:\s*'((?:\\'|[^'])*)'/g
      let pm
      while ((pm = pr.exec(block))) problems.push({ id: pm[1], title: pm[2] })
      const promptM = block.match(/prompt:\s*\n?\s*'((?:\\'|[^'])*)'/)
      if (promptM) problems[0] = { ...(problems[0] || { id: 'p1', title: id }), prompt: promptM[1] }
      newSketch = heuristicSketch(id, problems)
      heuristic++
    } else {
      continue // already custom
    }
    // escape for single-quoted TS string
    const esc = newSketch.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const oldFull = sk[0]
    const neu = `solutionSketch: {\n      problemId: '${sk[1]}',\n      sketch:\n        '${esc}'`
    if (!src.includes(oldFull)) {
      // try multiline sketch already one line
      continue
    }
    src = src.replace(oldFull, neu)
    upgraded++
  }

  fs.writeFileSync(filePath, src)
  return { file: path.basename(filePath), upgraded, curated, heuristic }
}

const root = 'src/content/packs'
const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('-meat.ts') || f === 'other-meat.ts')
  .map((f) => path.join(root, f))

const summary = files.map(upgradeFile)
console.log(JSON.stringify(summary, null, 2))
const tot = summary.reduce((a, s) => a + s.upgraded, 0)
console.log('total upgraded', tot)
