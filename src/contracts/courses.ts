/** Course / assignment model for Learn tracks. */

export type ContentStatus = 'live' | 'soon'

export interface CourseMeta {
  id: string
  title: string
  status: ContentStatus
  blurb: string
  /** Short label e.g. "Algorithms" */
  track: string
  /** Estimated modules for card UI */
  labCount: number
}

export interface AssignmentConfig {
  /** Primary algorithm id (bubble | insertion | merge) */
  algoId?: string
  /** Secondary algorithm for compare mode */
  algoBId?: string
  compare?: boolean
  runMode?: 'reference' | 'python'
  arraySize?: number
  /** Optional fixed array for reproducible assignments */
  fixedArray?: number[]
}

export interface Assignment {
  id: string
  title: string
  brief: string
  /** Which free lab opens this assignment */
  labId: string
  status: ContentStatus
  config: AssignmentConfig
}

export interface CourseDetail extends CourseMeta {
  overview: string
  learningGoals: string[]
  assignments: Assignment[]
}

export interface LabMeta {
  id: string
  title: string
  status: ContentStatus
  blurb: string
  path: string
  topics: string[]
}
