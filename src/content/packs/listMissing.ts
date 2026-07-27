import { getAllCourses } from '../courses'
import { allMeatWorkIds } from './registry'

export type MissingRow = {
  courseId: string
  moduleId: string
  moduleCode: string
  workId: string
  kind: string
  title: string
  labId?: string
  hasConfig: boolean
}

/** All coursework missing a curated meat pack. */
export function listMissingMeat(): MissingRow[] {
  const meat = new Set(allMeatWorkIds())
  const rows: MissingRow[] = []
  for (const c of getAllCourses()) {
    for (const mod of c.modules) {
      for (const w of mod.work) {
        if (meat.has(w.id)) continue
        rows.push({
          courseId: c.id,
          moduleId: mod.id,
          moduleCode: mod.code,
          workId: w.id,
          kind: w.kind,
          title: w.title,
          labId: w.labId,
          hasConfig: Boolean(w.config),
        })
      }
    }
  }
  return rows
}

export function listModulesMissingBeats(): { courseId: string; moduleId: string; code: string; title: string }[] {
  const out: { courseId: string; moduleId: string; code: string; title: string }[] = []
  for (const c of getAllCourses()) {
    for (const mod of c.modules) {
      if ((mod.lectureBeats?.length ?? 0) >= 4) continue
      out.push({ courseId: c.id, moduleId: mod.id, code: mod.code, title: mod.title })
    }
  }
  return out
}
