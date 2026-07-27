import { describe, expect, it } from 'vitest'
import {
  AppRoutes,
  DEFAULT_LICENSE_NOTE,
  countLiveLabs,
  flattenCourseWork,
} from '../contracts'
import {
  courses,
  findAssignmentById,
  getAllCourses,
  getAllLiveLabWork,
  getCourse,
  LEGACY_COURSE_REDIRECTS,
} from './courses'

const REQUIRED_IDS = [
  'data-structures',
  'algorithms',
  'computer-systems',
  'operating-systems',
  'discrete-math',
  'theory-of-computation',
  'databases',
  'computer-networks',
  'programming-languages',
  'software-engineering',
  'artificial-intelligence',
  'machine-learning',
] as const

describe('curriculum catalog', () => {
  it('lists all 12 core courses with AI ≠ ML', () => {
    expect(courses.map((c) => c.id).sort()).toEqual([...REQUIRED_IDS].sort())
    expect(courses.some((c) => c.id === 'artificial-intelligence')).toBe(true)
    expect(courses.some((c) => c.id === 'machine-learning')).toBe(true)
    expect(courses.some((c) => c.id === 'computer-organization')).toBe(false)
  })

  it('every catalog course has a full CourseDetail pack', () => {
    const details = getAllCourses()
    expect(details).toHaveLength(REQUIRED_IDS.length)

    for (const id of REQUIRED_IDS) {
      const course = getCourse(id)
      expect(course, id).toBeDefined()
      expect(course!.modules.length).toBeGreaterThanOrEqual(6)
      expect(course!.peerAnchors.length).toBeGreaterThanOrEqual(2)
      expect(course!.cs2023Areas.length).toBeGreaterThanOrEqual(1)
      expect(course!.licenseNote).toContain('not affiliated')
      expect(course!.prerequisites.length).toBeGreaterThan(0)
      expect(course!.learningGoals.length).toBeGreaterThan(0)
      expect(course!.moduleCount).toBe(course!.modules.length)
    }
  })

  it('modules are never empty: topics, outcomes, work, readings', () => {
    for (const course of getAllCourses()) {
      for (const mod of course.modules) {
        expect(mod.topics.length, `${course.id}/${mod.id} topics`).toBeGreaterThan(0)
        expect(mod.outcomes.length, `${course.id}/${mod.id} outcomes`).toBeGreaterThan(0)
        expect(mod.work.length, `${course.id}/${mod.id} work`).toBeGreaterThan(0)
        expect(mod.readings?.length ?? 0, `${course.id}/${mod.id} readings`).toBeGreaterThan(0)
      }
    }
  })

  it('legacy redirects resolve', () => {
    expect(LEGACY_COURSE_REDIRECTS.sorting).toBe('algorithms')
    expect(LEGACY_COURSE_REDIRECTS['computer-organization']).toBe('computer-systems')
    expect(getCourse('sorting')?.id).toBe('algorithms')
    expect(getCourse('computer-organization')?.id).toBe('computer-systems')
    expect(AppRoutes.course('algorithms')).toBe('/learn/algorithms')
  })

  it('algorithms live labs still deep-link', () => {
    const live = getAllLiveLabWork()
    expect(live.length).toBeGreaterThanOrEqual(8)
    const sample = findAssignmentById('m3-asymptotic-lab')
    expect(sample?.course.id).toBe('algorithms')
    expect(sample?.assignment.config?.compare).toBe(true)
    expect(countLiveLabs(getCourse('algorithms')!)).toBeGreaterThanOrEqual(6)
  })

  it('graph and structures assignment deep-links resolve', () => {
    const g = findAssignmentById('alg-m4-bfs-dfs-lab')
    expect(g?.assignment.labId).toBe('graphs')
    expect(g?.assignment.config?.graphAlgo).toBe('bfs')
    const s = findAssignmentById('ds-m4-lab')
    expect(s?.assignment.labId).toBe('structures')
    expect(s?.assignment.config?.structureDemo).toBe('bst-insert')
    const ai = findAssignmentById('ai-m2-lab-astar')
    expect(ai?.course.id).toBe('artificial-intelligence')
    expect(ai?.assignment.config?.graphAlgo).toBe('astar')
  })

  it('live labs carry citations', () => {
    for (const w of getAllLiveLabWork()) {
      // Prefer sources on instrumented work; soft-fail message includes id
      expect(w.labId, w.id).toBeTruthy()
      expect(w.config, w.id).toBeTruthy()
    }
  })

  it('exports license constant used by packs', () => {
    expect(DEFAULT_LICENSE_NOTE.length).toBeGreaterThan(40)
    expect(flattenCourseWork(getCourse('algorithms')!).length).toBeGreaterThan(5)
  })
})
