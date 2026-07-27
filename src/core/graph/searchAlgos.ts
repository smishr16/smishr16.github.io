import type {
  GraphAlgoId,
  GraphEdge,
  GraphFrame,
  GraphInstance,
  GraphNodeRole,
  IGraphAlgorithm,
} from '../../contracts/graph'
import { edgeKey } from '../../contracts/graph'

function undirectedAdj(graph: GraphInstance): Map<string, { to: string; w: number; undirectedKey: string }[]> {
  const m = new Map<string, { to: string; w: number; undirectedKey: string }[]>()
  for (const n of graph.nodes) m.set(n.id, [])
  for (const e of graph.edges) {
    const w = e.weight ?? 1
    const a = m.get(e.from) ?? []
    const b = m.get(e.to) ?? []
    a.push({ to: e.to, w, undirectedKey: edgeKey(e.from, e.to) })
    b.push({ to: e.from, w, undirectedKey: edgeKey(e.to, e.from) })
    m.set(e.from, a)
    m.set(e.to, b)
  }
  // stable neighbor order by label
  for (const [k, list] of m) {
    list.sort((x, y) => x.to.localeCompare(y.to))
    m.set(k, list)
  }
  return m
}

function baseRoles(graph: GraphInstance, start: string, goal: string): Record<string, GraphNodeRole> {
  const roles: Record<string, GraphNodeRole> = {}
  for (const n of graph.nodes) roles[n.id] = 'default'
  roles[start] = 'start'
  roles[goal] = 'goal'
  return roles
}

function frame(
  graph: GraphInstance,
  statusText: string,
  nodeRoles: Record<string, GraphNodeRole>,
  edgeRoles: Record<string, string>,
  metrics?: string,
): GraphFrame {
  return {
    statusText,
    nodes: graph.nodes,
    edges: graph.edges,
    nodeRoles: { ...nodeRoles },
    edgeRoles: { ...edgeRoles } as GraphFrame['edgeRoles'],
    metrics,
  }
}

function reconstructPath(came: Map<string, string>, start: string, goal: string): string[] {
  const path: string[] = [goal]
  let cur = goal
  while (cur !== start) {
    const p = came.get(cur)
    if (!p) return []
    path.push(p)
    cur = p
  }
  path.reverse()
  return path
}

function paintPath(
  path: string[],
  nodeRoles: Record<string, GraphNodeRole>,
  edgeRoles: Record<string, string>,
): void {
  for (const id of path) {
    if (nodeRoles[id] !== 'start' && nodeRoles[id] !== 'goal') nodeRoles[id] = 'path'
  }
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]!
    const b = path[i + 1]!
    edgeRoles[edgeKey(a, b)] = 'path'
    edgeRoles[edgeKey(b, a)] = 'path'
  }
}

function bfsDfs(
  graph: GraphInstance,
  start: string,
  goal: string,
  mode: 'bfs' | 'dfs',
): GraphFrame[] {
  const adj = undirectedAdj(graph)
  const frames: GraphFrame[] = []
  const visited = new Set<string>()
  const came = new Map<string, string>()
  const edgeRoles: Record<string, string> = {}
  const order: string[] = []

  type Item = string
  const bag: Item[] = [start]
  visited.add(start)

  frames.push(
    frame(
      graph,
      mode === 'bfs' ? `BFS: start at ${start}` : `DFS: start at ${start}`,
      { ...baseRoles(graph, start, goal), [start]: 'current' },
      edgeRoles,
      'expansions: 0',
    ),
  )

  let expansions = 0
  while (bag.length) {
    const u = mode === 'bfs' ? bag.shift()! : bag.pop()!
    expansions++
    order.push(u)
    const roles = baseRoles(graph, start, goal)
    for (const v of visited) {
      if (v !== start && v !== goal) roles[v] = 'visited'
    }
    roles[u] = 'current'
    for (const id of bag) {
      if (id !== start && id !== goal) roles[id] = 'frontier'
    }
    frames.push(
      frame(graph, `Expand ${u}`, roles, edgeRoles, `expansions: ${expansions} · frontier: [${bag.join(', ')}]`),
    )

    if (u === goal) {
      const path = reconstructPath(came, start, goal)
      const doneRoles = { ...roles }
      paintPath(path.length ? path : [start, goal], doneRoles, edgeRoles)
      frames.push(
        frame(
          graph,
          path.length ? `Found ${goal}. Path: ${path.join(' → ')}` : `Reached ${goal}`,
          doneRoles,
          edgeRoles,
          `expansions: ${expansions} · path length: ${Math.max(path.length - 1, 0)}`,
        ),
      )
      return frames
    }

    for (const { to, undirectedKey } of adj.get(u) ?? []) {
      edgeRoles[undirectedKey] = 'explore'
      edgeRoles[edgeKey(u, to)] = 'explore'
      if (!visited.has(to)) {
        visited.add(to)
        came.set(to, u)
        bag.push(to)
        edgeRoles[edgeKey(u, to)] = 'tree'
        edgeRoles[undirectedKey] = 'tree'
        const roles2 = baseRoles(graph, start, goal)
        for (const v of visited) {
          if (v !== start && v !== goal) roles2[v] = 'visited'
        }
        roles2[u] = 'current'
        for (const id of bag) {
          if (id !== start && id !== goal) roles2[id] = 'frontier'
        }
        frames.push(
          frame(
            graph,
            `Discover ${to} from ${u}`,
            roles2,
            edgeRoles,
            `expansions: ${expansions} · frontier: [${bag.join(', ')}]`,
          ),
        )
      }
    }
  }

  frames.push(
    frame(
      graph,
      `No path from ${start} to ${goal}`,
      baseRoles(graph, start, goal),
      edgeRoles,
      `expansions: ${expansions}`,
    ),
  )
  return frames
}

function dijkstra(graph: GraphInstance, start: string, goal: string): GraphFrame[] {
  const adj = undirectedAdj(graph)
  const frames: GraphFrame[] = []
  const dist = new Map<string, number>()
  const came = new Map<string, string>()
  const done = new Set<string>()
  const edgeRoles: Record<string, string> = {}

  for (const n of graph.nodes) dist.set(n.id, Infinity)
  dist.set(start, 0)

  frames.push(
    frame(graph, `Dijkstra: dist[${start}]=0`, { ...baseRoles(graph, start, goal), [start]: 'current' }, edgeRoles, 'settled: 0'),
  )

  while (done.size < graph.nodes.length) {
    let u: string | null = null
    let best = Infinity
    for (const n of graph.nodes) {
      if (done.has(n.id)) continue
      const d = dist.get(n.id) ?? Infinity
      if (d < best) {
        best = d
        u = n.id
      }
    }
    if (u === null || best === Infinity) break
    done.add(u)

    const roles = baseRoles(graph, start, goal)
    for (const id of done) {
      if (id !== start && id !== goal) roles[id] = 'visited'
    }
    roles[u] = 'current'
    for (const n of graph.nodes) {
      if (!done.has(n.id) && (dist.get(n.id) ?? Infinity) < Infinity) {
        if (n.id !== start && n.id !== goal) roles[n.id] = 'frontier'
      }
    }

    frames.push(
      frame(
        graph,
        `Settle ${u} with dist=${best}`,
        roles,
        edgeRoles,
        `settled: ${done.size} · dist[${u}]=${best}`,
      ),
    )

    if (u === goal) {
      const path = reconstructPath(came, start, goal)
      paintPath(path, roles, edgeRoles)
      frames.push(
        frame(
          graph,
          `Goal settled. Path cost ${best}: ${path.join(' → ')}`,
          roles,
          edgeRoles,
          `path cost: ${best}`,
        ),
      )
      return frames
    }

    for (const { to, w, undirectedKey } of adj.get(u) ?? []) {
      if (done.has(to)) continue
      edgeRoles[edgeKey(u, to)] = 'explore'
      edgeRoles[undirectedKey] = 'explore'
      const alt = best + w
      const cur = dist.get(to) ?? Infinity
      if (alt < cur) {
        dist.set(to, alt)
        came.set(to, u)
        edgeRoles[edgeKey(u, to)] = 'tree'
        const roles2 = { ...roles }
        if (to !== start && to !== goal) roles2[to] = 'frontier'
        frames.push(
          frame(
            graph,
            `Relax ${u}→${to}: dist[${to}]=${alt}`,
            roles2,
            edgeRoles,
            `dist[${to}]=${alt}`,
          ),
        )
      }
    }
  }

  frames.push(frame(graph, `No path from ${start} to ${goal}`, baseRoles(graph, start, goal), edgeRoles))
  return frames
}

/** Euclidean heuristic on laid-out coordinates (teaching toy). */
function heuristic(graph: GraphInstance, a: string, b: string): number {
  const na = graph.nodes.find((n) => n.id === a)
  const nb = graph.nodes.find((n) => n.id === b)
  if (!na || !nb) return 0
  const dx = (na.x - nb.x) * 10
  const dy = (na.y - nb.y) * 10
  return Math.hypot(dx, dy)
}

function astar(graph: GraphInstance, start: string, goal: string): GraphFrame[] {
  const adj = undirectedAdj(graph)
  const frames: GraphFrame[] = []
  const gScore = new Map<string, number>()
  const fScore = new Map<string, number>()
  const came = new Map<string, string>()
  const closed = new Set<string>()
  const open = new Set<string>([start])
  const edgeRoles: Record<string, string> = {}

  for (const n of graph.nodes) {
    gScore.set(n.id, Infinity)
    fScore.set(n.id, Infinity)
  }
  gScore.set(start, 0)
  fScore.set(start, heuristic(graph, start, goal))

  frames.push(
    frame(
      graph,
      `A*: open={${start}} f=${fScore.get(start)?.toFixed(2)}`,
      { ...baseRoles(graph, start, goal), [start]: 'frontier' },
      edgeRoles,
    ),
  )

  while (open.size) {
    let u: string | null = null
    let bestF = Infinity
    for (const id of open) {
      const f = fScore.get(id) ?? Infinity
      if (f < bestF) {
        bestF = f
        u = id
      }
    }
    if (!u) break
    open.delete(u)
    closed.add(u)

    const roles = baseRoles(graph, start, goal)
    for (const id of closed) {
      if (id !== start && id !== goal) roles[id] = 'visited'
    }
    for (const id of open) {
      if (id !== start && id !== goal) roles[id] = 'frontier'
    }
    roles[u] = 'current'

    frames.push(
      frame(
        graph,
        `Expand ${u} (g=${(gScore.get(u) ?? 0).toFixed(2)}, f=${bestF.toFixed(2)})`,
        roles,
        edgeRoles,
        `open: [${[...open].join(', ')}]`,
      ),
    )

    if (u === goal) {
      const path = reconstructPath(came, start, goal)
      paintPath(path, roles, edgeRoles)
      frames.push(
        frame(
          graph,
          `Goal reached. Path: ${path.join(' → ')}`,
          roles,
          edgeRoles,
          `path cost g=${(gScore.get(goal) ?? 0).toFixed(2)}`,
        ),
      )
      return frames
    }

    for (const { to, w, undirectedKey } of adj.get(u) ?? []) {
      if (closed.has(to)) continue
      edgeRoles[edgeKey(u, to)] = 'explore'
      edgeRoles[undirectedKey] = 'explore'
      const tentative = (gScore.get(u) ?? Infinity) + w
      if (tentative < (gScore.get(to) ?? Infinity)) {
        came.set(to, u)
        gScore.set(to, tentative)
        fScore.set(to, tentative + heuristic(graph, to, goal))
        open.add(to)
        edgeRoles[edgeKey(u, to)] = 'tree'
        const roles2 = { ...roles }
        if (to !== start && to !== goal) roles2[to] = 'frontier'
        frames.push(
          frame(
            graph,
            `Update ${to}: g=${tentative.toFixed(2)} f=${(fScore.get(to) ?? 0).toFixed(2)}`,
            roles2,
            edgeRoles,
          ),
        )
      }
    }
  }

  frames.push(frame(graph, `No path from ${start} to ${goal}`, baseRoles(graph, start, goal), edgeRoles))
  return frames
}

export const graphAlgorithms: IGraphAlgorithm[] = [
  {
    id: 'bfs',
    label: 'BFS',
    complexity: 'O(V+E)',
    description: 'Unweighted shortest path in hops; FIFO frontier.',
    weighted: false,
    generate: (g, s, t) => bfsDfs(g, s, t, 'bfs'),
  },
  {
    id: 'dfs',
    label: 'DFS',
    complexity: 'O(V+E)',
    description: 'Depth-first exploration; not optimal for shortest path.',
    weighted: false,
    generate: (g, s, t) => bfsDfs(g, s, t, 'dfs'),
  },
  {
    id: 'dijkstra',
    label: 'Dijkstra',
    complexity: 'O((V+E) log V) typical',
    description: 'Non-negative weights; settles nodes in distance order.',
    weighted: true,
    generate: dijkstra,
  },
  {
    id: 'astar',
    label: 'A*',
    complexity: 'Heuristic-dependent',
    description: 'Best-first with g+h; Euclidean layout heuristic (teaching toy).',
    weighted: true,
    generate: astar,
  },
]

export function getGraphAlgorithm(id: GraphAlgoId | string): IGraphAlgorithm {
  return graphAlgorithms.find((a) => a.id === id) ?? graphAlgorithms[0]!
}

/** Exported for tests — adjacency helper uses edges only */
export function countEdges(edges: GraphEdge[]): number {
  return edges.length
}
