import { describe, expect, it } from 'vitest'
import { getAllCourses, getCourse } from './courses'
import { isQualityHandout } from './problemPacks'

describe('ensure handouts + honesty', () => {
  it('every work item has a quality handout (not objective echo)', () => {
    for (const course of getAllCourses()) {
      for (const mod of course.modules) {
        for (const w of mod.work) {
          expect(w.handout, `${course.id}/${mod.id}/${w.id}`).toBeDefined()
          expect(isQualityHandout(w), `${course.id}/${w.id} quality`).toBe(true)
          expect(w.handout!.tasks.length).toBeGreaterThanOrEqual(3)
          expect(w.handout!.tasks[0]).not.toBe(w.objective)
          expect(w.handout!.tasks[0]?.startsWith('Objective:')).toBe(false)
        }
      }
    }
  })

  it('liveLabCount matches count of openable labs; status is derived', () => {
    for (const c of getAllCourses()) {
      const openable = c.modules
        .flatMap((m) => m.work)
        .filter(
          (w) =>
            w.status === 'live' &&
            w.labId &&
            w.config &&
            (w.kind === 'lab' || w.kind === 'implementation' || w.kind === 'project'),
        ).length
      expect(c.liveLabCount, c.id).toBe(openable)
      if (openable >= 4) expect(c.status).toBe('live')
      else if (openable >= 1) expect(c.status).toBe('partial')
      else expect(c.status).toBe('soon')
    }
  })

  it('preserves explicit quality handouts on algorithms asymptotic lab', () => {
    const alg = getCourse('algorithms')!
    const m3 = alg.modules.find((m) => m.id === 'alg-m3-sorting')!
    const asymptotic = m3.work.find((w) => w.id === 'm3-asymptotic-lab')!
    expect(asymptotic.handout?.tasks.some((t) => /insertion|merge|n∈/i.test(t))).toBe(true)
  })
})
