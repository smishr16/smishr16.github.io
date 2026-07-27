import type {
  IStructureDemo,
  StructureDrawEdge,
  StructureDrawNode,
  StructureFrame,
  StructureKind,
} from '../../contracts/structures'

function listFrames(values: number[]): StructureFrame[] {
  const frames: StructureFrame[] = []
  const arr: number[] = []
  frames.push({
    kind: 'list',
    title: 'Dynamic array / list',
    statusText: 'Empty list',
    nodes: [],
    edges: [],
    metrics: 'n=0 · capacity grows geometrically in real implementations',
  })
  for (const v of values) {
    arr.push(v)
    const nodes: StructureDrawNode[] = arr.map((val, i) => ({
      id: `i${i}`,
      label: String(val),
      x: 0.1 + (i / Math.max(arr.length, 1)) * 0.8,
      y: 0.5,
      role: i === arr.length - 1 ? 'new' : 'default',
    }))
    const edges: StructureDrawEdge[] = []
    for (let i = 0; i < arr.length - 1; i++) {
      edges.push({ from: `i${i}`, to: `i${i + 1}` })
    }
    frames.push({
      kind: 'list',
      title: 'Dynamic array / list',
      statusText: `Append ${v} at index ${arr.length - 1}`,
      nodes,
      edges,
      metrics: `n=${arr.length} · last index ${arr.length - 1}`,
      panels: [
        {
          title: 'Cost intuition',
          lines: [
            'Index access: O(1)',
            'Append amortized O(1) with geometric growth',
            'Insert at front: O(n) shifts (array)',
          ],
        },
      ],
    })
  }
  if (arr.length) {
    frames.push({
      kind: 'list',
      title: 'Dynamic array / list',
      statusText: `Lookup index 0 → ${arr[0]} (O(1))`,
      nodes: arr.map((val, i) => ({
        id: `i${i}`,
        label: String(val),
        x: 0.1 + (i / Math.max(arr.length, 1)) * 0.8,
        y: 0.5,
        role: i === 0 ? 'found' : 'default',
      })),
      edges: arr.slice(0, -1).map((_, i) => ({ from: `i${i}`, to: `i${i + 1}` })),
      metrics: `n=${arr.length}`,
    })
  }
  return frames
}

interface BstNode {
  val: number
  left: BstNode | null
  right: BstNode | null
}

function insertBst(root: BstNode | null, val: number, path: number[]): BstNode {
  if (!root) {
    path.push(val)
    return { val, left: null, right: null }
  }
  path.push(root.val)
  if (val < root.val) root.left = insertBst(root.left, val, path)
  else root.right = insertBst(root.right, val, path)
  return root
}

function layoutBst(
  root: BstNode | null,
  x0: number,
  x1: number,
  y: number,
  dy: number,
  pathSet: Set<number>,
  newVal: number | null,
): { nodes: StructureDrawNode[]; edges: StructureDrawEdge[] } {
  if (!root) return { nodes: [], edges: [] }
  const x = (x0 + x1) / 2
  const id = `n${root.val}`
  let role: StructureDrawNode['role'] = 'default'
  if (newVal !== null && root.val === newVal) role = 'new'
  else if (pathSet.has(root.val)) role = 'path'
  const nodes: StructureDrawNode[] = [{ id, label: String(root.val), x, y, role }]
  const edges: StructureDrawEdge[] = []
  if (root.left) {
    const L = layoutBst(root.left, x0, x, y + dy, dy, pathSet, newVal)
    edges.push({ from: id, to: `n${root.left.val}` })
    nodes.push(...L.nodes)
    edges.push(...L.edges)
  }
  if (root.right) {
    const R = layoutBst(root.right, x, x1, y + dy, dy, pathSet, newVal)
    edges.push({ from: id, to: `n${root.right.val}` })
    nodes.push(...R.nodes)
    edges.push(...R.edges)
  }
  return { nodes, edges }
}

function bstFrames(values: number[]): StructureFrame[] {
  const frames: StructureFrame[] = []
  let root: BstNode | null = null
  frames.push({
    kind: 'bst',
    title: 'Binary search tree',
    statusText: 'Empty BST',
    nodes: [],
    edges: [],
    metrics: 'n=0',
  })
  let n = 0
  for (const v of values) {
    n++
    const path: number[] = []
    root = insertBst(root, v, path)
    const pathSet = new Set(path)
    const { nodes, edges } = layoutBst(root, 0.05, 0.95, 0.12, 0.18, pathSet, v)
    frames.push({
      kind: 'bst',
      title: 'Binary search tree',
      statusText: `Insert ${v} · search path ${path.join(' → ')}`,
      nodes,
      edges,
      metrics: `n=${n} · path length ${path.length}`,
      panels: [
        {
          title: 'Invariants',
          lines: [
            'Left subtree keys < node < right subtree keys',
            'Unbalanced inserts → O(n) worst search',
            'Balanced trees (AVL/RBT) restore O(log n)',
          ],
        },
      ],
    })
  }
  return frames
}

function heapFrames(values: number[]): StructureFrame[] {
  const frames: StructureFrame[] = []
  const heap: number[] = []

  function layout(): { nodes: StructureDrawNode[]; edges: StructureDrawEdge[] } {
    const nodes: StructureDrawNode[] = []
    const edges: StructureDrawEdge[] = []
    if (!heap.length) return { nodes, edges }
    const levels = Math.floor(Math.log2(heap.length)) + 1
    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1))
      const indexInLevel = i - (2 ** level - 1)
      const countInLevel = 2 ** level
      const x = (indexInLevel + 1) / (countInLevel + 1)
      const y = 0.12 + (level / Math.max(levels, 1)) * 0.7
      nodes.push({
        id: `h${i}`,
        label: String(heap[i]),
        x,
        y,
        role: i === heap.length - 1 ? 'new' : 'default',
      })
      if (i > 0) {
        const p = Math.floor((i - 1) / 2)
        edges.push({ from: `h${p}`, to: `h${i}` })
      }
    }
    return { nodes, edges }
  }

  frames.push({
    kind: 'heap',
    title: 'Binary min-heap',
    statusText: 'Empty heap',
    nodes: [],
    edges: [],
    metrics: 'n=0',
  })

  for (const v of values) {
    heap.push(v)
    let i = heap.length - 1
    frames.push({
      kind: 'heap',
      title: 'Binary min-heap',
      statusText: `Insert ${v} at end (index ${i})`,
      ...layout(),
      metrics: `n=${heap.length}`,
    })
    while (i > 0) {
      const p = Math.floor((i - 1) / 2)
      if (heap[p]! <= heap[i]!) break
      const t = heap[p]!
      heap[p] = heap[i]!
      heap[i] = t
      const { nodes, edges } = layout()
      nodes.forEach((n) => {
        if (n.id === `h${p}` || n.id === `h${i}`) n.role = 'active'
      })
      frames.push({
        kind: 'heap',
        title: 'Binary min-heap',
        statusText: `Sift up: swap indices ${i} and ${p}`,
        nodes,
        edges,
        metrics: `n=${heap.length} · heap property restoring`,
      })
      i = p
    }
    const final = layout()
    final.nodes.forEach((n) => {
      if (n.id === `h${i}`) n.role = 'found'
    })
    frames.push({
      kind: 'heap',
      title: 'Binary min-heap',
      statusText: `Heap property holds · min at root = ${heap[0]}`,
      ...final,
      metrics: `n=${heap.length}`,
      panels: [
        {
          title: 'Costs',
          lines: ['Insert O(log n)', 'Extract-min O(log n)', 'Peek min O(1)'],
        },
      ],
    })
  }
  return frames
}

function hashFrames(values: number[]): StructureFrame[] {
  const frames: StructureFrame[] = []
  const m = 7
  const buckets: number[][] = Array.from({ length: m }, () => [])

  function panel(): { title: string; lines: string[] }[] {
    return [
      {
        title: `Chaining · m=${m} · h(k)=k mod ${m}`,
        lines: buckets.map((b, i) => `[${i}] → ${b.length ? b.join(' → ') : '∅'}`),
      },
      {
        title: 'Notes',
        lines: [
          `n=${buckets.reduce((s, b) => s + b.length, 0)} · load α ≈ ${(
            buckets.reduce((s, b) => s + b.length, 0) / m
          ).toFixed(2)}`,
          'Expected chain length ≈ α under uniform hashing',
          'Open addressing is an alternative (not shown)',
        ],
      },
    ]
  }

  frames.push({
    kind: 'hash',
    title: 'Hash table (chaining)',
    statusText: 'Empty table',
    nodes: [],
    edges: [],
    panels: panel(),
    metrics: `m=${m}`,
  })

  let inserted = 0
  for (const v of values) {
    inserted++
    const h = ((v % m) + m) % m
    buckets[h]!.push(v)
    // draw bucket nodes in a row
    const nodes: StructureDrawNode[] = []
    const edges: StructureDrawEdge[] = []
    for (let i = 0; i < m; i++) {
      nodes.push({
        id: `b${i}`,
        label: String(i),
        x: 0.08 + (i / (m - 1)) * 0.84,
        y: 0.2,
        role: i === h ? 'active' : 'default',
      })
    }
    const chain = buckets[h]!
    chain.forEach((val, j) => {
      const id = `c${h}_${j}`
      nodes.push({
        id,
        label: String(val),
        x: 0.08 + (h / (m - 1)) * 0.84,
        y: 0.4 + j * 0.12,
        role: j === chain.length - 1 ? 'new' : 'default',
      })
      if (j === 0) edges.push({ from: `b${h}`, to: id })
      else edges.push({ from: `c${h}_${j - 1}`, to: id })
    })
    frames.push({
      kind: 'hash',
      title: 'Hash table (chaining)',
      statusText: `Insert ${v} → bucket ${h}`,
      nodes,
      edges,
      panels: panel(),
      metrics: `α ≈ ${(inserted / m).toFixed(2)}`,
    })
  }
  return frames
}

/** Order-3 B+ leaf-only toy: show keys packing into leaves (honest simplification). */
function bplusFrames(values: number[]): StructureFrame[] {
  const order = 3 // max keys per leaf in toy
  const frames: StructureFrame[] = []
  const leaves: number[][] = [[]]
  frames.push({
    kind: 'bplus',
    title: 'B+ leaf packing (order-3 toy)',
    statusText: 'Empty index — teaching simplification (leaves only)',
    nodes: [],
    edges: [],
    panels: [
      {
        title: 'Honesty',
        lines: [
          'Full B+ has internal separators + sibling links',
          'This toy only shows leaf packing & splits',
          'max keys per leaf = 3',
        ],
      },
    ],
  })
  let n = 0
  for (const v of values) {
    n++
    let leaf = leaves[leaves.length - 1]!
    if (leaf.length >= order) {
      leaves.push([])
      leaf = leaves[leaves.length - 1]!
    }
    leaf.push(v)
    leaf.sort((a, b) => a - b)
    const nodes: StructureDrawNode[] = []
    const edges: StructureDrawEdge[] = []
    leaves.forEach((keys, li) => {
      const id = `L${li}`
      nodes.push({
        id,
        label: keys.join(',') || '∅',
        x: 0.15 + (li / Math.max(leaves.length, 1)) * 0.7,
        y: 0.55,
        role: li === leaves.length - 1 ? 'new' : 'default',
      })
      if (li > 0) edges.push({ from: `L${li - 1}`, to: id, label: 'next' })
    })
    frames.push({
      kind: 'bplus',
      title: 'B+ leaf packing (order-3 toy)',
      statusText: `Insert ${v} · leaves=${leaves.length}`,
      nodes,
      edges,
      metrics: `n=${n} · order=${order}`,
      panels: [
        {
          title: 'Leaves',
          lines: leaves.map((k, i) => `L${i}: [${k.join(', ')}]`),
        },
      ],
    })
  }
  return frames
}

/**
 * B+ tree with internal separators (order = max 2 keys / 3 children per node).
 * Leaves hold data keys; internal nodes hold separator keys only.
 */
function bplusTreeFrames(values: number[]): StructureFrame[] {
  const MAX_KEYS = 2 // order-3 tree: max 3 children
  type Leaf = { id: string; keys: number[]; next: string | null }
  type Internal = { id: string; keys: number[]; children: string[] }
  type Node = Leaf | Internal

  let idSeq = 0
  const nid = (p: string) => `${p}${idSeq++}`
  const nodes = new Map<string, Node>()
  let rootId = nid('L')
  nodes.set(rootId, { id: rootId, keys: [], next: null })

  const frames: StructureFrame[] = []

  const layout = (): { drawNodes: StructureDrawNode[]; drawEdges: StructureDrawEdge[]; lines: string[] } => {
    const drawNodes: StructureDrawNode[] = []
    const drawEdges: StructureDrawEdge[] = []
    const lines: string[] = []
    // BFS levels
    const levels: string[][] = []
    const q: { id: string; depth: number }[] = [{ id: rootId, depth: 0 }]
    const seen = new Set<string>()
    while (q.length) {
      const { id, depth } = q.shift()!
      if (seen.has(id)) continue
      seen.add(id)
      if (!levels[depth]) levels[depth] = []
      levels[depth]!.push(id)
      const n = nodes.get(id)!
      if ('children' in n) {
        for (const c of n.children) q.push({ id: c, depth: depth + 1 })
      }
    }
    levels.forEach((level, d) => {
      level.forEach((id, i) => {
        const n = nodes.get(id)!
        const x = (i + 1) / (level.length + 1)
        const y = 0.2 + d * 0.28
        const leaf = !('children' in n)
        const label = leaf
          ? `[${(n as Leaf).keys.join(',') || '∅'}]`
          : `⟨${(n as Internal).keys.join('|')}⟩`
        drawNodes.push({
          id,
          label,
          x,
          y,
          role: id === rootId ? 'pivot' : leaf ? 'default' : 'path',
        })
        lines.push(`${id}${leaf ? ' leaf' : ' int'}: ${label}`)
        if ('children' in n) {
          for (const c of n.children) {
            drawEdges.push({ from: id, to: c })
          }
        }
      })
    })
    // sibling links on leaves
    const leaves = [...nodes.values()].filter((n) => !('children' in n)) as Leaf[]
    leaves.sort((a, b) => (a.keys[0] ?? 0) - (b.keys[0] ?? 0))
    for (let i = 0; i < leaves.length - 1; i++) {
      leaves[i]!.next = leaves[i + 1]!.id
      drawEdges.push({ from: leaves[i]!.id, to: leaves[i + 1]!.id, label: '→' })
    }
    return { drawNodes, drawEdges, lines }
  }

  const pushFrame = (status: string, activeId?: string) => {
    const { drawNodes, drawEdges, lines } = layout()
    if (activeId) {
      const n = drawNodes.find((x) => x.id === activeId)
      if (n) n.role = 'new'
    }
    frames.push({
      kind: 'bplus',
      title: 'B+ tree (internal + leaves)',
      statusText: status,
      nodes: drawNodes,
      edges: drawEdges,
      metrics: `root=${rootId} · maxKeys=${MAX_KEYS}`,
      panels: [
        {
          title: 'Tree',
          lines: [
            ...lines,
            '⟨k⟩ = internal separators; [k] = leaf data',
            'Sibling → links for range scans',
          ],
        },
      ],
    })
  }

  pushFrame('Empty B+ · root is a leaf')

  const findLeaf = (key: number): string => {
    let id = rootId
    while (true) {
      const n = nodes.get(id)!
      if (!('children' in n)) return id
      const inn = n as Internal
      let i = 0
      while (i < inn.keys.length && key >= inn.keys[i]!) i++
      id = inn.children[i]!
    }
  }

  const splitLeaf = (leafId: string): void => {
    const leaf = nodes.get(leafId) as Leaf
    const mid = Math.ceil(leaf.keys.length / 2)
    const rightKeys = leaf.keys.splice(mid)
    const sep = rightKeys[0]!
    const rightId = nid('L')
    nodes.set(rightId, { id: rightId, keys: rightKeys, next: leaf.next })
    leaf.next = rightId

    if (leafId === rootId) {
      const newRoot = nid('I')
      nodes.set(newRoot, { id: newRoot, keys: [sep], children: [leafId, rightId] })
      rootId = newRoot
      return
    }
    // find parent
    for (const [pid, p] of nodes) {
      if (!('children' in p)) continue
      const inn = p as Internal
      const idx = inn.children.indexOf(leafId)
      if (idx < 0) continue
      inn.keys.splice(idx, 0, sep)
      inn.children.splice(idx + 1, 0, rightId)
      if (inn.keys.length > MAX_KEYS) splitInternal(pid)
      return
    }
  }

  const splitInternal = (nodeId: string): void => {
    const inn = nodes.get(nodeId) as Internal
    const mid = Math.floor(inn.keys.length / 2)
    const up = inn.keys[mid]!
    const rightKeys = inn.keys.splice(mid + 1)
    inn.keys.splice(mid) // remove mid from left
    const rightChildren = inn.children.splice(mid + 1)
    const rightId = nid('I')
    nodes.set(rightId, { id: rightId, keys: rightKeys, children: rightChildren })

    if (nodeId === rootId) {
      const newRoot = nid('I')
      nodes.set(newRoot, { id: newRoot, keys: [up], children: [nodeId, rightId] })
      rootId = newRoot
      return
    }
    for (const [pid, p] of nodes) {
      if (!('children' in p)) continue
      const par = p as Internal
      const idx = par.children.indexOf(nodeId)
      if (idx < 0) continue
      par.keys.splice(idx, 0, up)
      par.children.splice(idx + 1, 0, rightId)
      if (par.keys.length > MAX_KEYS) splitInternal(pid)
      return
    }
  }

  for (const v of values) {
    const leafId = findLeaf(v)
    const leaf = nodes.get(leafId) as Leaf
    // insert sorted
    let i = 0
    while (i < leaf.keys.length && leaf.keys[i]! < v) i++
    if (leaf.keys[i] === v) {
      pushFrame(`Key ${v} already present (no-op)`, leafId)
      continue
    }
    leaf.keys.splice(i, 0, v)
    pushFrame(`Insert ${v} into leaf ${leafId}`, leafId)
    if (leaf.keys.length > MAX_KEYS) {
      splitLeaf(leafId)
      pushFrame(`Split leaf after ${v} · promote separator`, leafId)
    }
  }
  pushFrame('Done — full B+ with internal separators + leaf chain')
  return frames
}

export const structureDemos: IStructureDemo[] = [
  {
    id: 'list-append',
    kind: 'list',
    label: 'List / array append',
    description: 'Grow a contiguous list by append; highlight indexing cost intuition.',
    generate: listFrames,
  },
  {
    id: 'bst-insert',
    kind: 'bst',
    label: 'BST insert',
    description: 'Insert keys into a binary search tree; show search path.',
    generate: bstFrames,
  },
  {
    id: 'heap-insert',
    kind: 'heap',
    label: 'Min-heap insert',
    description: 'Insert into a binary heap with sift-up.',
    generate: heapFrames,
  },
  {
    id: 'hash-insert',
    kind: 'hash',
    label: 'Hash chaining insert',
    description: 'Insert keys with h(k)=k mod m and chaining.',
    generate: hashFrames,
  },
  {
    id: 'bplus-insert',
    kind: 'bplus',
    label: 'B+ leaves (toy)',
    description: 'Order-3 leaf packing/splits — simplified B+ teaching model.',
    generate: bplusFrames,
  },
  {
    id: 'bplus-tree',
    kind: 'bplus',
    label: 'B+ tree (full)',
    description: 'B+ inserts with internal separators, root splits, and leaf sibling links.',
    generate: bplusTreeFrames,
  },
]

export function getStructureDemo(id: string): IStructureDemo {
  const d = structureDemos.find((x) => x.id === id)
  if (!d) throw new Error(`Unknown structure demo "${id}". Valid: ${structureDemos.map((x) => x.id).join(', ')}`)
  return d
}

export function demosForKind(kind: StructureKind): IStructureDemo[] {
  return structureDemos.filter((d) => d.kind === kind)
}

export const DEFAULT_STRUCTURE_VALUES = [7, 3, 11, 1, 9, 5]
