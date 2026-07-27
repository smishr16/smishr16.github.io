import type { ISortingAlgorithm, SortStep } from '../../contracts'

/** Lomuto partition quicksort (last element as pivot) — teaching-friendly frames. */
export const quickSort: ISortingAlgorithm = {
  id: 'quicksort',
  label: 'Quicksort',
  complexity: 'O(n log n) expected · O(n²) worst',
  generateSteps(input: number[]): SortStep[] {
    const a = input.slice()
    const steps: SortStep[] = []

    function partition(lo: number, hi: number): number {
      const pivot = a[hi]!
      steps.push({ type: 'mark', indices: [hi], role: 'pivot' })
      let i = lo
      for (let j = lo; j < hi; j++) {
        steps.push({ type: 'compare', i: j, j: hi })
        if (a[j]! <= pivot) {
          if (i !== j) {
            const t = a[i]!
            a[i] = a[j]!
            a[j] = t
            steps.push({ type: 'swap', i, j })
          }
          i++
        }
      }
      if (i !== hi) {
        const t = a[i]!
        a[i] = a[hi]!
        a[hi] = t
        steps.push({ type: 'swap', i, j: hi })
      }
      steps.push({ type: 'mark', indices: [i], role: 'sorted' })
      return i
    }

    function qs(lo: number, hi: number): void {
      if (lo >= hi) {
        if (lo === hi) steps.push({ type: 'mark', indices: [lo], role: 'sorted' })
        return
      }
      steps.push({
        type: 'mark',
        indices: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k),
        role: 'active',
      })
      const p = partition(lo, hi)
      qs(lo, p - 1)
      qs(p + 1, hi)
    }

    if (a.length) qs(0, a.length - 1)
    steps.push({ type: 'done' })
    return steps
  },
}
