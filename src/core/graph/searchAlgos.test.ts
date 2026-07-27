import { describe, expect, it } from 'vitest'
import { getGraphInstance } from './instances'
import { getGraphAlgorithm, graphAlgorithms } from './searchAlgos'

describe('graph search algorithms', () => {
  const g = getGraphInstance('city-6')

  it('exports four algorithms', () => {
    expect(graphAlgorithms.map((a) => a.id)).toEqual(['bfs', 'dfs', 'dijkstra', 'astar'])
  })

  it('BFS finds a path from A to F with frames', () => {
    const frames = getGraphAlgorithm('bfs').generate(g, 'A', 'F')
    expect(frames.length).toBeGreaterThan(3)
    const last = frames[frames.length - 1]!
    expect(last.statusText.toLowerCase()).toMatch(/found|path/)
    expect(Object.values(last.nodeRoles).some((r) => r === 'path' || r === 'goal')).toBe(true)
  })

  it('Dijkstra reports finite path cost on city graph', () => {
    const frames = getGraphAlgorithm('dijkstra').generate(g, 'A', 'F')
    const last = frames[frames.length - 1]!
    expect(last.metrics ?? '').toMatch(/path cost|settled|dist/)
    expect(last.statusText.toLowerCase()).toMatch(/path|goal|settled/)
  })

  it('A* terminates with frames', () => {
    const frames = getGraphAlgorithm('astar').generate(g, 'A', 'F')
    expect(frames.length).toBeGreaterThan(2)
  })
})
