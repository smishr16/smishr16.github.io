import { describe, expect, it } from 'vitest'
import { FIXTURE_ARRAY } from '../contracts'
import { bubbleSort, insertionSort, mergeSort } from './algorithms'

function applySteps(input: number[], steps: ReturnType<typeof bubbleSort.generateSteps>): number[] {
  const a = input.slice()
  for (const s of steps) {
    if (s.type === 'swap') {
      const t = a[s.i]!
      a[s.i] = a[s.j]!
      a[s.j] = t
    } else if (s.type === 'set') {
      a[s.index] = s.value
    }
  }
  return a
}

describe('sorting algorithms', () => {
  const cases = [
    [...FIXTURE_ARRAY],
    [5, 4, 3, 2, 1],
    [1, 2, 3, 4],
    [2, 2, 1, 1],
  ]

  for (const algo of [bubbleSort, insertionSort, mergeSort]) {
    it(`${algo.id} sorts known arrays via steps`, () => {
      for (const input of cases) {
        const steps = algo.generateSteps(input)
        expect(steps.some((s) => s.type === 'done')).toBe(true)
        const out = applySteps(input, steps)
        expect(out).toEqual([...input].sort((x, y) => x - y))
      }
    })
  }
})
