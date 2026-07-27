/** Lightweight local progress — best-effort, no accounts. */

const KEY = 'csvl-progress-v1'

type ProgressMap = Record<string, { doneWorkIds: string[]; updatedAt: string }>

function read(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ProgressMap
  } catch {
    return {}
  }
}

function write(map: ProgressMap): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(map))
  } catch {
    /* ignore quota */
  }
}

export function getDoneWork(courseId: string): Set<string> {
  const m = read()
  return new Set(m[courseId]?.doneWorkIds ?? [])
}

export function toggleWorkDone(courseId: string, workId: string): boolean {
  const map = read()
  const cur = new Set(map[courseId]?.doneWorkIds ?? [])
  if (cur.has(workId)) cur.delete(workId)
  else cur.add(workId)
  map[courseId] = { doneWorkIds: [...cur], updatedAt: new Date().toISOString() }
  write(map)
  return cur.has(workId)
}

export function progressCounts(courseId: string, totalWork: number): { done: number; total: number } {
  const done = getDoneWork(courseId).size
  return { done, total: totalWork }
}

export function bindCourseProgress(courseId: string, root: ParentNode = document): void {
  const done = getDoneWork(courseId)
  const summary = root.querySelector<HTMLElement>('[data-progress-summary]')
  const total = root.querySelectorAll<HTMLInputElement>('[data-progress-work]').length

  const refreshSummary = () => {
    if (!summary) return
    const n = getDoneWork(courseId).size
    summary.textContent = `${n} / ${total} marked done (local only)`
  }

  root.querySelectorAll<HTMLInputElement>('[data-progress-work]').forEach((el) => {
    const id = el.dataset.progressWork
    if (!id) return
    el.checked = done.has(id)
    el.addEventListener('change', () => {
      toggleWorkDone(courseId, id)
      refreshSummary()
    })
  })
  refreshSummary()
}
