import type { GraphInstance } from '../../contracts/graph'

/** Small fixed graphs for deterministic teaching demos. */
export const graphInstances: GraphInstance[] = [
  {
    id: 'city-6',
    name: 'City (6 nodes)',
    defaultStart: 'A',
    defaultGoal: 'F',
    nodes: [
      { id: 'A', label: 'A', x: 0.12, y: 0.5 },
      { id: 'B', label: 'B', x: 0.32, y: 0.22 },
      { id: 'C', label: 'C', x: 0.32, y: 0.78 },
      { id: 'D', label: 'D', x: 0.55, y: 0.35 },
      { id: 'E', label: 'E', x: 0.55, y: 0.68 },
      { id: 'F', label: 'F', x: 0.82, y: 0.5 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 2 },
      { from: 'A', to: 'C', weight: 4 },
      { from: 'B', to: 'D', weight: 3 },
      { from: 'B', to: 'E', weight: 5 },
      { from: 'C', to: 'E', weight: 1 },
      { from: 'D', to: 'F', weight: 4 },
      { from: 'E', to: 'F', weight: 2 },
      { from: 'D', to: 'E', weight: 1 },
    ],
  },
  {
    id: 'grid-ish',
    name: 'Ladder (search)',
    defaultStart: 'S',
    defaultGoal: 'G',
    nodes: [
      { id: 'S', label: 'S', x: 0.1, y: 0.5 },
      { id: 'A', label: 'A', x: 0.3, y: 0.25 },
      { id: 'B', label: 'B', x: 0.3, y: 0.75 },
      { id: 'C', label: 'C', x: 0.55, y: 0.25 },
      { id: 'D', label: 'D', x: 0.55, y: 0.75 },
      { id: 'G', label: 'G', x: 0.85, y: 0.5 },
    ],
    edges: [
      { from: 'S', to: 'A', weight: 1 },
      { from: 'S', to: 'B', weight: 1 },
      { from: 'A', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 1 },
      { from: 'C', to: 'G', weight: 1 },
      { from: 'D', to: 'G', weight: 3 },
      { from: 'A', to: 'D', weight: 4 },
      { from: 'C', to: 'D', weight: 1 },
    ],
  },
  {
    id: 'campus',
    name: 'Campus (8 nodes)',
    defaultStart: 'Gate',
    defaultGoal: 'Lab',
    nodes: [
      { id: 'Gate', label: 'Gate', x: 0.08, y: 0.5 },
      { id: 'Lib', label: 'Lib', x: 0.28, y: 0.22 },
      { id: 'Cafe', label: 'Cafe', x: 0.28, y: 0.78 },
      { id: 'Quad', label: 'Quad', x: 0.48, y: 0.5 },
      { id: 'Hall', label: 'Hall', x: 0.65, y: 0.22 },
      { id: 'Gym', label: 'Gym', x: 0.65, y: 0.78 },
      { id: 'CS', label: 'CS', x: 0.82, y: 0.35 },
      { id: 'Lab', label: 'Lab', x: 0.92, y: 0.65 },
    ],
    edges: [
      { from: 'Gate', to: 'Lib', weight: 2 },
      { from: 'Gate', to: 'Cafe', weight: 2 },
      { from: 'Lib', to: 'Quad', weight: 2 },
      { from: 'Cafe', to: 'Quad', weight: 3 },
      { from: 'Quad', to: 'Hall', weight: 2 },
      { from: 'Quad', to: 'Gym', weight: 2 },
      { from: 'Hall', to: 'CS', weight: 1 },
      { from: 'Gym', to: 'Lab', weight: 2 },
      { from: 'CS', to: 'Lab', weight: 2 },
      { from: 'Hall', to: 'Lab', weight: 4 },
      { from: 'Lib', to: 'Hall', weight: 3 },
    ],
  },
  {
    id: 'dag-small',
    name: 'Tiny DAG (topo demos)',
    defaultStart: 'A',
    defaultGoal: 'E',
    nodes: [
      { id: 'A', label: 'A', x: 0.1, y: 0.5 },
      { id: 'B', label: 'B', x: 0.35, y: 0.25 },
      { id: 'C', label: 'C', x: 0.35, y: 0.75 },
      { id: 'D', label: 'D', x: 0.6, y: 0.5 },
      { id: 'E', label: 'E', x: 0.88, y: 0.5 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 1, directed: true },
      { from: 'A', to: 'C', weight: 1, directed: true },
      { from: 'B', to: 'D', weight: 1, directed: true },
      { from: 'C', to: 'D', weight: 1, directed: true },
      { from: 'D', to: 'E', weight: 1, directed: true },
      { from: 'C', to: 'E', weight: 3, directed: true },
    ],
  },
]

export function getGraphInstance(id: string): GraphInstance {
  return graphInstances.find((g) => g.id === id) ?? graphInstances[0]!
}
