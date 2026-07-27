import type { ContentStatus } from '../contracts'

/**
 * Product vocabulary:
 * - live: substantial interactive labs (≥4 openable for courses)
 * - partial: some interactive labs (1–3)
 * - soon: syllabus-only (enterable outline, no instruments yet)
 */
export function statusLabel(status: ContentStatus | string): string {
  if (status === 'live') return 'Live'
  if (status === 'partial') return 'Partial'
  return 'Syllabus' // was "Soon" — honest for full outlines without labs
}

export function statusBadgeClass(status: ContentStatus | string): string {
  if (status === 'live') return 'badge badge-live'
  if (status === 'partial') return 'badge badge-partial'
  return 'badge badge-syllabus'
}

export function statusBadgeHtml(status: ContentStatus | string): string {
  return `<span class="${statusBadgeClass(status)}">${statusLabel(status)}</span>`
}

export function levelLabel(level: string, style: 'short' | 'long' = 'long'): string {
  if (level === 'undergraduate+graduate') {
    return style === 'short' ? 'UG · Grad' : 'Undergraduate · Graduate extensions'
  }
  if (level === 'graduate') return style === 'short' ? 'Grad' : 'Graduate'
  return style === 'short' ? 'UG' : 'Undergraduate'
}

export function courseStatusHint(status: ContentStatus | string, liveLabCount: number): string {
  if (status === 'live') return `${liveLabCount} live labs · full syllabus`
  if (status === 'partial') return `${liveLabCount} live lab${liveLabCount === 1 ? '' : 's'} · syllabus + instruments`
  return 'Full syllabus · paper-first (no course instrument yet)'
}
