/** Legacy lesson content shapes still used by the sorting lab concept panel. */

export interface LessonContent {
  title: string
  intro: string
  perAlgo: Record<string, { idea: string; complexity: string }>
}
