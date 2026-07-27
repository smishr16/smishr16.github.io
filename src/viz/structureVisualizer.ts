import type { StructureFrame } from '../contracts/structures'
import type { IPlaybackEngine, PlaybackSnapshot } from '../contracts/playback'

export class StructureVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private statusEl: HTMLElement
  private metricsEl: HTMLElement | null
  private panelEl: HTMLElement | null
  private unsub: (() => void) | null = null
  private last: StructureFrame | null = null
  private ro: ResizeObserver | null = null

  constructor(
    canvas: HTMLCanvasElement,
    statusEl: HTMLElement,
    metricsEl?: HTMLElement | null,
    panelEl?: HTMLElement | null,
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D unavailable')
    this.canvas = canvas
    this.ctx = ctx
    this.statusEl = statusEl
    this.metricsEl = metricsEl ?? null
    this.panelEl = panelEl ?? null
    this.ro = new ResizeObserver(() => {
      if (this.last) this.draw(this.last)
    })
    this.ro.observe(this.canvas)
  }

  bind(engine: IPlaybackEngine<StructureFrame>): void {
    this.unsub?.()
    this.unsub = engine.subscribe((snap) => this.onSnap(snap))
  }

  destroy(): void {
    this.ro?.disconnect()
    this.unsub?.()
    this.ro = null
    this.unsub = null
  }

  private onSnap(snap: PlaybackSnapshot<StructureFrame>): void {
    this.statusEl.textContent = snap.statusText
    if (snap.frame) {
      this.last = snap.frame
      if (this.metricsEl) this.metricsEl.textContent = snap.frame.metrics ?? ''
      if (this.panelEl) {
        this.panelEl.innerHTML = (snap.frame.panels ?? [])
          .map(
            (p) =>
              `<div class="struct-panel"><h4 class="subhead">${p.title}</h4><pre>${p.lines.join('\n')}</pre></div>`,
          )
          .join('')
      }
      this.draw(snap.frame)
    }
  }

  private cssVar(name: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  }

  private roleColor(role?: string): string {
    switch (role) {
      case 'new':
        return this.cssVar('--accent', '#3fb950')
      case 'active':
        return this.cssVar('--viz-active', '#58a6ff')
      case 'found':
        return this.cssVar('--amber', '#d29922')
      case 'path':
        return '#a371f7'
      case 'pivot':
        return '#f778ba'
      default:
        return this.cssVar('--bg-elevated', '#21262d')
    }
  }

  private draw(frame: StructureFrame): void {
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

    ctx.fillStyle = this.cssVar('--text-muted', '#8b949e')
    ctx.font = '600 13px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(frame.title, 12, 18)

    const pad = 36
    const pos = new Map<string, { x: number; y: number }>()
    for (const n of frame.nodes) {
      pos.set(n.id, {
        x: pad + n.x * (cssW - pad * 2),
        y: pad + n.y * (cssH - pad * 2),
      })
    }

    for (const e of frame.edges) {
      const a = pos.get(e.from)
      const b = pos.get(e.to)
      if (!a || !b) continue
      ctx.strokeStyle = this.cssVar('--border', '#30363d')
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }

    const r = frame.kind === 'list' ? Math.max(16, Math.min(26, cssW / 30)) : Math.max(14, Math.min(22, cssW / 36))
    for (const n of frame.nodes) {
      const p = pos.get(n.id)!
      ctx.beginPath()
      ctx.fillStyle = this.roleColor(n.role)
      ctx.strokeStyle = this.cssVar('--text', '#e6edf3')
      ctx.lineWidth = 1.5
      if (frame.kind === 'list' || frame.kind === 'hash' || frame.kind === 'bplus') {
        const rw = r * 2
        const rh = r * 1.4
        ctx.fillRect(p.x - r, p.y - rh / 2, rw, rh)
        ctx.strokeRect(p.x - r, p.y - rh / 2, rw, rh)
      } else {
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      ctx.fillStyle = this.cssVar('--text', '#e6edf3')
      ctx.font = `600 ${Math.max(11, r * 0.7)}px ui-sans-serif, system-ui`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.label, p.x, p.y)
    }

    if (!frame.nodes.length) {
      ctx.fillStyle = this.cssVar('--text-muted', '#8b949e')
      ctx.font = '14px ui-sans-serif, system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Empty structure — press Run', cssW / 2, cssH / 2)
    }
  }
}
