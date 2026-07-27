import { describe, expect, it } from 'vitest'
import { getMlDemo, mlDemos } from './demos'

describe('ml demos', () => {
  it('exports four demos', () => {
    expect(mlDemos.map((d) => d.id)).toEqual([
      'linreg-1d',
      'decision-boundary',
      'kmeans-2d',
      'train-test-curves',
    ])
  })

  it('each demo produces multi-frame output with points', () => {
    for (const d of mlDemos) {
      const frames = d.generate()
      expect(frames.length).toBeGreaterThan(3)
      expect(frames.some((f) => (f.points?.length ?? 0) > 0)).toBe(true)
    }
  })

  it('getMlDemo throws on unknown', () => {
    expect(() => getMlDemo('nope')).toThrow(/Unknown/)
  })
})
