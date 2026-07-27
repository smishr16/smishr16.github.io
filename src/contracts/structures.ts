/** Data structures instrument contracts. */

export type StructureKind = 'list' | 'bst' | 'heap' | 'hash' | 'bplus'

export type StructureNodeRole = 'default' | 'active' | 'new' | 'found' | 'pivot' | 'path'

export interface StructureDrawNode {
  id: string
  label: string
  x: number
  y: number
  role?: StructureNodeRole
}

export interface StructureDrawEdge {
  from: string
  to: string
  label?: string
}

export interface StructureFrame {
  statusText: string
  kind: StructureKind
  title: string
  nodes: StructureDrawNode[]
  edges: StructureDrawEdge[]
  /** Secondary panels (e.g. hash buckets as text rows) */
  panels?: { title: string; lines: string[] }[]
  metrics?: string
}

export interface IStructureDemo {
  id: string
  kind: StructureKind
  label: string
  description: string
  generate(values: number[]): StructureFrame[]
}
