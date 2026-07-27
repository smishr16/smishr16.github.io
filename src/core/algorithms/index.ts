import type { ISortingAlgorithm } from '../../contracts'
import { bubbleSort } from './bubble'
import { insertionSort } from './insertion'
import { mergeSort } from './merge'
import { quickSort } from './quicksort'

export const sortingAlgorithms: ISortingAlgorithm[] = [
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
]

export function getAlgorithm(id: string): ISortingAlgorithm | undefined {
  return sortingAlgorithms.find((a) => a.id === id)
}

export { bubbleSort, insertionSort, mergeSort, quickSort }
