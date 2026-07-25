import type { LessonContent } from '../contracts'

export const sortingContent: LessonContent = {
  title: 'Sorting algorithms',
  intro:
    'Sorting puts values into order. The interesting part is how many comparisons and moves an algorithm needs — that is the seed of algorithmic efficiency. Step through each algorithm, then try the Python lab: your compare/swap calls drive the same visualization.',
  perAlgo: {
    bubble: {
      idea: 'Repeatedly compare neighbors and swap if out of order. Large values “bubble” toward the end.',
      complexity: 'O(n²) typical / worst · O(n) best if already sorted (with early exit)',
    },
    insertion: {
      idea: 'Grow a sorted prefix by inserting each next element into its place, shifting larger values right.',
      complexity: 'O(n²) worst · O(n) best on nearly sorted data',
    },
    merge: {
      idea: 'Divide the array, sort halves, then merge. Fewer comparisons in the worst case than simple pairwise bubbling.',
      complexity: 'O(n log n) time · O(n) extra space for the merge buffers',
    },
  },
}
