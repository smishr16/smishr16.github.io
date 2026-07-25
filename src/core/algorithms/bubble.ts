import type { ISortingAlgorithm, SortStep } from '../../contracts'

export const bubbleSort: ISortingAlgorithm = {
  id: 'bubble',
  label: 'Bubble Sort',
  complexity: 'O(n²) typical / worst',
  generateSteps(input: number[]): SortStep[] {
    const a = input.slice()
    const steps: SortStep[] = []
    const n = a.length
    for (let i = 0; i < n; i++) {
      let swapped = false
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: 'compare', i: j, j: j + 1 })
        if (a[j]! > a[j + 1]!) {
          const t = a[j]!
          a[j] = a[j + 1]!
          a[j + 1] = t
          steps.push({ type: 'swap', i: j, j: j + 1 })
          swapped = true
        }
      }
      steps.push({ type: 'mark', indices: [n - i - 1], role: 'sorted' })
      if (!swapped) break
    }
    steps.push({ type: 'done' })
    return steps
  },
}
