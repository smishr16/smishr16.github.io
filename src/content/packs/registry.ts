import type { MeatPack } from './types'
import { meatToHandout } from './types'
import { algorithmsMeat } from './algorithms-meat'
import { dataStructuresMeat } from './ds-meat'
import { systemsOsMeat } from './systems-os-meat'
import { discreteMeat, theoryMeat, aiMeat, mlMeat } from './math-ai-ml-meat'
import { databasesMeat, networksMeat, plMeat, seMeat, labMeat } from './other-meat'
import type { CourseWork } from '../../contracts'

const all: MeatPack[] = [
  ...algorithmsMeat,
  ...dataStructuresMeat,
  ...systemsOsMeat,
  ...discreteMeat,
  ...theoryMeat,
  ...aiMeat,
  ...mlMeat,
  ...databasesMeat,
  ...networksMeat,
  ...plMeat,
  ...seMeat,
  ...labMeat,
]

const byId = new Map<string, MeatPack>(all.map((p) => [p.workId, p]))

export function getMeatPack(workId: string): MeatPack | undefined {
  return byId.get(workId)
}

export function applyMeatPack(work: CourseWork): CourseWork {
  const pack = byId.get(work.id)
  if (!pack) return work
  return {
    ...work,
    handout: meatToHandout(pack),
    sources: pack.sources?.length ? pack.sources : work.sources,
  }
}

export function meatPackCount(): number {
  return byId.size
}

export function allMeatWorkIds(): string[] {
  return [...byId.keys()]
}
