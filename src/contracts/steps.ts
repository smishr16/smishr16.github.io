/** Shared step model for sorting visualizations (frozen contract). */

export type SortStep =
  | { type: 'compare'; i: number; j: number }
  | { type: 'swap'; i: number; j: number }
  | { type: 'set'; index: number; value: number }
  | { type: 'mark'; indices: number[]; role: 'sorted' | 'pivot' | 'active' }
  | { type: 'done' }

export function isSortStep(value: unknown): value is SortStep {
  if (!value || typeof value !== 'object') return false
  const t = (value as { type?: string }).type
  return (
    t === 'compare' ||
    t === 'swap' ||
    t === 'set' ||
    t === 'mark' ||
    t === 'done'
  )
}
