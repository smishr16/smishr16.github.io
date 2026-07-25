import type { SortStep } from './steps'

export interface ISortingAlgorithm {
  id: string
  label: string
  /** Big-O style callout, e.g. "O(n²) typical" */
  complexity: string
  generateSteps(array: number[]): SortStep[]
}
