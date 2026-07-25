export const AppRoutes = {
  home: '/',
  learn: '/learn',
  lab: '/lab',
  /** Free sorting visualizer (instrument — not a course) */
  labSorting: '/lab/sorting',
  /** Course detail: /learn/algorithms, /learn/data-structures, … */
  course: (courseId: string) => `/learn/${courseId}`,
  /** Open lab with coursework preconfiguration */
  assignmentLab: (labId: string, assignmentId: string) =>
    `/lab/${labId}?assignment=${encodeURIComponent(assignmentId)}`,
} as const

/** Old “sorting course” URL → Algorithms course */
export const LEGACY_SORTING_COURSE_PATH = '/learn/sorting'

export type AppRoute = string
