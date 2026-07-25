import { describe, expect, it } from 'vitest'
import { bubbleSort, mergeSort } from './algorithms'
import { countStepStats } from './stepStats'

describe('stepStats', () => {
  it('counts compares and swaps for bubble on reverse array', () => {
    const steps = bubbleSort.generateSteps([3, 2, 1])
    const s = countStepStats(steps)
    expect(s.compares).toBeGreaterThan(0)
    expect(s.swaps).toBeGreaterThan(0)
    expect(s.total).toBe(steps.length)
  })

  it('merge uses fewer compares than bubble on larger reverse input', () => {
    const arr = [8, 7, 6, 5, 4, 3, 2, 1]
    const b = countStepStats(bubbleSort.generateSteps(arr))
    const m = countStepStats(mergeSort.generateSteps(arr))
    expect(m.compares).toBeLessThan(b.compares)
  })
})
