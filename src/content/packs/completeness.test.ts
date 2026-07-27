/**
 * Factory completeness gate (Wave 4 exit).
 * Every work item has curated meat; every module has ≥4 lecture beats.
 */
import { describe, expect, it } from 'vitest'
import { listMissingMeat, listModulesMissingBeats } from './listMissing'
import { meatPackCount } from './registry'

describe('meat factory completeness', () => {
  it('100% meat coverage — zero missing work ids', () => {
    const missing = listMissingMeat()
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        meatPackCount: meatPackCount(),
        missingCount: missing.length,
        modulesMissingBeats: listModulesMissingBeats().length,
      }),
    )
    expect(missing, `still missing: ${missing.map((m) => m.workId).join(', ')}`).toHaveLength(0)
    expect(listModulesMissingBeats()).toHaveLength(0)
    expect(meatPackCount()).toBeGreaterThanOrEqual(120)
  })

  it('every live lab has meat', () => {
    const missingLabs = listMissingMeat().filter((r) => r.hasConfig && r.labId)
    expect(missingLabs).toHaveLength(0)
  })
})
