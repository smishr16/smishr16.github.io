import { describe, expect, it } from 'vitest'
import { allMeatWorkIds, getMeatPack, meatPackCount } from './registry'
import { meatToHandout } from './types'
import { getCourse, findAssignmentById } from '../courses'
import { isQualityHandout } from '../problemPacks'

describe('meat pack registry', () => {
  it('registers a substantial number of curated packs', () => {
    expect(meatPackCount()).toBeGreaterThanOrEqual(40)
  })

  it('every pack has ≥3 problems with real prompts', () => {
    for (const id of allMeatWorkIds()) {
      const p = getMeatPack(id)!
      expect(p.problems.length, id).toBeGreaterThanOrEqual(3)
      for (const pr of p.problems) {
        expect(pr.prompt.length, `${id}/${pr.id}`).toBeGreaterThan(35)
        expect(pr.title.length).toBeGreaterThan(2)
      }
      const handout = meatToHandout(p)
      expect(isQualityHandout({ id, title: id, objective: 'x', brief: 'y', kind: 'analysis', status: 'live', handout })).toBe(
        true,
      )
    }
  })

  it('algorithms asymptotics pack is wired to live course work', () => {
    const found = findAssignmentById('alg-m1-problem-set')
    expect(found).toBeDefined()
    const course = getCourse('algorithms')!
    const w = course.modules.flatMap((m) => m.work).find((x) => x.id === 'alg-m1-problem-set')!
    expect(w.handout?.tasks.some((t) => /n!|2ⁿ|nested/i.test(t))).toBe(true)
    expect(w.handout?.tasks.some((t) => /\d+\s*pts/i.test(t))).toBe(true)
  })

  it('lab meat packs attach to openable labs', () => {
    for (const id of ['m3-asymptotic-lab', 'alg-m4-dijkstra-lab', 'ml-m2-lab', 'os-m3-lab-rr']) {
      const found = findAssignmentById(id)
      expect(found, id).toBeDefined()
      expect(found!.assignment.config).toBeTruthy()
      expect(getMeatPack(id)).toBeDefined()
    }
  })
})
