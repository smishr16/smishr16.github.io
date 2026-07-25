export const AppRoutes = {
  home: '/',
  learn: '/learn',
  lab: '/lab',
  /** Free sorting visualizer (not course-gated) */
  labSorting: '/lab/sorting',
  /** Course detail: /learn/sorting */
  course: (courseId: string) => `/learn/${courseId}`,
  /** Open lab with assignment preconfiguration */
  assignmentLab: (labId: string, assignmentId: string) =>
    `/lab/${labId}?assignment=${encodeURIComponent(assignmentId)}`,
} as const

/** @deprecated use AppRoutes.labSorting — kept for deep links */
export const LEGACY_SORTING_PATH = '/learn/sorting'

export type AppRoute = string
