/** Systems / OS instrument contracts. */

export type SystemsDemoId =
  | 'schedule-fcfs'
  | 'schedule-sjf'
  | 'schedule-rr'
  | 'page-fifo'
  | 'page-lru'
  | 'process-lifecycle'
  | 'cache-direct'
  | 'stack-calls'
  | 'minimax-tree'

export type SystemsJob = {
  id: string
  arrival: number
  burst: number
  color?: string
}

export type SystemsFrame = {
  statusText: string
  title: string
  kind: 'gantt' | 'frames' | 'process' | 'stack' | 'cache' | 'tree'
  metrics?: string
  slices?: { jobId: string; start: number; end: number; active?: boolean }[]
  jobs?: SystemsJob[]
  framesSlots?: { page: number | null; role?: 'hit' | 'miss' | 'victim' | 'default' }[]
  refString?: number[]
  refIndex?: number
  processes?: { id: string; state: 'new' | 'ready' | 'running' | 'blocked' | 'terminated'; role?: string }[]
  /** Call stack frames bottom→top */
  stackFrames?: { label: string; role?: 'active' | 'return' | 'default' }[]
  /** Direct-mapped cache lines */
  cacheLines?: { tag: string | null; role?: 'hit' | 'miss' | 'default' }[]
  /** Game / decision tree */
  treeNodes?: { id: string; label: string; x: number; y: number; role?: string; value?: string }[]
  treeEdges?: { from: string; to: string }[]
  panels?: { title: string; lines: string[] }[]
}

export interface ISystemsDemo {
  id: SystemsDemoId
  label: string
  description: string
  category: 'scheduling' | 'memory' | 'process' | 'cpu' | 'ai'
  generate(): SystemsFrame[]
}
