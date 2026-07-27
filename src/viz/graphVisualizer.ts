import type { GraphEdgeRole, GraphFrame, GraphNodeRole } from '../contracts/graph'
import type { PlaybackSnapshot } from '../contracts/playback'
import type { IPlaybackEngine } from '../contracts/playback'

export class GraphVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private statusEl: HTMLElement
  private metricsEl: HTMLElement | null
  private unsub: (() => void) | null = null
  private last: GraphFrame | null = null
  private ro: ResizeObserver | null = null

  constructor(canvas: HTMLCanvasElement, statusEl: HTMLElement, metricsEl?: HTMLElement | null) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D unavailable')
    this.canvas = canvas
    this.ctx = ctx
    this.statusEl = statusEl
    this.metricsEl = metricsEl ?? null
    this.ro = new ResizeObserver(() => {
      if (this.last) this.draw(this.last)
    })
    this.ro.observe(this.canvas)
  }

  bind(engine: IPlaybackEngine<GraphFrame>): void {
    this.unsub?.()
    this.unsub = engine.subscribe((snap) => this.onSnap(snap))
  }

  destroy(): void {
    this.ro?.disconnect()
    this.unsub?.()
    this.ro = null
    this.unsub = null
    this.last = null
  }

  private onSnap(snap: PlaybackSnapshot<GraphFrame>): void {
    this.statusEl.textContent = snap.statusText
    if (snap.frame) {
      this.last = snap.frame
      if (this.metricsEl) this.metricsEl.textContent = snap.frame.metrics ?? ''
      this.draw(snap.frame)
    } else if (this.last) {
      this.draw(this.last)
    } else {
      this.clear()
    }
  }

  private cssVar(name: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  }

  private colorForNode(role: GraphNodeRole): string {
    switch (role) {
      case 'start':
        return this.cssVar('--accent', '#3fb950')
      case 'goal':
        return this.cssVar('--amber', '#d29922')
      case 'current':
        return this.cssVar('--viz-active', '#58a6ff')
      case 'frontier':
        return '#a371f7'
      case 'visited':
        return '#388bfd66'
      case 'path':
        return this.cssVar('--accent', '#3fb950')
      default:
        return this.cssVar('--bg-elevated', '#21262d')
    }
  }

  private colorForEdge(role: GraphEdgeRole | string): string {
    switch (role) {
      case 'path':
        return this.cssVar('--accent', '#3fb950')
      case 'tree':
        return this.cssVar('--viz-active', '#58a6ff')
      case 'explore':
        return this.cssVar('--amber', '#d29922')
      default:
        return this.cssVar('--border', '#30363d')
    }
  }

  private clear(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    const cssW = Math.max(Math.floor(rect.width), 1)
    const cssH = Math.max(Math.floor(rect.height), 1)
    this.canvas.width = Math.floor(cssW * dpr)
    this.canvas.height = Math.floor(cssH * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.ctx.fillStyle = this.cssVar('--bg-panel', '#0d1117')
    this.ctx.fillRect(0, 0, cssW, cssH)
  }

  private draw(frame: GraphFrame): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    const cssW = Math.max(Math.floor(rect.width), 1)
    const cssH = Math.max(Math.floor(rect.height), 1)
    if (cssW < 2 || cssH < 2) return
    this.canvas.width = Math.floor(cssW * dpr)
    this.canvas.height = Math.floor(cssH * dpr)
    const ctx = this.ctx
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = this.cssVar('--bg-panel', '#0d1117')
    ctx.fillRect(0, 0, cssW, cssH)

    const pad = 28
    const pos = new Map<string, { x: number; y: number }>()
    for (const n of frame.nodes) {
      pos.set(n.id, {
        x: pad + n.x * (cssW - pad * 2),
        y: pad + n.y * (cssH - pad * 2),
      })
    }

    // edges
    for (const e of frame.edges) {
      const a = pos.get(e.from)
      const b = pos.get(e.to)
      if (!a || !b) continue
      const role =
        frame.edgeRoles[`${e.from}->${e.to}`] ||
        frame.edgeRoles[`${e.to}->${e.from}`] ||
        'default'
      ctx.strokeStyle = this.colorForEdge(role)
      ctx.lineWidth = role === 'path' || role === 'tree' ? 3 : 1.5
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      if (e.weight != null) {
        ctx.fillStyle = this.cssVar('--text-muted', '#8b949e')
        ctx.font = '12px ui-sans-serif, system-ui'
        ctx.fillText(String(e.weight), (a.x + b.x) / 2 + 4, (a.y + b.y) / 2 - 4)
      }
    }

    // nodes
    const r = Math.max(14, Math.min(22, cssW / 40))
    for (const n of frame.nodes) {
      const p = pos.get(n.id)!
      const role = frame.nodeRoles[n.id] ?? 'default'
      ctx.beginPath()
      ctx.fillStyle = this.colorForNode(role)
      ctx.strokeStyle = this.cssVar('--text', '#e6edf3')
      ctx.lineWidth = 1.5
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = role === 'visited' ? this.cssVar('--text', '#e6edf3') : this.cssVar('--text', '#e6edf3')
      ctx.font = `600 ${Math.max(12, r * 0.75)}px ui-sans-serif, system-ui`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.label, p.x, p.y)
    }
  }
}
