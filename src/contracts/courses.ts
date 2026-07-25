/** University-style courses: topics with syllabus modules and lab work. */

export type ContentStatus = 'live' | 'partial' | 'soon'
export type CourseLevel = 'undergraduate' | 'graduate' | 'undergraduate+graduate'

export interface CourseMeta {
  id: string
  title: string
  status: ContentStatus
  /** Catalog area, e.g. "Algorithms" */
  track: string
  /** Academic level framing */
  level: CourseLevel
  /** One-line catalog blurb */
  blurb: string
  /** e.g. "≈ ALG 2xx / grad algorithms elective depth" */
  academicNote?: string
  moduleCount: number
  /** How many labs are currently runnable */
  liveLabCount: number
}

export interface AssignmentConfig {
  algoId?: string
  algoBId?: string
  compare?: boolean
  runMode?: 'reference' | 'python'
  arraySize?: number
  fixedArray?: number[]
}

/**
 * A lab or problem set item that may open the visualizer preconfigured.
 * Theory-only items have no lab link (status soon or theory-only flag).
 */
export interface CourseWork {
  id: string
  title: string
  /** What the student is expected to do / demonstrate */
  objective: string
  /** Brief pedagogical framing */
  brief: string
  kind: 'reading' | 'analysis' | 'lab' | 'implementation' | 'project'
  status: ContentStatus
  labId?: string
  config?: AssignmentConfig
}

/** A syllabus module (week/unit), not a single algorithm name. */
export interface CourseModule {
  id: string
  code: string
  title: string
  summary: string
  topics: string[]
  outcomes: string[]
  work: CourseWork[]
}

export interface CourseDetail extends CourseMeta {
  overview: string
  prerequisites: string[]
  learningGoals: string[]
  modules: CourseModule[]
}

export interface LabMeta {
  id: string
  title: string
  status: ContentStatus
  blurb: string
  path: string
  topics: string[]
}

/** Flatten all lab/implementation work for deep-link lookup. */
export function flattenCourseWork(course: CourseDetail): CourseWork[] {
  return course.modules.flatMap((m) => m.work)
}
