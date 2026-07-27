import { describe, expect, it } from 'vitest'
import { getStructureDemo, structureDemos } from './demos'

describe('structure demos', () => {
  it('includes list, bst, heap, hash, bplus', () => {
    expect(structureDemos.map((d) => d.id)).toContain('bplus-insert')
    expect(getStructureDemo('bplus-insert').generate([1, 2, 3, 4]).length).toBeGreaterThan(2)
  })

  it('throws on unknown demo id', () => {
    expect(() => getStructureDemo('nope')).toThrow(/Unknown/)
  })

  it('BST insert produces growing node sets', () => {
    const frames = getStructureDemo('bst-insert').generate([5, 3, 7])
    expect(frames.length).toBeGreaterThan(3)
    const last = frames[frames.length - 1]!
    expect(last.nodes.length).toBe(3)
    expect(last.edges.length).toBe(2)
  })

  it('heap insert ends with root as minimum', () => {
    const values = [9, 4, 7, 1]
    const frames = getStructureDemo('heap-insert').generate(values)
    const last = frames[frames.length - 1]!
    const root = last.nodes.find((n) => n.id === 'h0')
    expect(root?.label).toBe('1')
  })

  it('hash insert fills buckets', () => {
    const frames = getStructureDemo('hash-insert').generate([10, 3, 17])
    expect(frames.length).toBeGreaterThan(3)
    const last = frames[frames.length - 1]!
    expect(last.panels?.[0]?.lines.some((l) => l.includes('→'))).toBe(true)
  })
})
