/** Array size clamp for labs (frozen contract). */

export const ARRAY_SIZE_MIN = 4
export const ARRAY_SIZE_MAX = 64
export const ARRAY_SIZE_DEFAULT = 16

export function clampArraySize(n: number): number {
  if (!Number.isFinite(n)) return ARRAY_SIZE_DEFAULT
  return Math.min(ARRAY_SIZE_MAX, Math.max(ARRAY_SIZE_MIN, Math.floor(n)))
}

/** Deterministic fixture for contract tests. */
export const FIXTURE_ARRAY = [3, 1, 2] as const
