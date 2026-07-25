import { describe, expect, it } from 'vitest'
import {
  ARRAY_SIZE_MAX,
  ARRAY_SIZE_MIN,
  AppRoutes,
  FIXTURE_ARRAY,
  clampArraySize,
  isSortStep,
} from './index'

describe('contracts', () => {
  it('clamps array size', () => {
    expect(clampArraySize(2)).toBe(ARRAY_SIZE_MIN)
    expect(clampArraySize(100)).toBe(ARRAY_SIZE_MAX)
    expect(clampArraySize(16)).toBe(16)
  })

  it('recognizes SortStep shapes', () => {
    expect(isSortStep({ type: 'done' })).toBe(true)
    expect(isSortStep({ type: 'compare', i: 0, j: 1 })).toBe(true)
    expect(isSortStep({ type: 'nope' })).toBe(false)
  })

  it('exports routes and fixture', () => {
    expect(AppRoutes.labSorting).toBe('/lab/sorting')
    expect(AppRoutes.course('algorithms')).toBe('/learn/algorithms')
    expect(AppRoutes.course('data-structures')).toBe('/learn/data-structures')
    expect(AppRoutes.assignmentLab('sorting', 'm3-asymptotic-lab')).toBe(
      '/lab/sorting?assignment=m3-asymptotic-lab',
    )
    expect(FIXTURE_ARRAY).toEqual([3, 1, 2])
  })
})
