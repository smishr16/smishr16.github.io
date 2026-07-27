/** Graph / search instrument contracts. */

export type GraphAlgoId = 'bfs' | 'dfs' | 'dijkstra' | 'astar'

export type GraphNodeRole = 'default' | 'start' | 'goal' | 'frontier' | 'visited' | 'current' | 'path'

export type GraphEdgeRole = 'default' | 'explore' | 'tree' | 'path'

export interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
  /** Undirected if false */
  directed?: boolean
  weight?: number
}

export interface GraphInstance {
  id: string
  name: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  defaultStart: string
  defaultGoal: string
}

export interface GraphFrame {
  statusText: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  nodeRoles: Record<string, GraphNodeRole>
  edgeRoles: Record<string, GraphEdgeRole>
  /** Optional metric line (expansions, path cost) */
  metrics?: string
}

export interface IGraphAlgorithm {
  id: GraphAlgoId
  label: string
  complexity: string
  description: string
  /** Weighted algorithms use edge weights */
  weighted: boolean
  generate(graph: GraphInstance, start: string, goal: string): GraphFrame[]
}

export function edgeKey(from: string, to: string): string {
  return `${from}->${to}`
}
