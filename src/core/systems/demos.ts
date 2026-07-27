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
function dfaEven0(): SystemsFrame[] {
  const str = '01001'
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
    description: 'Run a 2-state DFA for even number of zeros on string 01001.',
    category: 'ai',
    generate: dfaEven0,
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
