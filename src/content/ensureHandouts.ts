import type { CourseDetail, CourseWork } from '../contracts'
import { normalizeCourse } from './normalizeCourse'
import { buildProblemPack, isQualityHandout } from './problemPacks'

/** @deprecated Use normalizeCourse — kept for tests that inspect pack builder. */
export function defaultHandoutFor(work: CourseWork): NonNullable<CourseWork['handout']> {
  // Quality pack without course context still must not be objective-echo
  return buildProblemPack('algorithms', {
    id: 'm',
    code: 'M',
    title: work.title,
    summary: work.brief,
    topics: [work.title],
    outcomes: [work.objective],
    work: [work],
  }, work)
}

export function ensureWorkHandout(work: CourseWork): CourseWork {
  if (work.handout && isQualityHandout(work)) return work
  return {
    ...work,
    handout: defaultHandoutFor(work),
  }
}

/** Canonical entry: quality packs + honest statuses + liveLabCount. */
export function ensureCourseHandouts(course: CourseDetail): CourseDetail {
  return normalizeCourse(course)
}

export { isQualityHandout, normalizeCourse }
