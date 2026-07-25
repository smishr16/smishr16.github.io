import type { ISortingAlgorithm, SortStep } from '../../contracts'

export const insertionSort: ISortingAlgorithm = {
  id: 'insertion',
  label: 'Insertion Sort',
  complexity: 'O(n²) worst · O(n) best',
  generateSteps(input: number[]): SortStep[] {
    const a = input.slice()
    const steps: SortStep[] = []
    for (let i = 1; i < a.length; i++) {
      let j = i
      steps.push({ type: 'mark', indices: [i], role: 'active' })
      while (j > 0) {
        steps.push({ type: 'compare', i: j - 1, j })
        if (a[j - 1]! <= a[j]!) break
        const t = a[j - 1]!
        a[j - 1] = a[j]!
        a[j] = t
        steps.push({ type: 'swap', i: j - 1, j })
        j -= 1
      }
      steps.push({
        type: 'mark',
        indices: Array.from({ length: i + 1 }, (_, k) => k),
        role: 'sorted',
      })
    }
    steps.push({ type: 'done' })
    return steps
  },
}
