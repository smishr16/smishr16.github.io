import type { ContentStatus, CourseDetail, CourseWork } from '../contracts'
import { countLiveLabs } from '../contracts'
import { applyMeatPack, getMeatPack } from './packs/registry'
import { buildProblemPack, isQualityHandout, withPackSources } from './problemPacks'

/** Derive honest course status from openable instrument count. */
export function deriveCourseStatus(openableLabs: number): ContentStatus {
  if (openableLabs >= 4) return 'live'
  if (openableLabs >= 1) return 'partial'
  return 'soon' // syllabus-only (still enterable)
}

function normalizeWork(courseId: string, mod: CourseDetail['modules'][0], work: CourseWork): CourseWork {
  // Apply curated meat first (problems with pts, specific instances)
  const withMeat = applyMeatPack(work)
  const handout = buildProblemPack(courseId, mod, withMeat)
  const meat = getMeatPack(work.id)
  const sources = meat?.sources?.length ? meat.sources : withPackSources(withMeat, courseId)
  let status = withMeat.status

  // Written work may be live only if quality handout exists (always true after buildProblemPack)
  if (work.kind === 'analysis' || work.kind === 'reading') {
    status = isQualityHandout({ ...work, handout }) ? 'live' : 'partial'
  }

  // Labs without config cannot be live
  if (
    (work.kind === 'lab' || work.kind === 'implementation' || work.kind === 'project') &&
    work.labId &&
    !work.config
  ) {
    status = 'soon'
  }

  // Labs with config: live
  if (
    (work.kind === 'lab' || work.kind === 'implementation' || work.kind === 'project') &&
    work.labId &&
    work.config
  ) {
    status = 'live'
  }

  return {
    ...withMeat,
    handout,
    sources: sources ?? withMeat.sources,
    status,
  }
}

/** Full honesty pass: packs, sources, statuses, liveLabCount. */
export function normalizeCourse(raw: CourseDetail): CourseDetail {
  const modules = raw.modules.map((mod) => ({
    ...mod,
    work: mod.work.map((w) => normalizeWork(raw.id, mod, w)),
  }))
  const draft: CourseDetail = { ...raw, modules }
  const liveLabCount = countLiveLabs(draft)
  const status = deriveCourseStatus(liveLabCount)
  return {
    ...draft,
    liveLabCount,
    status,
    moduleCount: modules.length,
  }
}
