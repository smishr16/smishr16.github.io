import type { CourseWork, SourceRef } from '../../contracts'

/** Standalone problem (the academic meat). */
export interface Problem {
  id: string
  /** Short title shown in UI */
  title: string
  /** Full prompt — may include math in Unicode / plain text */
  prompt: string
  /** Suggested points for a 100-pt set */
  points?: number
  /** Optional progressive hint (not solution) */
  hint?: string
}

export interface MeatPack {
  workId: string
  timeEstimate: string
  problems: Problem[]
  deliverables: string[]
  selfCheck: string[]
  sources?: SourceRef[]
  /** Optional worked outline (not full solutions) for 1 problem */
  solutionSketch?: { problemId: string; sketch: string }
}

export function meatToHandout(pack: MeatPack): NonNullable<CourseWork['handout']> {
  return {
    timeEstimate: pack.timeEstimate,
    tasks: pack.problems.map(
      (p) =>
        `**${p.title}**${p.points != null ? ` (${p.points} pts)` : ''}. ${p.prompt}${
          p.hint ? ` Hint: ${p.hint}` : ''
        }`,
    ),
    deliverables: pack.deliverables,
    selfCheck: pack.selfCheck,
  }
}
