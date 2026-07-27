import type { GraphFrame, GraphInstance, GraphNodeRole } from '../contracts/graph'
import { edgeKey } from '../contracts/graph'
import { pyodideBridge } from './pyodideBridge'

export const GRAPH_BFS_TEMPLATE = `# CS Visual Lab — BFS (Python)
# Hooks: nodes(), neighbors(u), visit(u), set_parent(child, parent),
#        set_frontier(list), explore(u, v), finish(path_list), log(msg)

from collections import deque

def bfs(start, goal):
    q = deque([start])
    seen = {start}
    parent = {start: None}
    visit(start)
    set_frontier(list(q))
    while q:
        u = q.popleft()
        visit(u)
        if u == goal:
            # reconstruct
            path = []
            cur = goal
            while cur is not None:
                path.append(cur)
                cur = parent.get(cur)
            path.reverse()
            finish(path)
            log("bfs done")
            return path
        for v in neighbors(u):
            explore(u, v)
            if v not in seen:
                seen.add(v)
                parent[v] = u
                set_parent(v, u)
                q.append(v)
                set_frontier(list(q))
    finish([])
    log("no path")
    return []

# start/goal injected as globals START, GOAL
bfs(START, GOAL)
`

export const GRAPH_DFS_TEMPLATE = `# CS Visual Lab — DFS (Python)
# Hooks: nodes(), neighbors(u), visit(u), set_parent(child, parent),
#        set_frontier(list), explore(u, v), finish(path_list), log(msg)

def dfs(start, goal):
    stack = [start]
    seen = {start}
    parent = {start: None}
    visit(start)
    set_frontier(list(stack))
    while stack:
        u = stack.pop()
        visit(u)
        if u == goal:
            path = []
            cur = goal
            while cur is not None:
                path.append(cur)
                cur = parent.get(cur)
            path.reverse()
            finish(path)
            log("dfs done")
            return path
        for v in reversed(list(neighbors(u))):
            explore(u, v)
            if v not in seen:
                seen.add(v)
                parent[v] = u
                set_parent(v, u)
                stack.append(v)
                set_frontier(list(stack))
    finish([])
    log("no path")
    return []

dfs(START, GOAL)
`

function baseRoles(graph: GraphInstance, start: string, goal: string): Record<string, GraphNodeRole> {
  const roles: Record<string, GraphNodeRole> = {}
  for (const n of graph.nodes) roles[n.id] = 'default'
  roles[start] = 'start'
  roles[goal] = 'goal'
  return roles
}

export async function runGraphPython(
  code: string,
  graph: GraphInstance,
  start: string,
  goal: string,
): Promise<{ frames: GraphFrame[]; logs: string[]; error: string | null }> {
  const logs: string[] = []
  const frames: GraphFrame[] = []
  const visited = new Set<string>()
  const frontier = new Set<string>()
  const parent = new Map<string, string>()
  const edgeRoles: Record<string, string> = {}

  const adj = new Map<string, string[]>()
  for (const n of graph.nodes) adj.set(n.id, [])
  for (const e of graph.edges) {
    adj.get(e.from)?.push(e.to)
    adj.get(e.to)?.push(e.from)
  }
  for (const [k, list] of adj) {
    list.sort()
    adj.set(k, list)
  }

  function pushFrame(status: string, current?: string) {
    const roles = baseRoles(graph, start, goal)
    for (const v of visited) {
      if (v !== start && v !== goal) roles[v] = 'visited'
    }
    for (const f of frontier) {
      if (f !== start && f !== goal) roles[f] = 'frontier'
    }
    if (current) roles[current] = 'current'
    frames.push({
      statusText: status,
      nodes: graph.nodes,
      edges: graph.edges,
      nodeRoles: roles,
      edgeRoles: { ...edgeRoles } as GraphFrame['edgeRoles'],
      metrics: `visited=${visited.size} · from Python`,
    })
  }

  const weightAdj = new Map<string, { to: string; w: number }[]>()
  for (const n of graph.nodes) weightAdj.set(n.id, [])
  for (const e of graph.edges) {
    const w = e.weight ?? 1
    weightAdj.get(e.from)?.push({ to: e.to, w })
    weightAdj.get(e.to)?.push({ to: e.from, w })
  }

  const globals = {
    START: start,
    GOAL: goal,
    nodes: () => graph.nodes.map((n) => n.id),
    neighbors: (u: string) => (adj.get(String(u)) ?? []).slice(),
    neighbors_w: (u: string) =>
      (weightAdj.get(String(u)) ?? []).map((x) => [x.to, x.w] as [string, number]),
    visit: (u: string) => {
      const id = String(u)
      visited.add(id)
      frontier.delete(id)
      pushFrame(`visit ${id}`, id)
    },
    set_parent: (child: string, par: string) => {
      parent.set(String(child), String(par))
      edgeRoles[edgeKey(String(par), String(child))] = 'tree'
    },
    set_dist: (u: string, d: number) => {
      frontier.add(String(u))
      pushFrame(`dist[${u}]=${d}`, String(u))
    },
    set_frontier: (list: string[]) => {
      frontier.clear()
      for (const x of list ?? []) frontier.add(String(x))
      pushFrame(`frontier=[${[...frontier].join(',')}]`)
    },
    explore: (u: string, v: string) => {
      edgeRoles[edgeKey(String(u), String(v))] = 'explore'
      pushFrame(`explore ${u}→${v}`, String(u))
    },
    finish: (path: string[]) => {
      const roles = baseRoles(graph, start, goal)
      for (const v of visited) {
        if (v !== start && v !== goal) roles[v] = 'visited'
      }
      const p = (path ?? []).map(String)
      for (const id of p) {
        if (id !== start && id !== goal) roles[id] = 'path'
      }
      for (let i = 0; i < p.length - 1; i++) {
        edgeRoles[edgeKey(p[i]!, p[i + 1]!)] = 'path'
        edgeRoles[edgeKey(p[i + 1]!, p[i]!)] = 'path'
      }
      frames.push({
        statusText: p.length ? `path ${p.join('→')}` : 'no path',
        nodes: graph.nodes,
        edges: graph.edges,
        nodeRoles: roles,
        edgeRoles: { ...edgeRoles } as GraphFrame['edgeRoles'],
        metrics: `path length ${Math.max(p.length - 1, 0)}`,
      })
    },
    log: (msg: string) => logs.push(String(msg)),
  }

  try {
    pushFrame('Python start')
    await pyodideBridge.runWithGlobals(code, globals)
    if (frames.length < 2) {
      return {
        frames,
        logs,
        error: 'No search events recorded. Call visit/explore/finish from Python.',
      }
    }
    return { frames, logs, error: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return { frames, logs, error: message }
  }
}

export const GRAPH_DIJKSTRA_TEMPLATE = `# CS Visual Lab — Dijkstra (Python)
# Hooks: nodes(), neighbors_w(u) -> list of (v, weight),
#        visit(u), set_dist(u, d), explore(u, v), finish(path_list), log(msg)
# Teaching implementation (O(V^2) scans).

def dijkstra(start, goal):
    dist = {u: float("inf") for u in nodes()}
    dist[start] = 0
    prev = {}
    done = set()
    set_dist(start, 0)
    visit(start)
    while len(done) < len(nodes()):
        u = None
        best = float("inf")
        for x in nodes():
            if x not in done and dist[x] < best:
                best = dist[x]
                u = x
        if u is None or best == float("inf"):
            break
        done.add(u)
        visit(u)
        if u == goal:
            path = []
            cur = goal
            while cur is not None:
                path.append(cur)
                cur = prev.get(cur)
            path.reverse()
            finish(path)
            log(f"dijkstra cost={best}")
            return path
        for v, w in neighbors_w(u):
            explore(u, v)
            alt = best + w
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u
                set_dist(v, alt)
    finish([])
    log("no path")
    return []

dijkstra(START, GOAL)
`

export function templateForGraphAlgo(algoId: string): string {
  if (algoId === 'dfs') return GRAPH_DFS_TEMPLATE
  if (algoId === 'dijkstra') return GRAPH_DIJKSTRA_TEMPLATE
  return GRAPH_BFS_TEMPLATE
}
