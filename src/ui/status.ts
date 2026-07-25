import type { ContentStatus } from '../contracts'

/** Single status vocabulary for the whole product. */
export function statusLabel(status: ContentStatus | string): string {
  if (status === 'live') return 'Live'
  if (status === 'partial') return 'Partial'
  return 'Soon'
}

export function statusBadgeClass(status: ContentStatus | string): string {
  if (status === 'live') return 'badge badge-live'
  if (status === 'partial') return 'badge badge-partial'
  return 'badge'
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
