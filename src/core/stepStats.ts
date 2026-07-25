import type { SortStep } from '../contracts'

export interface StepStats {
  total: number
  compares: number
  swaps: number
  writes: number
}

export function countStepStats(steps: readonly SortStep[]): StepStats {
  let compares = 0
  let swaps = 0
  let writes = 0
  for (const s of steps) {
    if (s.type === 'compare') compares++
    else if (s.type === 'swap') swaps++
    else if (s.type === 'set') writes++
  }
  return { total: steps.length, compares, swaps, writes }
}

export function formatStats(s: StepStats): string {
  const parts = [`${s.compares} compares`, `${s.swaps} swaps`]
  if (s.writes > 0) parts.push(`${s.writes} writes`)
  parts.push(`${s.total} steps`)
  return parts.join(' · ')
}
