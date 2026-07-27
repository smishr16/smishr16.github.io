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

export function bindCourseProgress(courseId: string, root: ParentNode = document): void {
  const done = getDoneWork(courseId)
  root.querySelectorAll<HTMLInputElement>('[data-progress-work]').forEach((el) => {
    const id = el.dataset.progressWork
    if (!id) return
    el.checked = done.has(id)
    el.addEventListener('change', () => {
      toggleWorkDone(courseId, id)
    })
  })
}
