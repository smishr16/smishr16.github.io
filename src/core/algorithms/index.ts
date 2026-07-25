import type { ISortingAlgorithm } from '../../contracts'
import { bubbleSort } from './bubble'
import { insertionSort } from './insertion'
import { mergeSort } from './merge'

export const sortingAlgorithms: ISortingAlgorithm[] = [
  bubbleSort,
  insertionSort,
  mergeSort,
]

export function getAlgorithm(id: string): ISortingAlgorithm | undefined {
  return sortingAlgorithms.find((a) => a.id === id)
}

export { bubbleSort, insertionSort, mergeSort }
