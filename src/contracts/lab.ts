import type { SortStep } from './steps'

/** Hooks exposed into Python so learner code can drive the viz. */
export interface PythonLabHooks {
  get_array(): number[]
  compare(i: number, j: number): number
  swap(i: number, j: number): void
  log(message: string): void
}

export interface IPyodideBridge {
  load(): Promise<void>
  isReady(): boolean
  /** Run Python source with hooks bound into globals. */
  run(code: string, hooks: PythonLabHooks): Promise<void>
}

export interface LabRunResult {
  steps: SortStep[]
  logs: string[]
  error: string | null
}

export interface ILabBridge {
  createHooks(initial: number[]): {
    hooks: PythonLabHooks
    getSteps(): SortStep[]
    getArray(): number[]
    getLogs(): string[]
  }
  runPython(code: string, initial: number[]): Promise<LabRunResult>
}
