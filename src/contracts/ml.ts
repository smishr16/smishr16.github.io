export type MlDemoId = 'linreg-1d' | 'decision-boundary' | 'kmeans-2d' | 'train-test-curves'

export interface MlFrame {
  statusText: string
  title: string
  kind: 'scatter' | 'bars'
  metrics?: string
  /** 2D points */
  points?: { x: number; y: number; label?: number; role?: 'default' | 'centroid' | 'active' }[]
  /** Line y = m x + b in normalized 0..1 space, or decision line */
  line?: { x1: number; y1: number; x2: number; y2: number }
  panels?: { title: string; lines: string[] }[]
}

export interface IMlDemo {
  id: MlDemoId
  label: string
  description: string
  generate(): MlFrame[]
}
