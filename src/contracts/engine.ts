import type { SortStep } from './steps'

export type EngineListener = (state: EngineSnapshot) => void

export interface EngineSnapshot {
  array: number[]
  steps: readonly SortStep[]
  index: number
  playing: boolean
  speed: number
  statusText: string
  compare: [number, number] | null
  marks: { sorted: Set<number>; pivot: Set<number>; active: Set<number> }
}

export interface IStepEngine {
  load(array: number[], steps: SortStep[]): void
  play(): void
  pause(): void
  step(): void
  reset(): void
  setSpeed(multiplier: number): void
  subscribe(listener: EngineListener): () => void
  getSnapshot(): EngineSnapshot
}
