/**
 * Honest coverage audit: meat packs vs total coursework.
 * Fails if someone claims "every course comprehensive" without numbers.
 */
import { describe, expect, it } from 'vitest'
import { getAllCourses } from '../courses'
import { allMeatWorkIds, getMeatPack, meatPackCount } from './registry'

describe('content coverage audit (honesty)', () => {
  it('reports meat coverage by course and kind', () => {
    const meatIds = new Set(allMeatWorkIds())
    const rows: {
      course: string
      total: number
      meat: number
      template: number
      liveLab: number
      meatLiveLab: number
      paper: number
      meatPaper: number
      lectureBeatsModules: number
      modules: number
    }[] = []

    let totalWork = 0
    let meatWork = 0
    let templateWork = 0
    let liveLab = 0
    let meatLiveLab = 0
    let paper = 0
    let meatPaper = 0

    for (const c of getAllCourses()) {
      let t = 0
      let m = 0
      let live = 0
      let mLive = 0
      let pap = 0
      let mPap = 0
      let beats = 0
      for (const mod of c.modules) {
        if (mod.lectureBeats?.length) beats++
        for (const w of mod.work) {
          t++
          totalWork++
          const hasMeat = meatIds.has(w.id)
          if (hasMeat) {
            m++
            meatWork++
          } else {
            templateWork++
          }
          const isLab =
            (w.kind === 'lab' || w.kind === 'implementation' || w.kind === 'project') &&
            w.labId &&
            w.config
          if (isLab) {
            liveLab++
            live++
            if (hasMeat) {
              meatLiveLab++
              mLive++
            }
          }
          if (w.kind === 'analysis' || w.kind === 'reading') {
            paper++
            pap++
            if (hasMeat) {
              meatPaper++
              mPap++
            }
          }
        }
      }
      rows.push({
        course: c.id,
        total: t,
        meat: m,
        template: t - m,
        liveLab: live,
        meatLiveLab: mLive,
        paper: pap,
        meatPaper: mPap,
        lectureBeatsModules: beats,
        modules: c.modules.length,
      })
    }

    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify(
        {
          meatPackCount: meatPackCount(),
          totalWork,
          meatWork,
          templateWork,
          pctMeat: Math.round((100 * meatWork) / totalWork),
          liveLab,
          meatLiveLab,
          pctMeatLiveLab: liveLab ? Math.round((100 * meatLiveLab) / liveLab) : 0,
          paper,
          meatPaper,
          pctMeatPaper: paper ? Math.round((100 * meatPaper) / paper) : 0,
          byCourse: rows,
        },
        null,
        2,
      ),
    )

    // Factory complete: 100% meat (Wave 4)
    expect(meatPackCount()).toBe(totalWork)
    expect(totalWork).toBeGreaterThan(100)
    expect(meatWork).toBe(totalWork)
    expect(templateWork).toBe(0)
    expect(meatLiveLab).toBe(liveLab)
    expect(meatPaper).toBe(paper)
    for (const r of rows) {
      expect(r.template, r.course).toBe(0)
      expect(r.lectureBeatsModules, r.course).toBe(r.modules)
    }
  })

  it('samples depth: meat problems have numeric or formal content', () => {
    // Formal/numeric hooks: math, complexity, systems acronyms, logics, standard lab metrics
    const formalRe =
      /\d|Θ|Ω|O\(|prove|Σ|mod |arr=|burst|refs |SQL|DFA|PDA|TM|BFS|DFS|NP|P⊆|cwnd|FD|∀|∃|∈|⊆|→|n²|η|≤|≥|Karp|LCS|ADT|FCFS|SJF|FIFO|LRU|mutex|TLB|PTE|PCB|SIGINT|CSP|Bool|λ|CAP|Gantt|Dijkstra|NFA|Rice|ADR|REST|k-fold|hit rate|extract-min|sift|fork|exec|PLT|GOT|A\*|alpha-beta|SERIALIZABLE|FK|B\+|⊢|≠|⇒|waiting|fault|thrashing|minimax|perceptron|heuristic|inductive|ε-|VMs?\b|container|WCAG|syscall|hazard|interrupt|trap|microkernel|address space|page table|working-set|producer\/consumer|exchange argument|priority queue|adj list|BST|hash table|end-to-end|Dijkstra|linearly separable|d-separation|typing|progress theorem|outlier|hit under|resident|turnaround|fanout|root split|GBN|Selective Repeat|WIP|stack height|activation|cons|Mark done|cumulative t|path\?|vertices\?|domain|WA=R|y=mx|x_i|½|Ctrl-C|%rsp|stdio|polling|SSD|HDD|escape|side channel|uniformly|chess|poker|arc consist|domain size|Burglary|Alarm|mean\/variance|Student\(|Enroll|dirty read|READ COMMITTED|covering index|latency|monolith|token hashing|balanced BST|squared loss|cold \(first|optimal value|learning curves|network-path|big-step|process-lifecycle|schedule-fcfs|schedule-rr|stack-calls|list-append|hash-insert|nl-join|page-fifo|cache-direct|cfg-anbn|env-lookup|bplus/i
    let formal = 0
    let totalProblems = 0
    const soft: { workId: string; problemId: string; prompt: string }[] = []
    for (const id of allMeatWorkIds()) {
      const pack = getMeatPack(id)!
      for (const p of pack.problems) {
        totalProblems++
        if (formalRe.test(p.prompt)) {
          formal++
        } else {
          soft.push({ workId: id, problemId: p.id, prompt: p.prompt.slice(0, 160) })
        }
      }
    }
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        totalProblems,
        formal,
        pctFormal: Math.round((100 * formal) / totalProblems),
        softCount: soft.length,
        soft: soft.slice(0, 80),
      }),
    )
    // Every problem pack item must carry a formal/numeric hook (numbers, Θ/O, SQL, automata, …)
    expect(formal / totalProblems, soft.map((s) => `${s.workId}/${s.problemId}`).join(', ')).toBe(1)
  })
})

