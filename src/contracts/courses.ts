/** University-style courses: syllabus modules, peer anchors, and lab work. */

export type ContentStatus = 'live' | 'partial' | 'soon'
export type CourseLevel = 'undergraduate' | 'graduate' | 'undergraduate+graduate'

/** Peer university course used as curriculum alignment (not affiliation). */
export interface PeerAnchor {
  school: string
  courseCode: string
  title: string
  /** Public syllabus / OCW URL when known */
  url?: string
  note?: string
}

/** Citation for readings / handouts — required for long-form or lab claims. */
export interface SourceRef {
  label: string
  kind: 'ocw' | 'textbook' | 'paper' | 'notes' | 'curriculum' | 'other'
  url?: string
  /** e.g. chapter range */
  locator?: string
}

export interface CourseMeta {
  id: string
  title: string
  status: ContentStatus
  /** Catalog area, e.g. "Core · required" */
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
  /** CS2023 knowledge areas (short codes) */
  cs2023Areas?: string[]
}

export interface AssignmentConfig {
  /** Sorting instrument */
  algoId?: string
  algoBId?: string
  compare?: boolean
  runMode?: 'reference' | 'python'
  arraySize?: number
  fixedArray?: number[]
  /** Graph / search instrument */
  graphAlgo?: string
  graphId?: string
  start?: string
  goal?: string
  /** Structures instrument */
  structureDemo?: string
  values?: number[]
  /** Systems instrument */
  systemsDemo?: string
  /** ML playground */
  mlDemo?: string
}

/**
 * A lab or problem set item that may open the visualizer preconfigured.
 * Theory-only items have no lab link.
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
  /** Citations for this work item (required for labs when published) */
  sources?: SourceRef[]
  /**
   * Optional expanded handout: tasks, deliverables, self-check.
   * Shown on the course page when present.
   */
  handout?: {
    tasks: string[]
    deliverables: string[]
    selfCheck: string[]
    timeEstimate?: string
  }
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
  /** Recommended readings / OCW units for this module */
  readings?: SourceRef[]
  /** Rough week or unit label, e.g. "Weeks 1–2" */
  schedule?: string
  /**
   * Lecture beats — the “meat” talking points for a week
   * (not full lecture notes; exam-relevant bullets).
   */
  lectureBeats?: string[]
}

export interface CourseDetail extends CourseMeta {
  overview: string
  prerequisites: string[]
  learningGoals: string[]
  modules: CourseModule[]
  /** Peer courses this syllabus is aligned with (examples, not official) */
  peerAnchors: PeerAnchor[]
  /** Honest licensing / affiliation disclaimer */
  licenseNote: string
  /** Primary CS2023 knowledge areas */
  cs2023Areas: string[]
}

export interface LabMeta {
  id: string
  title: string
  status: ContentStatus
  blurb: string
  path: string
  topics: string[]
}

/** Shared product disclaimer for all course pages. */
export const DEFAULT_LICENSE_NOTE =
  'Independent open educational product. Peer course codes are alignment anchors only — not affiliated with, endorsed by, or copies of those universities. Prefer public syllabi and OCW links; original problem sets are inspired by standard topics, not reproduced verbatim.'

/** Flatten all lab/implementation work for deep-link lookup. */
export function flattenCourseWork(course: CourseDetail): CourseWork[] {
  return course.modules.flatMap((m) => m.work)
}

/** Count live lab/impl/project work that can open an instrument. */
export function countLiveLabs(course: CourseDetail): number {
  return flattenCourseWork(course).filter(
    (w) =>
      (w.status === 'live' || w.status === 'partial') &&
      w.labId &&
      w.config &&
      (w.kind === 'lab' || w.kind === 'implementation' || w.kind === 'project'),
  ).length
}
