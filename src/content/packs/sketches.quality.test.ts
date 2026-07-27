import { describe, expect, it } from 'vitest'
import { allMeatWorkIds, getMeatPack } from './registry'

const BULK =
  /^Outline: state assumptions, show key equation or trace step, conclude with Θ\/complexity or accept\/reject claim\. Expand on paper\.$/

describe('solution sketch quality', () => {
  it('every pack has a solutionSketch', () => {
    const missing: string[] = []
    for (const id of allMeatWorkIds()) {
      if (!getMeatPack(id)?.solutionSketch?.sketch) missing.push(id)
    }
    expect(missing, missing.join(', ')).toEqual([])
  })

  it('no bulk boilerplate outline sketches remain', () => {
    const bulk: string[] = []
    for (const id of allMeatWorkIds()) {
      const s = getMeatPack(id)?.solutionSketch?.sketch ?? ''
      if (BULK.test(s)) bulk.push(id)
    }
    expect(bulk, bulk.join(', ')).toEqual([])
  })

  it('sketches are substantive (≥40 chars)', () => {
    for (const id of allMeatWorkIds()) {
      const s = getMeatPack(id)!.solutionSketch!.sketch
      expect(s.length, id).toBeGreaterThanOrEqual(40)
    }
  })

  it('showcase packs have high-signal sketches (numeric or formal tokens)', () => {
    const showcase = [
      'm3-quicksort-analysis',
      'toc-m1-ps',
      'os-m3-ps',
      'os-m3-lab-fcfs',
      'alg-midterm',
      'os-midterm',
      'toc-midterm',
      'ai-m4-lab',
      'db-m5-lab-join-cost',
    ]
    const formal = /\d|Θ|Ω|O\(|mod |SQL|DFA|BFS|FCFS|SJF|⊢|→|n²|≤|≥/
    for (const id of showcase) {
      const pack = getMeatPack(id)
      expect(pack, id).toBeDefined()
      expect(formal.test(pack!.solutionSketch!.sketch), id).toBe(true)
    }
  })
})
