/**
 * Deep audit harness — correctness + honesty gates for 5/5 scorecard.
 */
import { describe, expect, it } from 'vitest'
import {
  getAllCourses,
  getAllLiveLabWork,
  findAssignmentById,
  labs,
  courses,
} from './courses'
import { AppRoutes, countLiveLabs } from '../contracts'
import { getGraphAlgorithm } from '../core/graph/searchAlgos'
import { getGraphInstance } from '../core/graph/instances'
import { getStructureDemo } from '../core/structures/demos'
import { getSystemsDemo } from '../core/systems/demos'
import { getMlDemo } from '../core/ml/demos'
import { sortingAlgorithms, getAlgorithm } from '../core/algorithms'
import { isQualityHandout } from './problemPacks'

function applySortSteps(
  arr: number[],
  steps: { type: string; i?: number; j?: number; index?: number; value?: number }[],
) {
  const a = arr.slice()
  for (const s of steps) {
    if (s.type === 'swap' && s.i != null && s.j != null) {
      const t = a[s.i]!
      a[s.i] = a[s.j]!
      a[s.j] = t
    }
    if (s.type === 'set' && s.index != null && s.value != null) a[s.index] = s.value
  }
  return a
}

describe('deep audit: instruments', () => {
  it('sorting algos correct', () => {
    for (const algo of sortingAlgorithms) {
      for (const input of [[3, 1, 2], [5, 4, 3, 2, 1], [2, 2, 1]]) {
        expect(applySortSteps(input, algo.generateSteps(input.slice()))).toEqual(
          [...input].sort((x, y) => x - y),
        )
      }
    }
  })

  it('graph / structures / systems / ml demos generate frames', () => {
    const g = getGraphInstance('city-6')
    for (const id of ['bfs', 'dfs', 'dijkstra', 'astar'] as const) {
      expect(getGraphAlgorithm(id).generate(g, 'A', 'F').length).toBeGreaterThan(2)
    }
    expect(getStructureDemo('heap-insert').generate([9, 4, 1]).length).toBeGreaterThan(2)
    expect(getSystemsDemo('schedule-rr').generate().length).toBeGreaterThan(2)
    expect(getMlDemo('kmeans-2d').generate().length).toBeGreaterThan(2)
  })

  it('unknown systems/ml demo ids throw (fail closed)', () => {
    expect(() => getSystemsDemo('cache-simulator')).toThrow(/Unknown/)
    expect(() => getMlDemo('gpt-training')).toThrow(/Unknown/)
  })
})

describe('deep audit: honesty gates', () => {
  it('all handouts are quality packs', () => {
    for (const c of getAllCourses()) {
      for (const m of c.modules) {
        for (const w of m.work) {
          expect(isQualityHandout(w), `${c.id}/${w.id}`).toBe(true)
        }
      }
    }
  })

  it('defaultish ratio is zero after normalize', () => {
    let total = 0
    let echo = 0
    for (const c of getAllCourses()) {
      for (const m of c.modules) {
        for (const w of m.work) {
          total++
          if (w.handout?.tasks[0] === w.objective || w.handout?.tasks[0]?.startsWith('Objective:')) {
            echo++
          }
        }
      }
    }
    expect(echo).toBe(0)
    expect(total).toBeGreaterThan(100)
  })

  it('liveLabCount / status / deep-links consistent', () => {
    for (const meta of courses) {
      const detail = getAllCourses().find((c) => c.id === meta.id)!
      expect(meta.liveLabCount).toBe(detail.liveLabCount)
      expect(meta.status).toBe(detail.status)
      expect(detail.liveLabCount).toBe(countLiveLabs(detail))
    }
    for (const w of getAllLiveLabWork()) {
      expect(findAssignmentById(w.id)).toBeDefined()
      expect(labs.find((l) => l.id === w.labId)?.status).toBe('live')
      expect(w.sources?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('five live instruments registered', () => {
    expect(labs.filter((l) => l.status === 'live').map((l) => l.id).sort()).toEqual(
      ['graphs', 'ml', 'sorting', 'structures', 'systems'].sort(),
    )
    expect(labs.map((l) => l.path)).toEqual(
      expect.arrayContaining([
        AppRoutes.labSorting,
        AppRoutes.labGraphs,
        AppRoutes.labStructures,
        AppRoutes.labSystems,
        AppRoutes.labMl,
      ]),
    )
  })

  it('Live courses do not claim instruments are unshipped in overview', () => {
    const bad = /instruments?\s+(still\s+)?forthcoming|instruments?\s+not\s+(yet\s+)?shipped|Phase syllabus/i
    for (const c of getAllCourses()) {
      if (c.status !== 'live') continue
      expect(bad.test(c.overview), `${c.id} overview: ${c.overview.slice(0, 80)}`).toBe(false)
    }
  })

  it('quicksort algorithm is registered and sorts', () => {
    const q = getAlgorithm('quicksort')
    expect(q).toBeDefined()
    const input = [5, 1, 4, 2, 3]
    expect(applySortSteps(input, q!.generateSteps(input.slice()))).toEqual([1, 2, 3, 4, 5])
  })
})


describe('deep audit: merge pedagogy still correct', () => {
  it('merge sorts', () => {
    const merge = getAlgorithm('merge')!
    const input = [4, 1, 3, 2]
    expect(applySortSteps(input, merge.generateSteps(input.slice()))).toEqual([1, 2, 3, 4])
  })
})
