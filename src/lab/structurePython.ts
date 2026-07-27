import type { StructureFrame } from '../contracts/structures'
import { pyodideBridge } from './pyodideBridge'

export const STRUCTURE_LIST_TEMPLATE = `# CS Visual Lab — list via append hooks
# Hooks: append(value), get_list(), log(msg)

def build():
    for x in VALUES:
        append(x)
        log(f"appended {x}")
    log(f"final {get_list()}")

build()
`

export const STRUCTURE_BST_TEMPLATE = `# CS Visual Lab — BST insert
# Hooks: bst_insert(value), get_inorder(), log(msg)

def build():
    for x in VALUES:
        bst_insert(x)
        log(f"inserted {x}; inorder={get_inorder()}")

build()
`

export const STRUCTURE_HEAP_TEMPLATE = `# CS Visual Lab — min-heap insert
# Hooks: heap_insert(value), get_heap(), log(msg)

def build():
    for x in VALUES:
        heap_insert(x)
        log(f"heap={get_heap()}")

build()
`

export const STRUCTURE_HASH_TEMPLATE = `# CS Visual Lab — hash chaining insert
# Hooks: hash_insert(value), get_buckets(), log(msg)

def build():
    for x in VALUES:
        hash_insert(x)
        log(f"buckets={get_buckets()}")

build()
`

interface BstN {
  val: number
  left: BstN | null
  right: BstN | null
}

function insertBst(root: BstN | null, val: number): BstN {
  if (!root) return { val, left: null, right: null }
  if (val < root.val) root.left = insertBst(root.left, val)
  else root.right = insertBst(root.right, val)
  return root
}

function layoutBst(
  root: BstN | null,
  x0: number,
  x1: number,
  y: number,
  dy: number,
  newVal: number | null,
): { nodes: StructureFrame['nodes']; edges: StructureFrame['edges'] } {
  if (!root) return { nodes: [], edges: [] }
  const x = (x0 + x1) / 2
  const id = `n${root.val}`
  const nodes: StructureFrame['nodes'] = [
    { id, label: String(root.val), x, y, role: newVal === root.val ? 'new' : 'default' },
  ]
  const edges: StructureFrame['edges'] = []
  if (root.left) {
    const L = layoutBst(root.left, x0, x, y + dy, dy, newVal)
    edges.push({ from: id, to: `n${root.left.val}` })
    nodes.push(...L.nodes)
    edges.push(...L.edges)
  }
  if (root.right) {
    const R = layoutBst(root.right, x, x1, y + dy, dy, newVal)
    edges.push({ from: id, to: `n${root.right.val}` })
    nodes.push(...R.nodes)
    edges.push(...R.edges)
  }
  return { nodes, edges }
}

function layoutHeap(heap: number[]): { nodes: StructureFrame['nodes']; edges: StructureFrame['edges'] } {
  const nodes: StructureFrame['nodes'] = []
  const edges: StructureFrame['edges'] = []
  if (!heap.length) return { nodes, edges }
  const levels = Math.floor(Math.log2(heap.length)) + 1
  for (let i = 0; i < heap.length; i++) {
    const level = Math.floor(Math.log2(i + 1))
    const indexInLevel = i - (2 ** level - 1)
    const countInLevel = 2 ** level
    nodes.push({
      id: `h${i}`,
      label: String(heap[i]),
      x: (indexInLevel + 1) / (countInLevel + 1),
      y: 0.12 + (level / Math.max(levels, 1)) * 0.7,
      role: i === heap.length - 1 ? 'new' : 'default',
    })
    if (i > 0) edges.push({ from: `h${Math.floor((i - 1) / 2)}`, to: `h${i}` })
  }
  return { nodes, edges }
}

export type StructurePyMode = 'list' | 'bst' | 'heap' | 'hash'

export async function runStructurePython(
  code: string,
  values: number[],
  mode: StructurePyMode,
): Promise<{ frames: StructureFrame[]; logs: string[]; error: string | null }> {
  const logs: string[] = []
  const frames: StructureFrame[] = []
  const list: number[] = []
  let bst: BstN | null = null
  const heap: number[] = []
  const m = 7
  const buckets: number[][] = Array.from({ length: m }, () => [])

  const globals: Record<string, unknown> = {
    VALUES: values.slice(),
    log: (msg: string) => logs.push(String(msg)),
    get_list: () => list.slice(),
    append: (v: number) => {
      list.push(Number(v))
      frames.push({
        kind: 'list',
        title: 'Python list append',
        statusText: `append ${v}`,
        nodes: list.map((val, i) => ({
          id: `i${i}`,
          label: String(val),
          x: 0.1 + (i / Math.max(list.length, 1)) * 0.8,
          y: 0.5,
          role: i === list.length - 1 ? 'new' : 'default',
        })),
        edges: list.slice(0, -1).map((_, i) => ({ from: `i${i}`, to: `i${i + 1}` })),
        metrics: `n=${list.length}`,
      })
    },
    bst_insert: (v: number) => {
      const val = Number(v)
      bst = insertBst(bst, val)
      const { nodes, edges } = layoutBst(bst, 0.05, 0.95, 0.12, 0.18, val)
      frames.push({
        kind: 'bst',
        title: 'Python BST insert',
        statusText: `insert ${val}`,
        nodes,
        edges,
        metrics: 'from Python',
      })
    },
    get_inorder: () => {
      const out: number[] = []
      const walk = (n: BstN | null) => {
        if (!n) return
        walk(n.left)
        out.push(n.val)
        walk(n.right)
      }
      walk(bst)
      return out
    },
    heap_insert: (v: number) => {
      const val = Number(v)
      heap.push(val)
      let i = heap.length - 1
      while (i > 0) {
        const p = Math.floor((i - 1) / 2)
        if (heap[p]! <= heap[i]!) break
        const t = heap[p]!
        heap[p] = heap[i]!
        heap[i] = t
        i = p
      }
      const lay = layoutHeap(heap)
      frames.push({
        kind: 'heap',
        title: 'Python min-heap',
        statusText: `heap_insert ${val}`,
        ...lay,
        metrics: `n=${heap.length} · min=${heap[0]}`,
      })
    },
    get_heap: () => heap.slice(),
    hash_insert: (v: number) => {
      const val = Number(v)
      const h = ((val % m) + m) % m
      buckets[h]!.push(val)
      const nodes: StructureFrame['nodes'] = []
      const edges: StructureFrame['edges'] = []
      for (let i = 0; i < m; i++) {
        nodes.push({
          id: `b${i}`,
          label: String(i),
          x: 0.08 + (i / (m - 1)) * 0.84,
          y: 0.2,
          role: i === h ? 'active' : 'default',
        })
      }
      buckets[h]!.forEach((val2, j) => {
        const id = `c${h}_${j}`
        nodes.push({
          id,
          label: String(val2),
          x: 0.08 + (h / (m - 1)) * 0.84,
          y: 0.4 + j * 0.12,
          role: j === buckets[h]!.length - 1 ? 'new' : 'default',
        })
        if (j === 0) edges.push({ from: `b${h}`, to: id })
        else edges.push({ from: `c${h}_${j - 1}`, to: id })
      })
      frames.push({
        kind: 'hash',
        title: 'Python hash chaining',
        statusText: `hash_insert ${val} → bucket ${h}`,
        nodes,
        edges,
        panels: [
          {
            title: `m=${m}`,
            lines: buckets.map((b, i) => `[${i}] → ${b.length ? b.join(' → ') : '∅'}`),
          },
        ],
      })
    },
    get_buckets: () => buckets.map((b) => b.slice()),
  }

  try {
    frames.push({
      kind: mode === 'list' ? 'list' : mode === 'bst' ? 'bst' : mode === 'heap' ? 'heap' : 'hash',
      title: `Python ${mode}`,
      statusText: 'Python start',
      nodes: [],
      edges: [],
    })
    await pyodideBridge.runWithGlobals(code, globals)
    if (frames.length < 2) {
      return { frames, logs, error: 'No structure mutation hooks recorded from Python.' }
    }
    return { frames, logs, error: null }
  } catch (e) {
    return { frames, logs, error: e instanceof Error ? e.message : String(e) }
  }
}

export function templateForStructure(demoId: string): string {
  if (demoId.includes('bst')) return STRUCTURE_BST_TEMPLATE
  if (demoId.includes('heap')) return STRUCTURE_HEAP_TEMPLATE
  if (demoId.includes('hash')) return STRUCTURE_HASH_TEMPLATE
  return STRUCTURE_LIST_TEMPLATE
}

export function structurePythonMode(demoId: string): StructurePyMode {
  if (demoId.includes('bst')) return 'bst'
  if (demoId.includes('heap')) return 'heap'
  if (demoId.includes('hash')) return 'hash'
  return 'list'
}
