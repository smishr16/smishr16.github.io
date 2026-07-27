import type { CourseWork } from '../contracts'

/** Shared handout builders for richer problem packs (citation-friendly). */

export function analysisHandout(
  tasks: string[],
  opts?: { deliverables?: string[]; selfCheck?: string[]; timeEstimate?: string },
): NonNullable<CourseWork['handout']> {
  return {
    timeEstimate: opts?.timeEstimate ?? '45–90 min',
    tasks,
    deliverables: opts?.deliverables ?? [
      'Written solutions (PDF or notebook)',
      'Citations for any external references used',
    ],
    selfCheck: opts?.selfCheck ?? [
      'Every claim has a justification or counterexample',
      'Notation is consistent with course readings',
      'No uncited copied problem statements from universities',
    ],
  }
}

export function labHandout(
  tasks: string[],
  opts?: { deliverables?: string[]; selfCheck?: string[]; timeEstimate?: string },
): NonNullable<CourseWork['handout']> {
  return {
    timeEstimate: opts?.timeEstimate ?? '30–60 min',
    tasks,
    deliverables: opts?.deliverables ?? [
      'Short lab report (≤1 page): method, observations, claim',
      'Screenshot or step notes from the instrument (optional)',
    ],
    selfCheck: opts?.selfCheck ?? [
      'Compared algorithms/structures on identical inputs where required',
      'Separated measurement from asymptotic proof',
      'Cited the instrument + textbook chapter',
    ],
  }
}
