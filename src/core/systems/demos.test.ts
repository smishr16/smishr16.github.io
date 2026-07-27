import { describe, expect, it } from 'vitest'
import { getSystemsDemo, systemsDemos } from './demos'

describe('systems demos', () => {
  it('exports scheduling, memory, process, cache, stack, minimax demos', () => {
    expect(systemsDemos.length).toBeGreaterThanOrEqual(9)
    expect(systemsDemos.some((d) => d.id === 'schedule-rr')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'page-lru')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'cache-direct')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'stack-calls')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'minimax-tree')).toBe(true)
  })

  it('RR produces gantt slices', () => {
    const frames = getSystemsDemo('schedule-rr').generate()
    expect(frames.length).toBeGreaterThan(3)
    const withSlices = frames.filter((f) => (f.slices?.length ?? 0) > 0)
    expect(withSlices.length).toBeGreaterThan(0)
  })

  it('FIFO page replacement counts faults', () => {
    const frames = getSystemsDemo('page-fifo').generate()
    const last = frames[frames.length - 1]!
    expect(last.statusText.toLowerCase()).toMatch(/fault/)
    expect(last.metrics ?? '').toMatch(/faults=/)
  })

  it('process lifecycle has multiple states', () => {
    const frames = getSystemsDemo('process-lifecycle').generate()
    expect(frames.some((f) => f.processes?.some((p) => p.state === 'blocked'))).toBe(true)
  })

  it('new curriculum demos produce frames (DFA, CFG, window, join, env)', () => {
    for (const id of ['dfa-ends01', 'cfg-anbn', 'sliding-window', 'nl-join', 'env-lookup'] as const) {
      const frames = getSystemsDemo(id).generate()
      expect(frames.length, id).toBeGreaterThan(2)
    }
    const dfa = getSystemsDemo('dfa-ends01').generate()
    expect(dfa[dfa.length - 1]!.statusText).toMatch(/ACCEPT|REJECT/)
    const join = getSystemsDemo('nl-join').generate()
    expect(join[join.length - 1]!.statusText.toLowerCase()).toMatch(/done|result/)
  })
})
