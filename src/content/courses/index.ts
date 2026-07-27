import type { CourseDetail, CourseMeta, CourseWork, LabMeta } from '../../contracts'
import { AppRoutes } from '../../contracts'
import { ensureCourseHandouts } from '../ensureHandouts'
import { sortingContent } from '../sortingContent'

import { algorithmsCourse, algorithmsMeta } from './algorithms'
import { artificialIntelligenceCourse, artificialIntelligenceMeta } from './artificial-intelligence'
import { computerNetworksCourse, computerNetworksMeta } from './computer-networks'
import { computerSystemsCourse, computerSystemsMeta } from './computer-systems'
import { dataStructuresCourse, dataStructuresMeta } from './data-structures'
import { databasesCourse, databasesMeta } from './databases'
import { discreteMathCourse, discreteMathMeta } from './discrete-math'
import { machineLearningCourse, machineLearningMeta } from './machine-learning'
import { operatingSystemsCourse, operatingSystemsMeta } from './operating-systems'
import { programmingLanguagesCourse, programmingLanguagesMeta } from './programming-languages'
import { softwareEngineeringCourse, softwareEngineeringMeta } from './software-engineering'
import { theoryOfComputationCourse, theoryOfComputationMeta } from './theory-of-computation'

export { sortingContent }

const courseDetails: Record<string, CourseDetail> = {
  algorithms: algorithmsCourse,
  'data-structures': dataStructuresCourse,
  'computer-systems': computerSystemsCourse,
  'operating-systems': operatingSystemsCourse,
  'discrete-math': discreteMathCourse,
  'theory-of-computation': theoryOfComputationCourse,
  databases: databasesCourse,
  'computer-networks': computerNetworksCourse,
  'programming-languages': programmingLanguagesCourse,
  'software-engineering': softwareEngineeringCourse,
  'artificial-intelligence': artificialIntelligenceCourse,
  'machine-learning': machineLearningCourse,
}

const catalogOrder: CourseMeta[] = [
  dataStructuresMeta,
  algorithmsMeta,
  computerSystemsMeta,
  operatingSystemsMeta,
  discreteMathMeta,
  theoryOfComputationMeta,
  databasesMeta,
  computerNetworksMeta,
  programmingLanguagesMeta,
  softwareEngineeringMeta,
  artificialIntelligenceMeta,
  machineLearningMeta,
]

/**
 * Catalog mirrors foundational CSE undergraduate courses (after intro programming).
 * Topics like “sorting” live inside Algorithms, not as their own course.
 * AI and ML are separate courses.
 */
function finalize(raw: CourseDetail): CourseDetail {
  return ensureCourseHandouts(raw)
}

export const courses: CourseMeta[] = catalogOrder.map((meta) => {
  const detail = courseDetails[meta.id]
  if (!detail) return meta
  const normalized = finalize(detail)
  return {
    ...meta,
    status: normalized.status,
    moduleCount: normalized.moduleCount,
    liveLabCount: normalized.liveLabCount,
    cs2023Areas: normalized.cs2023Areas,
  }
})

/** Visualizer instruments (not courses). */
export const labs: LabMeta[] = [
  {
    id: 'sorting',
    title: 'Sorting visualizer',
    status: 'live',
    path: AppRoutes.labSorting,
    blurb:
      'Instrument comparison sorts for the Algorithms course (and free exploration): step, dual-run, Python hooks.',
    topics: ['Algorithms', 'Sorting unit', 'Empirical analysis'],
  },
  {
    id: 'structures',
    title: 'Data structures visualizer',
    status: 'live',
    path: AppRoutes.labStructures,
    blurb: 'List, BST, heap, and hash-table demos for Data Structures (and related units).',
    topics: ['Data Structures', 'Databases (B+ trees later)'],
  },
  {
    id: 'graphs',
    title: 'Graph & search visualizer',
    status: 'live',
    path: AppRoutes.labGraphs,
    blurb: 'BFS, DFS, Dijkstra, and A* on shared teaching graphs for Algorithms and AI.',
    topics: ['Algorithms', 'Graphs', 'Artificial Intelligence'],
  },
  {
    id: 'systems',
    title: 'Systems visualizer',
    status: 'live',
    path: AppRoutes.labSystems,
    blurb:
      'Scheduling, memory, stacks, automata/CFG toys, network path & ARQ, joins, and env chains — Systems/OS plus cross-course demos.',
    topics: ['Computer Systems', 'Operating Systems', 'Theory', 'Networks', 'PL', 'Databases'],
  },
  {
    id: 'ml',
    title: 'ML playground',
    status: 'live',
    path: AppRoutes.labMl,
    blurb: 'Client-side toys: linear regression GD, perceptron boundary, k-means — not GPU training.',
    topics: ['Machine Learning'],
  },
]

/** Legacy course id → current id */
export const LEGACY_COURSE_REDIRECTS: Record<string, string> = {
  sorting: 'algorithms',
  'computer-organization': 'computer-systems',
}

export function getCourse(id: string): CourseDetail | undefined {
  const resolved = LEGACY_COURSE_REDIRECTS[id] ?? id
  const raw = courseDetails[resolved]
  return raw ? finalize(raw) : undefined
}

export function getAllCourses(): CourseDetail[] {
  return catalogOrder
    .map((c) => courseDetails[c.id])
    .filter((c): c is CourseDetail => Boolean(c))
    .map(finalize)
}

export function findAssignmentById(assignmentId: string): {
  course: CourseDetail
  assignment: CourseWork
  moduleId: string
} | undefined {
  for (const raw of Object.values(courseDetails)) {
    const c = finalize(raw)
    for (const mod of c.modules) {
      const a = mod.work.find((w) => w.id === assignmentId)
      if (a) return { course: c, assignment: a, moduleId: mod.id }
    }
  }
  return undefined
}

export function getAllLiveLabWork(): CourseWork[] {
  return getAllCourses().flatMap((c) =>
    c.modules
      .flatMap((m) => m.work)
      .filter((w) => w.status === 'live' && w.labId && w.config),
  )
}
