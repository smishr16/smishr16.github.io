import { describe, expect, it } from 'vitest'
import { getSystemsDemo, systemsDemos } from './demos'

describe('systems demos', () => {
  it('exports scheduling, memory, process, cache, stack, minimax demos', () => {
    expect(systemsDemos.length).toBeGreaterThanOrEqual(9)
    expect(systemsDemos.some((d) => d.id === 'schedule-rr')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'page-lru')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'cache-direct')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'stack-calls')).toBe(true)
    expect(systemsDemos.some((d) => d.id === 'minimax-tree')).toBe(true)
  })

  it('RR produces gantt slices', () => {
    const frames = getSystemsDemo('schedule-rr').generate()
    expect(frames.length).toBeGreaterThan(3)
    const withSlices = frames.filter((f) => (f.slices?.length ?? 0) > 0)
    expect(withSlices.length).toBeGreaterThan(0)
  })

  it('FIFO page replacement counts faults', () => {
    const frames = getSystemsDemo('page-fifo').generate()
    const last = frames[frames.length - 1]!
    expect(last.statusText.toLowerCase()).toMatch(/fault/)
    expect(last.metrics ?? '').toMatch(/faults=/)
  })

  it('process lifecycle has multiple states', () => {
    const frames = getSystemsDemo('process-lifecycle').generate()
    expect(frames.some((f) => f.processes?.some((p) => p.state === 'blocked'))).toBe(true)
  })

  it('new curriculum demos produce frames (DFA, CFG, window, join, env)', () => {
    for (const id of ['dfa-ends01', 'cfg-anbn', 'sliding-window', 'nl-join', 'env-lookup'] as const) {
      const frames = getSystemsDemo(id).generate()
      expect(frames.length, id).toBeGreaterThan(2)
    }
    const dfa = getSystemsDemo('dfa-ends01').generate()
    expect(dfa[dfa.length - 1]!.statusText).toMatch(/ACCEPT|REJECT/)
    const join = getSystemsDemo('nl-join').generate()
    expect(join[join.length - 1]!.statusText.toLowerCase()).toMatch(/done|result/)
  })

  it('PDA, TM, AIMD demos are course-native instruments', () => {
    const pda = getSystemsDemo('pda-anbn').generate()
    expect(pda.length).toBeGreaterThan(4)
    expect(pda.some((f) => /ACCEPT/i.test(f.statusText))).toBe(true)
    expect(pda.some((f) => (f.stackFrames?.length ?? 0) > 0)).toBe(true)

    const tm = getSystemsDemo('tm-anbn').generate()
    expect(tm.length).toBeGreaterThan(5)
    expect(tm[tm.length - 1]!.statusText).toMatch(/ACCEPT/i)

    const aimd = getSystemsDemo('tcp-aimd').generate()
    expect(aimd.length).toBeGreaterThan(8)
    expect(aimd.some((f) => /LOSS/i.test(f.statusText))).toBe(true)
  })

  it('gap-closure demos: dfa-mod3, gbn-loss, hash-join, pl-small-step', () => {
    expect(getSystemsDemo('dfa-mod3').generate().length).toBeGreaterThan(4)
    expect(getSystemsDemo('gbn-loss').generate().some((f) => /LOSS|rexmit|retransmit/i.test(f.statusText))).toBe(
      true,
    )
    expect(getSystemsDemo('hash-join').generate().length).toBeGreaterThan(3)
    const sos = getSystemsDemo('pl-small-step').generate()
    expect(sos[sos.length - 1]!.treeNodes?.[0]?.label).toMatch(/20/)
  })

  it('interactive opts: custom DFA input and GBN window', () => {
    const mod = getSystemsDemo('dfa-mod3')
    expect(mod.acceptsInput).toBe(true)
    const f = mod.generate({ input: '11' }) // 3 mod 3 = 0
    expect(f[f.length - 1]!.statusText).toMatch(/q0|mod 3 = 0/)
    const g = getSystemsDemo('gbn-loss').generate({ windowSize: 4, lossSeq: 2 })
    expect(g.some((x) => /DATA2|window=4/i.test(x.statusText + (x.title ?? '')))).toBe(true)
    expect(getSystemsDemo('join-compare').generate().length).toBeGreaterThan(2)
    expect(getSystemsDemo('pl-type-stlc').generate().length).toBeGreaterThan(2)
    expect(getSystemsDemo('csp-ac').generate().length).toBeGreaterThan(3)
  })
})


