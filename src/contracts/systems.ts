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
  | 'dfa-even0'
  | 'dfa-ends01'
  | 'cfg-anbn'
  | 'pda-anbn'
  | 'tm-anbn'
  | 'sliding-window'
  | 'tcp-aimd'
  | 'gbn-loss'
  | 'dfa-mod3'
  | 'hash-join'
  | 'join-compare'
  | 'pl-small-step'
  | 'pl-type-stlc'
  | 'csp-ac'
  | 'nl-join'
  | 'env-lookup'
  | 'network-path'
  | 'pl-eval-tree'

/** Optional runtime knobs for interactive systems demos. */
export type SystemsDemoOpts = {
  /** Binary/string input for automata demos */
  input?: string
  /** GBN window size */
  windowSize?: number
  /** Seq number that is lost (GBN) */
  lossSeq?: number
}

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
  /** When true, systems lab shows an input field (default string = opts.input or built-in). */
  acceptsInput?: boolean
  generate(opts?: SystemsDemoOpts): SystemsFrame[]
}
