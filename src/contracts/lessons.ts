export type LessonStatus = 'live' | 'soon'

export interface LessonMeta {
  id: string
  title: string
  status: LessonStatus
  path: string
  blurb: string
}

export interface LessonContent {
  title: string
  intro: string
  perAlgo: Record<string, { idea: string; complexity: string }>
}
