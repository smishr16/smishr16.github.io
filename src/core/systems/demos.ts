import type { ISystemsDemo, SystemsFrame, SystemsJob } from '../../contracts/systems'

const DEMO_JOBS: SystemsJob[] = [
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 3 },
  { id: 'P3', arrival: 2, burst: 8 },
  { id: 'P4', arrival: 3, burst: 2 },
]

function ganttFrames(
  title: string,
  policy: string,
  slices: { jobId: string; start: number; end: number }[],
  jobs: SystemsJob[],
  notes: string[],
): SystemsFrame[] {
  const frames: SystemsFrame[] = [
    {
      kind: 'gantt',
      title,
      statusText: `${policy}: jobs ready`,
      jobs,
      slices: [],
      metrics: 't=0',
      panels: [{ title: 'Jobs', lines: jobs.map((j) => `${j.id}: arrival=${j.arrival} burst=${j.burst}`) }],
    },
  ]
  for (let i = 0; i < slices.length; i++) {
    const partial = slices.slice(0, i + 1).map((s, idx) => ({
      ...s,
      active: idx === i,
    }))
    const s = slices[i]!
    frames.push({
      kind: 'gantt',
      title,
      statusText: `${policy}: run ${s.jobId} [${s.start}, ${s.end})`,
      jobs,
      slices: partial,
      metrics: `t=${s.end} · completed slice ${i + 1}/${slices.length}`,
      panels: [
        { title: 'Jobs', lines: jobs.map((j) => `${j.id}: arrival=${j.arrival} burst=${j.burst}`) },
        { title: 'Notes', lines: notes },
      ],
    })
  }
  const makespan = slices.length ? slices[slices.length - 1]!.end : 0
  frames.push({
    kind: 'gantt',
    title,
    statusText: `${policy}: complete · makespan=${makespan}`,
    jobs,
    slices: slices.map((s) => ({ ...s, active: false })),
    metrics: `makespan=${makespan}`,
    panels: [
      { title: 'Metrics', lines: [`Makespan: ${makespan}`, ...notes] },
    ],
  })
  return frames
}

function scheduleFcfs(): SystemsFrame[] {
  const jobs = DEMO_JOBS
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id))
  let t = 0
  const slices: { jobId: string; start: number; end: number }[] = []
  for (const j of sorted) {
    t = Math.max(t, j.arrival)
    slices.push({ jobId: j.id, start: t, end: t + j.burst })
    t += j.burst
  }
  return ganttFrames('CPU scheduling · FCFS', 'FCFS', slices, jobs, [
    'First-come first-served (non-preemptive)',
    'Simple; convoy effect possible',
    'Turnaround = finish − arrival',
  ])
}

function scheduleSjf(): SystemsFrame[] {
  const jobs = DEMO_JOBS.map((j) => ({ ...j }))
  const remaining = new Map(jobs.map((j) => [j.id, j.burst]))
  const arrived: SystemsJob[] = []
  let t = 0
  const slices: { jobId: string; start: number; end: number }[] = []
  const done = new Set<string>()
  while (done.size < jobs.length) {
    for (const j of jobs) {
      if (j.arrival <= t && !done.has(j.id) && !arrived.find((a) => a.id === j.id)) arrived.push(j)
    }
    const ready = arrived.filter((j) => !done.has(j.id))
    if (!ready.length) {
      t++
      continue
    }
    ready.sort((a, b) => (remaining.get(a.id) ?? 0) - (remaining.get(b.id) ?? 0) || a.id.localeCompare(b.id))
    const j = ready[0]!
    const burst = remaining.get(j.id)!
    slices.push({ jobId: j.id, start: t, end: t + burst })
    t += burst
    done.add(j.id)
  }
  return ganttFrames('CPU scheduling · SJF', 'SJF (non-preemptive)', slices, DEMO_JOBS, [
    'Shortest job first among arrived jobs',
    'Optimal average waiting under non-preemptive assumptions',
    'Starvation risk for long jobs',
  ])
}

function scheduleRr(): SystemsFrame[] {
  const quantum = 2
  const jobs = DEMO_JOBS.map((j) => ({ ...j }))
  const rem = new Map(jobs.map((j) => [j.id, j.burst]))
  const queue: string[] = []
  const inQ = new Set<string>()
  let t = 0
  const slices: { jobId: string; start: number; end: number }[] = []
  const done = new Set<string>()

  function enqueueArrivals(upto: number) {
    for (const j of jobs) {
      if (j.arrival <= upto && !done.has(j.id) && !inQ.has(j.id) && (rem.get(j.id) ?? 0) > 0) {
        queue.push(j.id)
        inQ.add(j.id)
      }
    }
  }

  enqueueArrivals(0)
  while (done.size < jobs.length) {
    enqueueArrivals(t)
    if (!queue.length) {
      t++
      enqueueArrivals(t)
      continue
    }
    const id = queue.shift()!
    inQ.delete(id)
    const left = rem.get(id)!
    const run = Math.min(quantum, left)
    slices.push({ jobId: id, start: t, end: t + run })
    t += run
    rem.set(id, left - run)
    enqueueArrivals(t)
    if ((rem.get(id) ?? 0) > 0) {
      queue.push(id)
      inQ.add(id)
    } else {
      done.add(id)
    }
  }
  return ganttFrames('CPU scheduling · Round Robin', `RR q=${quantum}`, slices, DEMO_JOBS, [
    `Time quantum q=${quantum}`,
    'Preemptive; fairer response time',
    'Context-switch overhead ignored in this toy',
  ])
}

function pageFrames(policy: 'fifo' | 'lru'): SystemsFrame[] {
  const framesCount = 3
  const refs = [1, 2, 3, 2, 4, 1, 5, 2, 1, 3]
  const slots: (number | null)[] = Array(framesCount).fill(null)
  const order: number[] = [] // fifo queue / lru recency
  const out: SystemsFrame[] = [
    {
      kind: 'frames',
      title: `Page replacement · ${policy.toUpperCase()}`,
      statusText: 'Empty frames',
      framesSlots: slots.map(() => ({ page: null })),
      refString: refs,
      refIndex: -1,
      metrics: 'frames=3 · faults=0',
      panels: [{ title: 'Reference string', lines: [refs.join(' ')] }],
    },
  ]
  let faults = 0
  for (let i = 0; i < refs.length; i++) {
    const p = refs[i]!
    const hit = slots.includes(p)
    let victim: number | null = null
    const roles: ('hit' | 'miss' | 'victim' | 'default')[] = slots.map(() => 'default')
    if (hit) {
      const idx = slots.indexOf(p)
      roles[idx] = 'hit'
      if (policy === 'lru') {
        const o = order.indexOf(p)
        if (o >= 0) order.splice(o, 1)
        order.push(p)
      }
      out.push({
        kind: 'frames',
        title: `Page replacement · ${policy.toUpperCase()}`,
        statusText: `ref ${p} → HIT`,
        framesSlots: slots.map((page, j) => ({ page, role: roles[j] })),
        refString: refs,
        refIndex: i,
        metrics: `faults=${faults} · t=${i + 1}`,
        panels: [
          { title: 'Reference string', lines: [refs.map((r, k) => (k === i ? `[${r}]` : `${r}`)).join(' ')] },
          { title: 'Notes', lines: policy === 'fifo' ? ['FIFO ignores recency on hit'] : ['LRU updates recency on hit'] },
        ],
      })
    } else {
      faults++
      let place = slots.indexOf(null)
      if (place < 0) {
        victim = policy === 'fifo' ? order[0]! : order[0]!
        place = slots.indexOf(victim)
        roles[place] = 'victim'
        order.shift()
      }
      slots[place] = p
      order.push(p)
      roles[place] = 'miss'
      out.push({
        kind: 'frames',
        title: `Page replacement · ${policy.toUpperCase()}`,
        statusText: victim != null ? `ref ${p} → FAULT (evict ${victim})` : `ref ${p} → FAULT (fill empty)`,
        framesSlots: slots.map((page, j) => ({ page, role: roles[j] })),
        refString: refs,
        refIndex: i,
        metrics: `faults=${faults} · t=${i + 1}`,
        panels: [
          { title: 'Reference string', lines: [refs.map((r, k) => (k === i ? `[${r}]` : `${r}`)).join(' ')] },
          {
            title: 'Policy',
            lines:
              policy === 'fifo'
                ? ['Evict oldest loaded page', `Queue: ${order.join(' → ')}`]
                : ['Evict least recently used', `LRU order (old→new): ${order.join(' → ')}`],
          },
        ],
      })
    }
  }
  out.push({
    kind: 'frames',
    title: `Page replacement · ${policy.toUpperCase()}`,
    statusText: `Done · ${faults} page faults`,
    framesSlots: slots.map((page) => ({ page })),
    refString: refs,
    refIndex: refs.length - 1,
    metrics: `faults=${faults} / ${refs.length}`,
    panels: [{ title: 'Summary', lines: [`Faults: ${faults}`, `Hit rate: ${(((refs.length - faults) / refs.length) * 100).toFixed(0)}%`] }],
  })
  return out
}

function processLifecycle(): SystemsFrame[] {
  type St = 'new' | 'ready' | 'running' | 'blocked' | 'terminated'
  const steps: { id: string; state: St; status: string }[][] = [
    [{ id: 'A', state: 'new', status: 'Process A created' }],
    [
      { id: 'A', state: 'ready', status: 'A admitted → ready' },
      { id: 'B', state: 'new', status: 'B created' },
    ],
    [
      { id: 'A', state: 'running', status: 'Scheduler dispatches A' },
      { id: 'B', state: 'ready', status: 'B ready' },
    ],
    [
      { id: 'A', state: 'blocked', status: 'A blocks on I/O' },
      { id: 'B', state: 'running', status: 'B runs' },
    ],
    [
      { id: 'A', state: 'ready', status: 'A I/O done → ready' },
      { id: 'B', state: 'running', status: 'B still running' },
    ],
    [
      { id: 'A', state: 'running', status: 'A runs' },
      { id: 'B', state: 'terminated', status: 'B exits' },
    ],
    [
      { id: 'A', state: 'terminated', status: 'A exits' },
      { id: 'B', state: 'terminated', status: 'B terminated' },
    ],
  ]
  return steps.map((procs, i) => ({
    kind: 'process' as const,
    title: 'Process state machine',
    statusText: procs.map((p) => p.status).join(' · '),
    processes: procs.map((p) => ({ id: p.id, state: p.state, role: p.state === 'running' ? 'active' : undefined })),
    metrics: `step ${i + 1}/${steps.length}`,
    panels: [
      {
        title: 'Classic states',
        lines: ['new → ready → running', 'running → blocked (I/O) → ready', 'running → terminated'],
      },
    ],
  }))
}

/** Direct-mapped cache: 4 lines, block = address >> 2, line = block % 4, tag = block >> 2 */
function cacheDirect(): SystemsFrame[] {
  const lines = 4
  const tags: (string | null)[] = Array(lines).fill(null)
  // addresses as decimal "memory words"
  const addrs = [0, 4, 8, 0, 16, 4, 20, 8, 0]
  const frames: SystemsFrame[] = [
    {
      kind: 'cache',
      title: 'Direct-mapped cache (4 lines)',
      statusText: 'Cold cache',
      cacheLines: tags.map(() => ({ tag: null })),
      metrics: 'hits=0 misses=0',
      panels: [
        {
          title: 'Model',
          lines: [
            'line = (addr/4) mod 4',
            'tag = floor((addr/4) / 4)',
            'Teaching toy — not a full MESI hierarchy',
          ],
        },
      ],
    },
  ]
  let hits = 0
  let misses = 0
  for (const addr of addrs) {
    const block = Math.floor(addr / 4)
    const line = block % lines
    const tag = String(Math.floor(block / lines))
    const hit = tags[line] === tag
    const roles = tags.map((_, i) =>
      i === line ? (hit ? ('hit' as const) : ('miss' as const)) : ('default' as const),
    )
    if (hit) hits++
    else {
      misses++
      tags[line] = tag
    }
    frames.push({
      kind: 'cache',
      title: 'Direct-mapped cache (4 lines)',
      statusText: hit
        ? `addr ${addr} → HIT line ${line} tag ${tag}`
        : `addr ${addr} → MISS line ${line} install tag ${tag}`,
      cacheLines: tags.map((t, i) => ({ tag: t, role: roles[i] })),
      metrics: `hits=${hits} misses=${misses} · stream=[${addrs.join(',')}]`,
      panels: [
        {
          title: 'Access',
          lines: [`addr=${addr}`, `block=${block}`, `line=${line}`, `tag=${tag}`, hit ? 'HIT' : 'MISS'],
        },
      ],
    })
  }
  frames.push({
    kind: 'cache',
    title: 'Direct-mapped cache (4 lines)',
    statusText: `Done · hit rate ${(hits / addrs.length).toFixed(2)}`,
    cacheLines: tags.map((t) => ({ tag: t })),
    metrics: `hits=${hits} misses=${misses}`,
    panels: [{ title: 'Summary', lines: [`Hit rate: ${hits}/${addrs.length}`, 'Conflict misses possible with 4 lines'] }],
  })
  return frames
}

function stackCalls(): SystemsFrame[] {
  const steps: { stack: { label: string; role?: 'active' | 'return' | 'default' }[]; status: string }[] = [
    { stack: [{ label: 'main', role: 'active' }], status: 'Enter main' },
    {
      stack: [
        { label: 'main' },
        { label: 'foo(3)', role: 'active' },
      ],
      status: 'Call foo(3) — push frame',
    },
    {
      stack: [
        { label: 'main' },
        { label: 'foo(3)' },
        { label: 'bar(2)', role: 'active' },
      ],
      status: 'Call bar(2) — nested frame',
    },
    {
      stack: [
        { label: 'main' },
        { label: 'foo(3)', role: 'return' },
      ],
      status: 'Return from bar — pop; resume foo',
    },
    {
      stack: [{ label: 'main', role: 'active' }],
      status: 'Return from foo — back in main',
    },
    { stack: [], status: 'main returns — stack empty' },
  ]
  return steps.map((s, i) => ({
    kind: 'stack' as const,
    title: 'Call stack (toy)',
    statusText: s.status,
    stackFrames: s.stack,
    metrics: `depth=${s.stack.length} · step ${i + 1}/${steps.length}`,
    panels: [
      {
        title: 'Notes',
        lines: [
          'Each call pushes a frame (locals + return addr concept)',
          'Return pops the frame',
          'Overflow: too-deep recursion exceeds stack limit',
        ],
      },
    ],
  }))
}

/** Fixed binary game tree; minimax bottom-up highlight. */
function minimaxTree(): SystemsFrame[] {
  //        A(max)
  //      /       \
  //    B(min)    C(min)
  //   / \       / \
  //  3  12     8   2
  const nodesBase = [
    { id: 'A', label: 'A max', x: 0.5, y: 0.12 },
    { id: 'B', label: 'B min', x: 0.28, y: 0.4 },
    { id: 'C', label: 'C min', x: 0.72, y: 0.4 },
    { id: 'B1', label: '3', x: 0.16, y: 0.72 },
    { id: 'B2', label: '12', x: 0.4, y: 0.72 },
    { id: 'C1', label: '8', x: 0.6, y: 0.72 },
    { id: 'C2', label: '2', x: 0.84, y: 0.72 },
  ]
  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'B1' },
    { from: 'B', to: 'B2' },
    { from: 'C', to: 'C1' },
    { from: 'C', to: 'C2' },
  ]
  const frames: SystemsFrame[] = [
    {
      kind: 'tree',
      title: 'Minimax (depth-2 toy)',
      statusText: 'Leaf utilities given',
      treeNodes: nodesBase.map((n) => ({ ...n, role: 'default' })),
      treeEdges: edges,
      panels: [{ title: 'Rules', lines: ['Max at root A', 'Min at B,C', 'Leaves are utilities'] }],
    },
    {
      kind: 'tree',
      title: 'Minimax (depth-2 toy)',
      statusText: 'B = min(3,12) = 3',
      treeNodes: nodesBase.map((n) => ({
        ...n,
        role: n.id === 'B' || n.id === 'B1' ? 'active' : 'default',
        value: n.id === 'B' ? '3' : undefined,
      })),
      treeEdges: edges,
      metrics: 'B←3',
    },
    {
      kind: 'tree',
      title: 'Minimax (depth-2 toy)',
      statusText: 'C = min(8,2) = 2',
      treeNodes: nodesBase.map((n) => ({
        ...n,
        role: n.id === 'C' || n.id === 'C2' ? 'active' : n.id === 'B' ? 'done' : 'default',
        value: n.id === 'B' ? '3' : n.id === 'C' ? '2' : undefined,
      })),
      treeEdges: edges,
      metrics: 'C←2',
    },
    {
      kind: 'tree',
      title: 'Minimax (depth-2 toy)',
      statusText: 'A = max(3,2) = 3 — choose left',
      treeNodes: nodesBase.map((n) => ({
        ...n,
        role: n.id === 'A' || n.id === 'B' ? 'path' : n.id === 'B1' ? 'path' : 'default',
        value: n.id === 'A' ? '3' : n.id === 'B' ? '3' : n.id === 'C' ? '2' : undefined,
      })),
      treeEdges: edges,
      metrics: 'optimal value 3 · action → B',
      panels: [{ title: 'Result', lines: ['Root value = 3', 'First move toward B', 'Compare to AI M5 paper set'] }],
    },
  ]
  return frames
}

/** DFA for even number of 0s on {0,1}*. States E (even/accept), O (odd). */
function dfaEven0(opts?: { input?: string }): SystemsFrame[] {
  const raw = (opts?.input ?? '01001').replace(/[^01]/g, '') || '01001'
  const str = raw.slice(0, 24)
  const frames: SystemsFrame[] = []
  let state: 'E' | 'O' = 'E'
  const nodes = (cur: string) => [
    { id: 'E', label: 'E (acc)', x: 0.3, y: 0.45, role: cur === 'E' ? 'active' : 'default' },
    { id: 'O', label: 'O', x: 0.7, y: 0.45, role: cur === 'O' ? 'active' : 'default' },
  ]
  const edges = [
    { from: 'E', to: 'O' },
    { from: 'O', to: 'E' },
    { from: 'E', to: 'E' },
    { from: 'O', to: 'O' },
  ]
  frames.push({
    kind: 'tree',
    title: 'DFA · even number of 0s',
    statusText: `Start in E · input "${str}"`,
    treeNodes: nodes('E'),
    treeEdges: edges,
    metrics: 'accepting = E',
    panels: [
      {
        title: 'δ',
        lines: ['δ(E,0)=O  δ(E,1)=E', 'δ(O,0)=E  δ(O,1)=O', 'L = { w | #0(w) even }'],
      },
    ],
  })
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]!
    const prev = state
    if (ch === '0') state = state === 'E' ? 'O' : 'E'
    // 1 self-loop
    frames.push({
      kind: 'tree',
      title: 'DFA · even number of 0s',
      statusText: `Read '${ch}' · ${prev} → ${state}`,
      treeNodes: nodes(state),
      treeEdges: edges,
      metrics: `consumed "${str.slice(0, i + 1)}" · remaining "${str.slice(i + 1)}"`,
      panels: [
        {
          title: 'Run',
          lines: [`symbol ${ch}`, `${prev} --${ch}→ ${state}`, state === 'E' ? 'in accept so far' : 'not accepting yet'],
        },
      ],
    })
  }
  frames.push({
    kind: 'tree',
    title: 'DFA · even number of 0s',
    statusText: state === 'E' ? 'ACCEPT (even zeros)' : 'REJECT',
    treeNodes: nodes(state).map((n) => ({
      ...n,
      role: n.id === state ? (state === 'E' ? 'path' : 'active') : 'default',
    })),
    treeEdges: edges,
    metrics: `final state ${state}`,
  })
  return frames
}

/** Packet along path with cumulative delay. */
function networkPath(): SystemsFrame[] {
  const hops = [
    { name: 'Client', tx: 0, prop: 0 },
    { name: 'R1', tx: 1.2, prop: 2 },
    { name: 'R2', tx: 1.2, prop: 5 },
    { name: 'Server', tx: 0, prop: 0 },
  ]
  let t = 0
  const frames: SystemsFrame[] = []
  const nodes = hops.map((h, i) => ({
    id: h.name,
    label: h.name,
    x: 0.12 + i * 0.25,
    y: 0.45,
    role: 'default' as string | undefined,
  }))
  const edges = [
    { from: 'Client', to: 'R1' },
    { from: 'R1', to: 'R2' },
    { from: 'R2', to: 'Server' },
  ]
  frames.push({
    kind: 'tree',
    title: 'Store-and-forward path (toy)',
    statusText: 'Packet at Client · L/R model simplified',
    treeNodes: nodes.map((n, i) => ({ ...n, role: i === 0 ? 'active' : 'default' })),
    treeEdges: edges,
    metrics: 't=0 ms',
    panels: [
      {
        title: 'Assumptions',
        lines: [
          'Per-hop: transmission + propagation (ms units toy)',
          'R1: tx=1.2 prop=2; R2: tx=1.2 prop=5',
          'Ignore queueing/processing',
        ],
      },
    ],
  })
  for (let i = 0; i < hops.length - 1; i++) {
    const hop = hops[i + 1]!
    t += hop.tx + hop.prop
    frames.push({
      kind: 'tree',
      title: 'Store-and-forward path (toy)',
      statusText: `Arrive ${hop.name} · +tx ${hop.tx} +prop ${hop.prop}`,
      treeNodes: nodes.map((n, j) => ({
        ...n,
        role: j === i + 1 ? 'active' : j <= i + 1 ? 'done' : 'default',
      })),
      treeEdges: edges,
      metrics: `t≈${t.toFixed(1)} ms cumulative`,
      panels: [
        {
          title: 'Delay so far',
          lines: [`cumulative ≈ ${t.toFixed(1)} ms`, `last hop tx=${hop.tx} prop=${hop.prop}`],
        },
      ],
    })
  }
  frames.push({
    kind: 'tree',
    title: 'Store-and-forward path (toy)',
    statusText: `Done at Server · total ≈ ${t.toFixed(1)} ms`,
    treeNodes: nodes.map((n) => ({ ...n, role: n.id === 'Server' ? 'path' : 'done' })),
    treeEdges: edges,
    metrics: `end-to-end ≈ ${t.toFixed(1)} ms`,
  })
  return frames
}

/** DFA for strings ending in 01. States: S (start), Saw0, Acc (ends with 01). */
function dfaEnds01(): SystemsFrame[] {
  const str = '11001'
  type St = 'S' | '0' | 'A'
  const labels: Record<St, string> = { S: 'S', '0': 'Saw0', A: 'Acc' }
  let state: St = 'S'
  const step = (s: St, ch: string): St => {
    if (ch === '0') return '0'
    // ch === '1'
    if (s === '0') return 'A'
    return 'S'
  }
  const nodes = (cur: St) => [
    { id: 'S', label: 'S', x: 0.2, y: 0.5, role: cur === 'S' ? 'active' : 'default' },
    { id: '0', label: 'Saw0', x: 0.5, y: 0.5, role: cur === '0' ? 'active' : 'default' },
    { id: 'A', label: 'Acc', x: 0.8, y: 0.5, role: cur === 'A' ? 'active' : 'default' },
  ]
  const edges = [
    { from: 'S', to: '0' },
    { from: '0', to: 'A' },
    { from: 'A', to: '0' },
    { from: 'S', to: 'S' },
    { from: '0', to: 'S' },
    { from: 'A', to: 'S' },
  ]
  const frames: SystemsFrame[] = [
    {
      kind: 'tree',
      title: 'DFA · ends with 01',
      statusText: `Start in S · input "${str}"`,
      treeNodes: nodes('S'),
      treeEdges: edges,
      metrics: 'accepting = Acc',
      panels: [
        {
          title: 'δ',
          lines: [
            'δ(*,0)=Saw0',
            'δ(Saw0,1)=Acc; δ(S,1)=S; δ(Acc,1)=S',
            'L = { w ∈ {0,1}* | w ends with 01 }',
          ],
        },
      ],
    },
  ]
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]!
    const prev = state
    state = step(state, ch)
    frames.push({
      kind: 'tree',
      title: 'DFA · ends with 01',
      statusText: `Read '${ch}' · ${labels[prev]} → ${labels[state]}`,
      treeNodes: nodes(state),
      treeEdges: edges,
      metrics: `consumed "${str.slice(0, i + 1)}"`,
      panels: [
        {
          title: 'Run',
          lines: [`${labels[prev]} --${ch}→ ${labels[state]}`, state === 'A' ? 'accepting so far' : 'not accepting'],
        },
      ],
    })
  }
  frames.push({
    kind: 'tree',
    title: 'DFA · ends with 01',
    statusText: state === 'A' ? 'ACCEPT' : 'REJECT',
    treeNodes: nodes(state).map((n) => ({
      ...n,
      role: n.id === (state === 'A' ? 'A' : state === '0' ? '0' : 'S') ? (state === 'A' ? 'path' : 'active') : 'default',
    })),
    treeEdges: edges,
    metrics: `final ${labels[state]}`,
  })
  return frames
}

/** Leftmost derivation for aabb via S→aSb | ε style CFG (toy). */
function cfgAnbn(): SystemsFrame[] {
  // S → a S b | ε  derives aabb
  const steps = [
    { sent: 'S', note: 'start symbol' },
    { sent: 'a S b', note: 'S → aSb' },
    { sent: 'a a S b b', note: 'S → aSb' },
    { sent: 'a a ε b b', note: 'S → ε' },
    { sent: 'a a b b', note: 'erase ε · terminal string aabb' },
  ]
  return steps.map((s, i) => ({
    kind: 'tree' as const,
    title: 'CFG derivation · aⁿbⁿ',
    statusText: s.note,
    treeNodes: [
      { id: 'root', label: s.sent, x: 0.5, y: 0.45, role: i === steps.length - 1 ? 'path' : 'active' },
    ],
    treeEdges: [],
    metrics: `step ${i + 1}/${steps.length}`,
    panels: [
      {
        title: 'Grammar',
        lines: ['S → a S b | ε', 'Leftmost derivation of aabb (n=2)', 'Parse tree would nest a…b pairs'],
      },
    ],
  }))
}

/** Stop-and-wait then window=2 pipeline (toy sequence numbers). */
function slidingWindow(): SystemsFrame[] {
  const frames: SystemsFrame[] = []
  // Stop-and-wait: send 0, wait ACK0, send 1, wait ACK1
  const saw = [
    { status: 'Send DATA0', seq: 'DATA0 →', win: 'window=1' },
    { status: 'Wait… ACK0 arrives', seq: '← ACK0', win: 'window=1' },
    { status: 'Send DATA1', seq: 'DATA1 →', win: 'window=1' },
    { status: 'Wait… ACK1 arrives', seq: '← ACK1', win: 'window=1' },
  ]
  frames.push({
    kind: 'process',
    title: 'ARQ · stop-and-wait vs window',
    statusText: 'Stop-and-wait: only 1 outstanding packet',
    processes: [
      { id: 'Snd', state: 'ready', role: 'sender' },
      { id: 'Rcv', state: 'ready', role: 'receiver' },
    ],
    metrics: 'phase 1 · stop-and-wait',
    panels: [{ title: 'Idea', lines: ['One unacked packet max', 'Long RTT ⇒ low utilization', 'Next: pipeline with window=2'] }],
  })
  for (const s of saw) {
    frames.push({
      kind: 'process',
      title: 'ARQ · stop-and-wait vs window',
      statusText: s.status,
      processes: [
        { id: 'Snd', state: s.status.startsWith('Wait') ? 'blocked' : 'running', role: 'sender' },
        { id: 'Rcv', state: s.seq.includes('ACK') ? 'running' : 'ready', role: 'receiver' },
      ],
      metrics: s.win,
      panels: [{ title: 'Wire', lines: [s.seq, s.win] }],
    })
  }
  frames.push({
    kind: 'process',
    title: 'ARQ · stop-and-wait vs window',
    statusText: 'Window=2: send DATA0 and DATA1 without waiting between',
    processes: [
      { id: 'Snd', state: 'running', role: 'sender' },
      { id: 'Rcv', state: 'ready', role: 'receiver' },
    ],
    metrics: 'phase 2 · window=2',
    panels: [
      {
        title: 'Pipeline',
        lines: [
          'Outstanding: DATA0, DATA1 (window full)',
          'ACKs can return out of order in SR; GBN rewinds',
          'Utilization ↑ when BDP > 1 packet',
        ],
      },
    ],
  })
  frames.push({
    kind: 'process',
    title: 'ARQ · stop-and-wait vs window',
    statusText: 'ACK0, ACK1 return · window slides forward',
    processes: [
      { id: 'Snd', state: 'ready', role: 'sender' },
      { id: 'Rcv', state: 'terminated', role: 'receiver' },
    ],
    metrics: 'done',
    panels: [{ title: 'Takeaway', lines: ['Window size pipelines the pipe', 'Loss recovery differs GBN vs SR', 'Toy only — no real loss inject'] }],
  })
  return frames
}

/** Nested-loop join on tiny R ⋈ S. */
function nlJoin(): SystemsFrame[] {
  const R = [
    { id: 'r1', a: 1, b: 'x' },
    { id: 'r2', a: 2, b: 'y' },
    { id: 'r3', a: 3, b: 'z' },
  ]
  const S = [
    { id: 's1', a: 2, c: 10 },
    { id: 's2', a: 3, c: 20 },
    { id: 's3', a: 4, c: 30 },
  ]
  const frames: SystemsFrame[] = [
    {
      kind: 'process',
      title: 'Nested-loop join R ⋈ S on a',
      statusText: 'Outer R, inner S · equality on a',
      processes: [
        ...R.map((r) => ({ id: r.id, state: 'ready' as const, role: `R a=${r.a}` })),
        ...S.map((s) => ({ id: s.id, state: 'ready' as const, role: `S a=${s.a}` })),
      ],
      metrics: '|R|=3 |S|=3',
      panels: [
        {
          title: 'Tables',
          lines: [
            'R: (1,x) (2,y) (3,z)',
            'S: (2,10) (3,20) (4,30)',
            'Cost idea: |R|·|S| probe comparisons',
          ],
        },
      ],
    },
  ]
  const matches: string[] = []
  for (const r of R) {
    frames.push({
      kind: 'process',
      title: 'Nested-loop join R ⋈ S on a',
      statusText: `Outer row ${r.id} a=${r.a} · scan all of S`,
      processes: [
        ...R.map((row) => ({
          id: row.id,
          state: (row.id === r.id ? 'running' : 'ready') as 'running' | 'ready',
          role: `R a=${row.a}`,
        })),
        ...S.map((s) => ({ id: s.id, state: 'ready' as const, role: `S a=${s.a}` })),
      ],
      metrics: `matches so far: ${matches.join(', ') || '∅'}`,
    })
    for (const s of S) {
      const hit = r.a === s.a
      if (hit) matches.push(`(${r.a},${r.b},${s.c})`)
      frames.push({
        kind: 'process',
        title: 'Nested-loop join R ⋈ S on a',
        statusText: hit
          ? `Match ${r.id} ⋈ ${s.id} → emit (${r.a},${r.b},${s.c})`
          : `Probe ${r.id} vs ${s.id}: ${r.a}≠${s.a}`,
        processes: [
          ...R.map((row) => ({
            id: row.id,
            state: (row.id === r.id ? 'running' : 'ready') as 'running' | 'ready',
            role: `R a=${row.a}`,
          })),
          ...S.map((row) => ({
            id: row.id,
            state: (row.id === s.id ? (hit ? 'blocked' : 'running') : 'ready') as
              | 'blocked'
              | 'running'
              | 'ready',
            role: `S a=${row.a}`,
          })),
        ],
        metrics: `matches: ${matches.join(', ') || '∅'}`,
      })
    }
  }
  frames.push({
    kind: 'process',
    title: 'Nested-loop join R ⋈ S on a',
    statusText: `Done · result ${matches.join(' ')}`,
    processes: [
      ...R.map((r) => ({ id: r.id, state: 'terminated' as const, role: `R a=${r.a}` })),
      ...S.map((s) => ({ id: s.id, state: 'terminated' as const, role: `S a=${s.a}` })),
    ],
    metrics: `${matches.length} tuples · 9 probes`,
    panels: [
      {
        title: 'Result',
        lines: [...matches, 'Hash/sort-merge beat NLJ at scale when selectivity allows'],
      },
    ],
  })
  return frames
}

/** Static env chain: lookup x in nested frames. */
function envLookup(): SystemsFrame[] {
  // global {x:1} → f {y:2} → g {x:9}  lookup x from g body → 9; lookup y → 2; lookup z miss
  const frames: SystemsFrame[] = []
  const chain = (active: number, highlight?: string) => {
    const levels = [
      { id: 'G', label: 'global {x↦1}', x: 0.5, y: 0.2 },
      { id: 'F', label: 'f {y↦2}', x: 0.5, y: 0.45 },
      { id: 'g', label: 'g {x↦9}', x: 0.5, y: 0.7 },
    ]
    return levels.map((n, i) => ({
      ...n,
      role: i === active ? 'active' : i < active ? 'done' : 'default',
      value: highlight && i === active ? highlight : undefined,
    }))
  }
  const edges = [
    { from: 'g', to: 'F' },
    { from: 'F', to: 'G' },
  ]
  frames.push({
    kind: 'tree',
    title: 'Environment chain (static scope)',
    statusText: 'Call stack of envs: g → f → global',
    treeNodes: chain(2),
    treeEdges: edges,
    panels: [
      {
        title: 'Setup',
        lines: [
          'global: x↦1',
          'f closes over global; binds y↦2',
          'g closes over f; binds x↦9 (shadows)',
        ],
      },
    ],
  })
  frames.push({
    kind: 'tree',
    title: 'Environment chain (static scope)',
    statusText: 'Lookup x in g · hit local binding 9',
    treeNodes: chain(2, 'x=9'),
    treeEdges: edges,
    metrics: 'x ↦ 9',
  })
  frames.push({
    kind: 'tree',
    title: 'Environment chain (static scope)',
    statusText: 'Lookup y in g · miss local → parent f → y=2',
    treeNodes: chain(1, 'y=2'),
    treeEdges: edges,
    metrics: 'y ↦ 2',
  })
  frames.push({
    kind: 'tree',
    title: 'Environment chain (static scope)',
    statusText: 'Lookup z · miss all frames → unbound error',
    treeNodes: chain(0, 'z?'),
    treeEdges: edges,
    metrics: 'unbound z',
    panels: [{ title: 'Static vs dynamic', lines: ['Chain follows definition (lexical)', 'Dynamic scope would walk the call stack differently'] }],
  })
  return frames
}

/** Real PDA for aⁿbⁿ: push A on a, pop on b; accept by empty stack after all input. */
function pdaAnbn(): SystemsFrame[] {
  const str = 'aabb'
  type St = 'q0' | 'q1' | 'qa'
  const stack: string[] = ['Z'] // bottom marker
  const frames: SystemsFrame[] = []
  const stackView = (topHighlight = false) =>
    stack.map((s, i) => ({
      label: s,
      role: (i === stack.length - 1 ? (topHighlight ? 'active' : 'default') : 'default') as
        | 'active'
        | 'default',
    }))
  const stateNodes = (cur: St) => [
    { id: 'q0', label: 'q0 start', x: 0.2, y: 0.25, role: cur === 'q0' ? 'active' : 'default' },
    { id: 'q1', label: 'q1', x: 0.5, y: 0.25, role: cur === 'q1' ? 'active' : 'default' },
    { id: 'qa', label: 'qa acc', x: 0.8, y: 0.25, role: cur === 'qa' ? 'path' : 'default' },
  ]
  frames.push({
    kind: 'stack',
    title: 'PDA · aⁿbⁿ',
    statusText: `Start q0 · input "${str}" · stack [Z]`,
    stackFrames: stackView(),
    treeNodes: stateNodes('q0'),
    treeEdges: [
      { from: 'q0', to: 'q1' },
      { from: 'q1', to: 'qa' },
    ],
    metrics: 'push A on a; pop A on b',
    panels: [
      {
        title: 'δ (sketch)',
        lines: [
          'δ(q0,a,Z/A)=(q0, AZ/AA)  push A',
          'δ(q0,b,A)=(q1, ε)  first b → pop, enter q1',
          'δ(q1,b,A)=(q1, ε)  more b → pop',
          'δ(q1,ε,Z)=(qa, Z)  empty stack marker → accept',
        ],
      },
    ],
  })
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]!
    if (ch === 'a') {
      stack.push('A')
      frames.push({
        kind: 'stack',
        title: 'PDA · aⁿbⁿ',
        statusText: `Read 'a' · push A · state q0`,
        stackFrames: stackView(true),
        treeNodes: stateNodes('q0'),
        treeEdges: [
          { from: 'q0', to: 'q1' },
          { from: 'q1', to: 'qa' },
        ],
        metrics: `consumed "${str.slice(0, i + 1)}" · stack height ${stack.length}`,
        panels: [{ title: 'Stack (bottom→top)', lines: [...stack] }],
      })
    } else {
      // b
      const top = stack[stack.length - 1]
      if (top === 'A') {
        stack.pop()
        frames.push({
          kind: 'stack',
          title: 'PDA · aⁿbⁿ',
          statusText: `Read 'b' · pop A · state q1`,
          stackFrames: stackView(true),
          treeNodes: stateNodes('q1'),
          treeEdges: [
            { from: 'q0', to: 'q1' },
            { from: 'q1', to: 'qa' },
          ],
          metrics: `consumed "${str.slice(0, i + 1)}" · stack height ${stack.length}`,
          panels: [{ title: 'Stack (bottom→top)', lines: [...stack] }],
        })
      } else {
        frames.push({
          kind: 'stack',
          title: 'PDA · aⁿbⁿ',
          statusText: `Read 'b' · stuck (top≠A) · REJECT`,
          stackFrames: stackView(true),
          treeNodes: stateNodes('q1'),
          metrics: 'reject',
        })
        return frames
      }
    }
  }
  if (stack.length === 1 && stack[0] === 'Z') {
    frames.push({
      kind: 'stack',
      title: 'PDA · aⁿbⁿ',
      statusText: 'ε-move on Z · ACCEPT by empty stack (marker only)',
      stackFrames: stackView(),
      treeNodes: stateNodes('qa'),
      treeEdges: [
        { from: 'q0', to: 'q1' },
        { from: 'q1', to: 'qa' },
      ],
      metrics: 'ACCEPT · n=2 for aabb',
      panels: [{ title: 'Result', lines: ['Matched 2 a with 2 b', 'Real PDA — not a call-stack metaphor'] }],
    })
  }
  return frames
}

/** Single-tape TM that checks aⁿbⁿ for n=2 on tape □aabb□ (high-level steps). */
function tmAnbn(): SystemsFrame[] {
  // Tape cells as process "frames" metaphor — use panels for tape + tree for states
  type Cell = string
  const tape: Cell[] = ['□', 'a', 'a', 'b', 'b', '□']
  let head = 1
  let state = 'q_scan'
  const frames: SystemsFrame[] = []
  const snap = (status: string, note: string[]) => {
    const tapeLine = tape.map((c, i) => (i === head ? `[${c}]` : ` ${c} `)).join('')
    frames.push({
      kind: 'tree',
      title: 'TM · aⁿbⁿ (n=2 toy)',
      statusText: status,
      treeNodes: [
        { id: 's', label: state, x: 0.5, y: 0.2, role: 'active' },
        {
          id: 't',
          label: tapeLine,
          x: 0.5,
          y: 0.55,
          role: 'default',
        },
      ],
      treeEdges: [{ from: 's', to: 't' }],
      metrics: `head@${head} · state ${state}`,
      panels: [
        { title: 'Tape', lines: [tapeLine, `head index ${head}`] },
        { title: 'Notes', lines: note },
      ],
    })
  }
  snap('Start: tape □aabb□', ['Strategy: cross off one a and one b per pass', 'Accept if all matched'])
  // Pass 1: mark first a as X, scan to first b mark Y
  tape[1] = 'X'
  head = 1
  state = 'q_mark_a'
  snap("Mark leftmost 'a' → X", ['First a crossed'])
  head = 3
  state = 'q_find_b'
  snap("Scan right for first 'b'", ['Head moves right'])
  tape[3] = 'Y'
  state = 'q_mark_b'
  snap("Mark matching 'b' → Y", ['One a-b pair done'])
  // rewind
  head = 1
  state = 'q_rewind'
  snap('Rewind to left end', ['Prepare second pass'])
  // Pass 2
  head = 2
  tape[2] = 'X'
  state = 'q_mark_a'
  snap("Mark next 'a' → X", ['Second a'])
  head = 4
  tape[4] = 'Y'
  state = 'q_mark_b'
  snap("Mark matching 'b' → Y", ['Second pair'])
  // check no leftover a/b
  head = 1
  state = 'q_check'
  snap('Scan: no unmarked a/b remain', ['All symbols crossed'])
  state = 'q_accept'
  snap('ACCEPT', ['Language aⁿbⁿ for this finite n=2 instance', 'General TM repeats until blank; reject on mismatch'])
  return frames
}

/** TCP AIMD: slow start then congestion avoidance with one loss. */
function tcpAimd(): SystemsFrame[] {
  const frames: SystemsFrame[] = []
  let cwnd = 1
  let ssthresh = 8
  let phase: 'slow-start' | 'cong-avoid' | 'loss' = 'slow-start'
  const history: string[] = []
  const push = (rtt: number, event: string) => {
    history.push(`RTT${rtt}: cwnd=${cwnd.toFixed(1)} ssthresh=${ssthresh} [${phase}] ${event}`)
    const nodes = history.slice(-6).map((h, i) => ({
      id: `r${i}`,
      label: h.split(' ').slice(0, 2).join(' '),
      x: 0.12 + (i / 6) * 0.8,
      y: 0.55 - Math.min(cwnd, 12) * 0.03,
      role: i === Math.min(history.length, 6) - 1 ? 'active' : 'default',
      value: String(Math.round(cwnd * 10) / 10),
    }))
    frames.push({
      kind: 'tree',
      title: 'TCP AIMD (toy)',
      statusText: `RTT ${rtt} · cwnd=${cwnd.toFixed(1)} · ${phase} · ${event}`,
      treeNodes: [
        { id: 'cwnd', label: `cwnd ${cwnd.toFixed(1)}`, x: 0.35, y: 0.25, role: 'active', value: String(cwnd) },
        { id: 'ss', label: `ssthresh ${ssthresh}`, x: 0.7, y: 0.25, role: 'default' },
        ...nodes.map((n, i) => ({ ...n, y: 0.65, x: 0.1 + i * 0.14 })),
      ],
      treeEdges: [{ from: 'cwnd', to: 'ss' }],
      metrics: `phase=${phase}`,
      panels: [
        { title: 'Trace', lines: [...history] },
        {
          title: 'Rules',
          lines: [
            'Slow start: cwnd *= 2 each RTT (approx +1 per ACK → exponential)',
            'Congestion avoidance: cwnd += 1 per RTT (AIMD additive increase)',
            'Loss: ssthresh = cwnd/2; cwnd = 1 (or ssthresh for fast recovery landscape)',
          ],
        },
      ],
    })
  }
  // RTT 0-3 slow start: 1,2,4,8
  for (let rtt = 0; rtt < 4; rtt++) {
    push(rtt, rtt === 0 ? 'start' : 'double (SS)')
    if (rtt < 3) {
      if (cwnd >= ssthresh) phase = 'cong-avoid'
      else cwnd = Math.min(cwnd * 2, ssthresh)
      if (cwnd >= ssthresh) phase = 'cong-avoid'
    }
  }
  // at cwnd=8 hit ssthresh, CA
  phase = 'cong-avoid'
  for (let rtt = 4; rtt < 7; rtt++) {
    cwnd += 1
    push(rtt, '+1 (CA)')
  }
  // loss at RTT 7
  phase = 'loss'
  ssthresh = Math.max(Math.floor(cwnd / 2), 2)
  const lost = cwnd
  cwnd = 1
  push(7, `LOSS · was ${lost} → restart SS`)
  phase = 'slow-start'
  for (let rtt = 8; rtt < 11; rtt++) {
    if (cwnd < ssthresh) {
      cwnd *= 2
      push(rtt, 'double (SS recovery)')
    } else {
      phase = 'cong-avoid'
      cwnd += 1
      push(rtt, '+1 (CA)')
    }
  }
  return frames
}

/** Evaluate (2+3)*4 expression tree bottom-up. */
function plEvalTree(): SystemsFrame[] {
  const base = [
    { id: 'mul', label: '*', x: 0.5, y: 0.15 },
    { id: 'add', label: '+', x: 0.32, y: 0.45 },
    { id: 'four', label: '4', x: 0.7, y: 0.45 },
    { id: 'two', label: '2', x: 0.2, y: 0.75 },
    { id: 'three', label: '3', x: 0.44, y: 0.75 },
  ]
  const edges = [
    { from: 'mul', to: 'add' },
    { from: 'mul', to: 'four' },
    { from: 'add', to: 'two' },
    { from: 'add', to: 'three' },
  ]
  return [
    {
      kind: 'tree',
      title: 'Expression tree eval',
      statusText: 'AST for (2+3)*4',
      treeNodes: base.map((n) => ({ ...n, role: 'default' })),
      treeEdges: edges,
      panels: [{ title: 'Big-step idea', lines: ['Evaluate children before parent', 'Numbers are values', 'Operators combine values'] }],
    },
    {
      kind: 'tree',
      title: 'Expression tree eval',
      statusText: '2 and 3 are values',
      treeNodes: base.map((n) => ({
        ...n,
        role: n.id === 'two' || n.id === 'three' ? 'done' : 'default',
        value: n.id === 'two' ? '2' : n.id === 'three' ? '3' : undefined,
      })),
      treeEdges: edges,
    },
    {
      kind: 'tree',
      title: 'Expression tree eval',
      statusText: '+ evaluates to 5',
      treeNodes: base.map((n) => ({
        ...n,
        role: n.id === 'add' ? 'active' : n.id === 'two' || n.id === 'three' ? 'done' : 'default',
        value: n.id === 'add' ? '5' : n.id === 'two' ? '2' : n.id === 'three' ? '3' : undefined,
      })),
      treeEdges: edges,
      metrics: '2+3 → 5',
    },
    {
      kind: 'tree',
      title: 'Expression tree eval',
      statusText: '4 is a value',
      treeNodes: base.map((n) => ({
        ...n,
        role: n.id === 'four' || n.id === 'add' ? 'done' : 'default',
        value:
          n.id === 'add' ? '5' : n.id === 'four' ? '4' : n.id === 'two' ? '2' : n.id === 'three' ? '3' : undefined,
      })),
      treeEdges: edges,
    },
    {
      kind: 'tree',
      title: 'Expression tree eval',
      statusText: '* evaluates to 20 — program value',
      treeNodes: base.map((n) => ({
        ...n,
        role: n.id === 'mul' ? 'path' : 'done',
        value:
          n.id === 'mul'
            ? '20'
            : n.id === 'add'
              ? '5'
              : n.id === 'four'
                ? '4'
                : n.id === 'two'
                  ? '2'
                  : n.id === 'three'
                    ? '3'
                    : undefined,
      })),
      treeEdges: edges,
      metrics: '(2+3)*4 = 20',
      panels: [{ title: 'Result', lines: ['Final value 20', 'Order: leaves → + → *'] }],
    },
  ]
}

/** DFA: binary string value mod 3. States q0,q1,q2 (remainder). */
function dfaMod3(opts?: { input?: string }): SystemsFrame[] {
  const raw = (opts?.input ?? '1101').replace(/[^01]/g, '') || '1101'
  const str = raw.slice(0, 24)
  const decimal = parseInt(str, 2)
  let r = 0
  const frames: SystemsFrame[] = []
  const nodes = (cur: number) =>
    [0, 1, 2].map((i) => ({
      id: `q${i}`,
      label: `q${i}`,
      x: 0.2 + i * 0.3,
      y: 0.45,
      role: cur === i ? 'active' : 'default',
    }))
  frames.push({
    kind: 'tree',
    title: 'DFA · binary mod 3',
    statusText: `Start q0 · input "${str}" (value mod 3)`,
    treeNodes: nodes(0),
    treeEdges: [
      { from: 'q0', to: 'q0' },
      { from: 'q0', to: 'q1' },
      { from: 'q1', to: 'q2' },
      { from: 'q1', to: 'q0' },
      { from: 'q2', to: 'q1' },
      { from: 'q2', to: 'q2' },
    ],
    metrics: 'δ(q,r,b)= (2r+b) mod 3',
    panels: [
      {
        title: 'δ',
        lines: [
          'Reading bit b (0/1): r ← (2·r + b) mod 3',
          'Accept remainder class (here we just report final r)',
          `Target string ${str} = ${decimal}₁₀`,
        ],
      },
    ],
  })
  for (let i = 0; i < str.length; i++) {
    const b = Number(str[i])
    const prev = r
    r = (2 * r + b) % 3
    frames.push({
      kind: 'tree',
      title: 'DFA · binary mod 3',
      statusText: `Read '${b}' · q${prev} → q${r}`,
      treeNodes: nodes(r),
      treeEdges: [
        { from: 'q0', to: 'q1' },
        { from: 'q1', to: 'q2' },
        { from: 'q2', to: 'q1' },
      ],
      metrics: `consumed "${str.slice(0, i + 1)}" · r=${r}`,
      panels: [{ title: 'Update', lines: [`r := (2·${prev} + ${b}) mod 3 = ${r}`] }],
    })
  }
  frames.push({
    kind: 'tree',
    title: 'DFA · binary mod 3',
    statusText: `Final remainder q${r} · ${decimal} mod 3 = ${decimal % 3}`,
    treeNodes: nodes(r).map((n) => ({ ...n, role: n.id === `q${r}` ? 'path' : 'default' })),
    treeEdges: [],
    metrics: `r=${r}`,
  })
  return frames
}

/** Go-Back-N with one loss; windowSize and lossSeq configurable. */
function gbnLoss(opts?: { windowSize?: number; lossSeq?: number }): SystemsFrame[] {
  const N = Math.min(5, Math.max(2, opts?.windowSize ?? 3))
  const loss = Math.min(N - 1, Math.max(0, opts?.lossSeq ?? 1))
  const frames: SystemsFrame[] = []
  const push = (status: string, outstanding: string, note: string[]) => {
    frames.push({
      kind: 'process',
      title: `GBN window=${N} · loss`,
      statusText: status,
      processes: [
        {
          id: 'Snd',
          state: status.includes('Timeout') || status.includes('LOSS') ? 'blocked' : 'running',
          role: 'sender',
        },
        { id: 'Rcv', state: status.includes('ACK') ? 'running' : 'ready', role: 'receiver' },
      ],
      metrics: outstanding,
      panels: [
        { title: 'Wire / window', lines: [outstanding, ...note] },
        {
          title: 'GBN rule',
          lines: [
            `Window size N=${N}`,
            `Loss on DATA${loss}`,
            'On timeout: retransmit from base seq (not only lost pkt)',
            'Cumulative ACK',
          ],
        },
      ],
    })
  }
  const first = Array.from({ length: N }, (_, i) => i)
  push(`Send DATA${first.join(', DATA')} (window full)`, `out: ${first.join(',')}`, ['base=0'])
  if (loss > 0) {
    push(`ACK${loss - 1} arrives · slide · send more if any`, `out: ${loss}… · missing ACK${loss}`, [
      `DATA${loss} still outstanding`,
    ])
  }
  push(`LOSS: DATA${loss} dropped (no ACK${loss})`, `out: base=${loss} · missing ACK${loss}`, ['timeout starts'])
  const rexmit = Array.from({ length: N }, (_, i) => loss + i)
  push(
    `Timeout · GBN retransmit DATA${rexmit.join(', DATA')}`,
    `rexmit from base=${loss}`,
    ['not only the lost packet'],
  )
  push(`ACK${loss}… cumulative · window advances`, 'out: ∅', ['done'])
  return frames
}

/** Side-by-side cost story: NLJ vs hash join on same |R|,|S|. */
function joinCompare(): SystemsFrame[] {
  return [
    {
      kind: 'process',
      title: 'Join cost · NLJ vs hash',
      statusText: 'Same R,S: |R|=|S|=3 equality on a',
      processes: [
        { id: 'NLJ', state: 'ready', role: '9 probes' },
        { id: 'HJ', state: 'ready', role: 'build 3 + probe 3' },
      ],
      metrics: 'setup',
      panels: [
        {
          title: 'Cardinalities',
          lines: ['|R|=3, |S|=3', 'NLJ comparisons = |R|·|S| = 9', 'Hash: build |R| + probe |S| = 6 ops'],
        },
      ],
    },
    {
      kind: 'process',
      title: 'Join cost · NLJ vs hash',
      statusText: 'Scale: |R|=|S|=1000 → NLJ 10⁶ vs hash ~2000',
      processes: [
        { id: 'NLJ', state: 'running', role: '10⁶' },
        { id: 'HJ', state: 'running', role: '~2·10³' },
      ],
      metrics: 'scaled',
      panels: [
        {
          title: 'When hash loses',
          lines: [
            'Build table does not fit memory → grace/partition hash',
            'Tiny outer + indexed inner → NLJ/index nested-loop can win',
            'Open nl-join and hash-join demos for step detail',
          ],
        },
      ],
    },
    {
      kind: 'process',
      title: 'Join cost · NLJ vs hash',
      statusText: 'Takeaway: optimizer chooses by stats + memory',
      processes: [
        { id: 'NLJ', state: 'terminated', role: 'simple' },
        { id: 'HJ', state: 'terminated', role: 'default at scale' },
      ],
      metrics: 'done',
      panels: [{ title: 'Deliverable', lines: ['State one workload for each algorithm', 'Cite the 9 vs 6 probe toy numbers'] }],
    },
  ]
}

/** STLC typing derivation sketch for (λx:Bool. x) true. */
function plTypeStlc(): SystemsFrame[] {
  return [
    {
      kind: 'tree',
      title: 'STLC typing',
      statusText: 'Goal: ⊢ (λx:Bool. x) true : Bool',
      treeNodes: [
        { id: 'root', label: 'app', x: 0.5, y: 0.2, role: 'active' },
        { id: 'abs', label: 'λx:Bool.x', x: 0.3, y: 0.5, role: 'default' },
        { id: 'tr', label: 'true', x: 0.7, y: 0.5, role: 'default' },
      ],
      treeEdges: [
        { from: 'root', to: 'abs' },
        { from: 'root', to: 'tr' },
      ],
      panels: [{ title: 'Rules', lines: ['T-Abs, T-Var, T-App, T-True', 'Context Γ,x:Bool ⊢ x:Bool'] }],
    },
    {
      kind: 'tree',
      title: 'STLC typing',
      statusText: 'T-Abs: Γ ⊢ λx:Bool.x : Bool→Bool',
      treeNodes: [
        { id: 'root', label: 'Bool→Bool', x: 0.5, y: 0.2, role: 'done' },
        { id: 'abs', label: 'λx:Bool.x', x: 0.3, y: 0.5, role: 'path' },
        { id: 'tr', label: 'true:Bool', x: 0.7, y: 0.5, role: 'done' },
      ],
      treeEdges: [
        { from: 'root', to: 'abs' },
        { from: 'root', to: 'tr' },
      ],
      metrics: 'fun type',
    },
    {
      kind: 'tree',
      title: 'STLC typing',
      statusText: 'T-App: (Bool→Bool) Bool ⇒ Bool · derivation complete',
      treeNodes: [
        { id: 'root', label: ': Bool', x: 0.5, y: 0.2, role: 'path' },
        { id: 'abs', label: 'λ…', x: 0.3, y: 0.5, role: 'done' },
        { id: 'tr', label: 'true', x: 0.7, y: 0.5, role: 'done' },
      ],
      treeEdges: [
        { from: 'root', to: 'abs' },
        { from: 'root', to: 'tr' },
      ],
      metrics: 'well-typed',
      panels: [{ title: 'Paper', lines: ['Write full tree with Γ', 'Compare to TAPL Ch. 9'] }],
    },
  ]
}

/** Tiny CSP arc consistency on 3 variables A-B-C cycle, domains {R,G}. */
function cspAc(): SystemsFrame[] {
  type Dom = Record<string, string[]>
  let d: Dom = { A: ['R', 'G'], B: ['R', 'G'], C: ['R', 'G'] }
  const snap = (status: string, note: string[]) => ({
    kind: 'process' as const,
    title: 'CSP · arc consistency (toy)',
    statusText: status,
    processes: Object.entries(d).map(([id, vals]) => ({
      id,
      state: (vals.length === 0 ? 'terminated' : vals.length === 1 ? 'running' : 'ready') as
        | 'terminated'
        | 'running'
        | 'ready',
      role: `{${vals.join(',')}}`,
    })),
    metrics: `domains ${Object.values(d)
      .map((v) => v.length)
      .join(',')}`,
    panels: [{ title: 'Domains', lines: [...Object.entries(d).map(([k, v]) => `${k}={${v.join(',')}}`), ...note] }],
  })
  const frames = [
    snap('Map A—B—C—A, domains {R,G}, ≠ constraints', ['No assignment yet']),
  ]
  // Fix A=R
  d = { A: ['R'], B: ['R', 'G'], C: ['R', 'G'] }
  frames.push(snap('Assign A=R', ['Propagate arc (B,A): remove R from B if needed']))
  d = { A: ['R'], B: ['G'], C: ['R', 'G'] }
  frames.push(snap('AC: B≠A ⇒ B={G}', ['Next C≠B and C≠A']))
  d = { A: ['R'], B: ['G'], C: ['R'] }
  frames.push(snap('AC: C≠B ⇒ drop G; C≠A still allows R', ['Solution A=R,B=G,C=R']))
  frames.push(snap('Consistent assignment found', ['Honest: 3-var toy, not full AC-3 queue']))
  return frames
}

/** Hash join build R then probe S on attribute a. */
function hashJoin(): SystemsFrame[] {
  const R = [
    { a: 1, b: 'x' },
    { a: 2, b: 'y' },
    { a: 3, b: 'z' },
  ]
  const S = [
    { a: 2, c: 10 },
    { a: 3, c: 20 },
    { a: 4, c: 30 },
  ]
  const frames: SystemsFrame[] = []
  frames.push({
    kind: 'process',
    title: 'Hash join R ⋈ S on a',
    statusText: 'Build phase: hash R by a',
    processes: R.map((r) => ({ id: `R${r.a}`, state: 'ready' as const, role: `R a=${r.a}` })),
    metrics: 'build',
    panels: [{ title: 'Build', lines: R.map((r) => `bucket h(${r.a}): (${r.a},${r.b})`) }],
  })
  const buckets: Record<number, string[]> = { 1: ['(1,x)'], 2: ['(2,y)'], 3: ['(3,z)'] }
  frames.push({
    kind: 'process',
    title: 'Hash join R ⋈ S on a',
    statusText: 'Build complete · 3 buckets',
    processes: R.map((r) => ({ id: `R${r.a}`, state: 'terminated' as const, role: `R a=${r.a}` })),
    metrics: 'build done',
    panels: [{ title: 'Hash table', lines: Object.entries(buckets).map(([k, v]) => `${k} → ${v.join(' ')}`) }],
  })
  const matches: string[] = []
  for (const s of S) {
    const hit = buckets[s.a]
    if (hit) matches.push(`(${s.a},…,${s.c})`)
    frames.push({
      kind: 'process',
      title: 'Hash join R ⋈ S on a',
      statusText: hit ? `Probe S a=${s.a} · HIT emit join` : `Probe S a=${s.a} · miss`,
      processes: [
        ...R.map((r) => ({
          id: `R${r.a}`,
          state: (r.a === s.a ? 'running' : 'ready') as 'running' | 'ready',
          role: `R a=${r.a}`,
        })),
        { id: `S${s.a}`, state: hit ? ('blocked' as const) : ('running' as const), role: `S a=${s.a}` },
      ],
      metrics: `matches ${matches.length}`,
      panels: [{ title: 'Result so far', lines: matches.length ? matches : ['∅'] }],
    })
  }
  frames.push({
    kind: 'process',
    title: 'Hash join R ⋈ S on a',
    statusText: `Done · ${matches.length} tuples · probes = |S| = 3`,
    processes: S.map((s) => ({ id: `S${s.a}`, state: 'terminated' as const, role: `S a=${s.a}` })),
    metrics: 'O(|R|+|S|) expected',
    panels: [
      {
        title: 'vs NLJ',
        lines: ['NLJ did 9 probes on same tables', 'Hash join: build |R| + probe |S|', 'Wins when hash fits memory'],
      },
    ],
  })
  return frames
}

/** Small-step: (2+3)*4 reduces one redex at a time. */
function plSmallStep(): SystemsFrame[] {
  const steps = [
    { term: '(2+3)*4', note: 'initial program' },
    { term: '5*4', note: 'β: 2+3 → 5 (left redex)' },
    { term: '20', note: 'β: 5*4 → 20 · value' },
  ]
  return steps.map((s, i) => ({
    kind: 'tree' as const,
    title: 'Small-step SOS',
    statusText: s.note,
    treeNodes: [{ id: 't', label: s.term, x: 0.5, y: 0.45, role: i === steps.length - 1 ? 'path' : 'active' }],
    treeEdges: [],
    metrics: `step ${i}/${steps.length - 1}`,
    panels: [
      {
        title: 'Rules (sketch)',
        lines: ['E-Add: n1+n2 → n1+n2 if numbers', 'E-Mul similar', 'Congruence: reduce left of * first here'],
      },
    ],
  }))
}

export const systemsDemos: ISystemsDemo[] = [
  {
    id: 'schedule-fcfs',
    label: 'FCFS',
    description: 'First-come first-served CPU scheduling on a fixed job set.',
    category: 'scheduling',
    generate: scheduleFcfs,
  },
  {
    id: 'schedule-sjf',
    label: 'SJF',
    description: 'Non-preemptive shortest job first among arrived jobs.',
    category: 'scheduling',
    generate: scheduleSjf,
  },
  {
    id: 'schedule-rr',
    label: 'Round Robin',
    description: 'Preemptive RR with quantum 2 on the same jobs.',
    category: 'scheduling',
    generate: scheduleRr,
  },
  {
    id: 'page-fifo',
    label: 'FIFO pages',
    description: 'FIFO page replacement with 3 frames.',
    category: 'memory',
    generate: () => pageFrames('fifo'),
  },
  {
    id: 'page-lru',
    label: 'LRU pages',
    description: 'LRU page replacement with 3 frames.',
    category: 'memory',
    generate: () => pageFrames('lru'),
  },
  {
    id: 'process-lifecycle',
    label: 'Process states',
    description: 'Two processes move through new/ready/running/blocked/terminated.',
    category: 'process',
    generate: processLifecycle,
  },
  {
    id: 'cache-direct',
    label: 'Cache (DM)',
    description: 'Direct-mapped cache toy: hits/misses on a fixed address stream.',
    category: 'cpu',
    generate: cacheDirect,
  },
  {
    id: 'stack-calls',
    label: 'Call stack',
    description: 'Nested calls push/pop frames (CSAPP-style intuition).',
    category: 'cpu',
    generate: stackCalls,
  },
  {
    id: 'minimax-tree',
    label: 'Minimax',
    description: 'Depth-2 game tree: min at children, max at root.',
    category: 'ai',
    generate: minimaxTree,
  },
  {
    id: 'dfa-even0',
    label: 'DFA (even 0s)',
    description: 'Run a 2-state DFA for even number of zeros (editable binary input).',
    category: 'ai',
    acceptsInput: true,
    generate: dfaEven0,
  },
  {
    id: 'dfa-ends01',
    label: 'DFA (ends 01)',
    description: '3-state DFA for strings ending in 01 on input 11001.',
    category: 'ai',
    generate: dfaEnds01,
  },
  {
    id: 'cfg-anbn',
    label: 'CFG aⁿbⁿ',
    description: 'Leftmost derivation of aabb from S → aSb | ε.',
    category: 'ai',
    generate: cfgAnbn,
  },
  {
    id: 'pda-anbn',
    label: 'PDA aⁿbⁿ',
    description: 'Pushdown automaton for aabb: push A on a, pop on b, accept on empty stack.',
    category: 'ai',
    generate: pdaAnbn,
  },
  {
    id: 'tm-anbn',
    label: 'TM aⁿbⁿ',
    description: 'Single-tape TM toy crossing off a/b pairs on □aabb□.',
    category: 'ai',
    generate: tmAnbn,
  },
  {
    id: 'sliding-window',
    label: 'Sliding window',
    description: 'Stop-and-wait vs window=2 ARQ pipeline (toy).',
    category: 'cpu',
    generate: slidingWindow,
  },
  {
    id: 'tcp-aimd',
    label: 'TCP AIMD',
    description: 'Slow start + congestion avoidance with one loss event (cwnd/ssthresh).',
    category: 'cpu',
    generate: tcpAimd,
  },
  {
    id: 'gbn-loss',
    label: 'GBN + loss',
    description: 'Go-Back-N with configurable window and lost seq; retransmit-from-base.',
    category: 'cpu',
    acceptsInput: true,
    generate: gbnLoss,
  },
  {
    id: 'dfa-mod3',
    label: 'DFA mod 3',
    description: 'Binary string as number mod 3 (editable input; default 1101).',
    category: 'ai',
    acceptsInput: true,
    generate: dfaMod3,
  },
  {
    id: 'hash-join',
    label: 'Hash join',
    description: 'Build hash on R then probe S for equality join on a.',
    category: 'memory',
    generate: hashJoin,
  },
  {
    id: 'join-compare',
    label: 'Join cost',
    description: 'NLJ vs hash join probe counts on toy and scaled cardinalities.',
    category: 'memory',
    generate: joinCompare,
  },
  {
    id: 'pl-small-step',
    label: 'Small-step',
    description: 'Small-step reduction of (2+3)*4 to value 20.',
    category: 'ai',
    generate: plSmallStep,
  },
  {
    id: 'pl-type-stlc',
    label: 'STLC types',
    description: 'Typing derivation sketch for (λx:Bool. x) true : Bool.',
    category: 'ai',
    generate: plTypeStlc,
  },
  {
    id: 'csp-ac',
    label: 'CSP AC',
    description: 'Tiny map-coloring arc consistency on A–B–C with domains {R,G}.',
    category: 'ai',
    generate: cspAc,
  },
  {
    id: 'nl-join',
    label: 'Nested-loop join',
    description: 'Nested-loop join of tiny R and S on attribute a.',
    category: 'memory',
    generate: nlJoin,
  },
  {
    id: 'env-lookup',
    label: 'Env lookup',
    description: 'Static-scope environment chain: shadowing and parent lookup.',
    category: 'cpu',
    generate: envLookup,
  },
  {
    id: 'network-path',
    label: 'Network path',
    description: 'Store-and-forward hop delays along Client→R1→R2→Server.',
    category: 'cpu',
    generate: networkPath,
  },
  {
    id: 'pl-eval-tree',
    label: 'Expr eval',
    description: 'Bottom-up evaluation of AST for (2+3)*4.',
    category: 'ai',
    generate: plEvalTree,
  },
]

export function getSystemsDemo(id: string): ISystemsDemo {
  const found = systemsDemos.find((d) => d.id === id)
  if (!found) {
    throw new Error(
      `Unknown systems demo "${id}". Valid: ${systemsDemos.map((d) => d.id).join(', ')}`,
    )
  }
  return found
}

export function tryGetSystemsDemo(id: string): ISystemsDemo | undefined {
  return systemsDemos.find((d) => d.id === id)
}
