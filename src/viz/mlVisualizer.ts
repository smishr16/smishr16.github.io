import type { MlFrame } from '../contracts/ml'
import type { IPlaybackEngine, PlaybackSnapshot } from '../contracts/playback'

export class MlVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private statusEl: HTMLElement
  private metricsEl: HTMLElement | null
  private panelEl: HTMLElement | null
  private unsub: (() => void) | null = null
  private last: MlFrame | null = null
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

  bind(engine: IPlaybackEngine<MlFrame>): void {
    this.unsub?.()
    this.unsub = engine.subscribe((s) => this.onSnap(s))
  }

  destroy(): void {
    this.ro?.disconnect()
    this.unsub?.()
  }

  private css(n: string, fb: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb
  }

  private onSnap(snap: PlaybackSnapshot<MlFrame>): void {
    this.statusEl.textContent = snap.statusText
    if (!snap.frame) return
    this.last = snap.frame
    if (this.metricsEl) this.metricsEl.textContent = snap.frame.metrics ?? ''
    if (this.panelEl) {
      this.panelEl.innerHTML = (snap.frame.panels ?? [])
        .map((p) => `<div class="struct-panel"><h4 class="subhead">${p.title}</h4><pre>${p.lines.join('\n')}</pre></div>`)
        .join('')
    }
    this.draw(snap.frame)
  }

  private draw(frame: MlFrame): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    const w = Math.max(Math.floor(rect.width), 1)
    const h = Math.max(Math.floor(rect.height), 1)
    this.canvas.width = Math.floor(w * dpr)
    this.canvas.height = Math.floor(h * dpr)
    const ctx = this.ctx
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = this.css('--bg-panel', '#0d1117')
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = this.css('--text-muted', '#8b949e')
    ctx.font = '600 13px ui-sans-serif'
    ctx.fillText(frame.title, 12, 18)

    const pad = 36
    const plotW = w - pad * 2
    const plotH = h - pad * 2 - 10

    // axes
    ctx.strokeStyle = this.css('--border', '#30363d')
    ctx.strokeRect(pad, pad + 8, plotW, plotH)

    if (frame.line) {
      ctx.strokeStyle = this.css('--accent', '#7dd3c0')
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(pad + frame.line.x1 * plotW, pad + 8 + (1 - frame.line.y1) * plotH)
      ctx.lineTo(pad + frame.line.x2 * plotW, pad + 8 + (1 - frame.line.y2) * plotH)
      ctx.stroke()
    }

    for (const p of frame.points ?? []) {
      const x = pad + p.x * plotW
      const y = pad + 8 + (1 - p.y) * plotH
      const r = p.role === 'centroid' ? 9 : 6
      if (p.role === 'centroid') {
        ctx.fillStyle = this.css('--warning', '#f0b429')
        ctx.strokeStyle = this.css('--text', '#e6edf3')
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      } else {
        ctx.fillStyle = p.label === 1 ? this.css('--info', '#3d8bfd') : this.css('--accent', '#7dd3c0')
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}
