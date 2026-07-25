import type { ISortingAlgorithm, SortStep } from '../../contracts'

export const mergeSort: ISortingAlgorithm = {
  id: 'merge',
  label: 'Merge Sort',
  complexity: 'O(n log n)',
  generateSteps(input: number[]): SortStep[] {
    const a = input.slice()
    const steps: SortStep[] = []

    function merge(lo: number, mid: number, hi: number): void {
      const left = a.slice(lo, mid + 1)
      const right = a.slice(mid + 1, hi + 1)
      let i = 0
      let j = 0
      let k = lo
      while (i < left.length && j < right.length) {
        steps.push({
          type: 'compare',
          i: lo + i,
          j: mid + 1 + j,
        })
        if (left[i]! <= right[j]!) {
          a[k] = left[i]!
          steps.push({ type: 'set', index: k, value: left[i]! })
          i++
        } else {
          a[k] = right[j]!
          steps.push({ type: 'set', index: k, value: right[j]! })
          j++
        }
        k++
      }
      while (i < left.length) {
        a[k] = left[i]!
        steps.push({ type: 'set', index: k, value: left[i]! })
        i++
        k++
      }
      while (j < right.length) {
        a[k] = right[j]!
        steps.push({ type: 'set', index: k, value: right[j]! })
        j++
        k++
      }
    }

    function sort(lo: number, hi: number): void {
      if (lo >= hi) return
      const mid = Math.floor((lo + hi) / 2)
      steps.push({ type: 'mark', indices: [mid], role: 'pivot' })
      sort(lo, mid)
      sort(mid + 1, hi)
      merge(lo, mid, hi)
    }

    if (a.length > 0) sort(0, a.length - 1)
    steps.push({ type: 'done' })
    return steps
  },
}
