import type { CourseModule, CourseWork, SourceRef } from '../contracts'

/** Build a written analysis scaffold for a module (always present — never blank). */
export function analysisWork(
  id: string,
  title: string,
  objective: string,
  brief: string,
  status: CourseWork['status'] = 'partial',
  sources?: SourceRef[],
): CourseWork {
  return {
    id,
    title,
    kind: 'analysis',
    status,
    objective,
    brief,
    sources,
  }
}

/** Build a reading scaffold. */
export function readingWork(
  id: string,
  title: string,
  objective: string,
  brief: string,
  status: CourseWork['status'] = 'partial',
  sources?: SourceRef[],
): CourseWork {
  return {
    id,
    title,
    kind: 'reading',
    status,
    objective,
    brief,
    sources,
  }
}

/** Build a lab placeholder (instrument not shipped). */
export function labSoon(
  id: string,
  title: string,
  labId: string,
  objective: string,
  brief: string,
  sources?: SourceRef[],
): CourseWork {
  return {
    id,
    title,
    kind: 'lab',
    status: 'soon',
    labId,
    objective,
    brief,
    sources,
  }
}

/** Convenience: module with required topics/outcomes/readings/work. */
export function moduleOf(
  partial: Omit<CourseModule, 'work' | 'readings'> & {
    work?: CourseWork[]
    readings?: SourceRef[]
  },
): CourseModule {
  const work = partial.work ?? []
  if (work.length === 0) {
    throw new Error(`Module ${partial.id} must have at least one work item`)
  }
  if (!partial.topics.length || !partial.outcomes.length) {
    throw new Error(`Module ${partial.id} needs topics and outcomes`)
  }
  return {
    ...partial,
    work,
    readings: partial.readings ?? [],
  }
}
