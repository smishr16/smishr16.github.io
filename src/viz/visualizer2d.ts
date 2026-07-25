import type { EngineSnapshot, IStepEngine } from '../contracts'

export class Visualizer2D {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private statusEl: HTMLElement
  private unsub: (() => void) | null = null
  private reducedMotion: boolean
  private last: EngineSnapshot | null = null

  constructor(canvas: HTMLCanvasElement, statusEl: HTMLElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D unavailable')
    this.canvas = canvas
    this.ctx = ctx
    this.statusEl = statusEl
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  bind(engine: IStepEngine): void {
    this.unsub?.()
    this.unsub = engine.subscribe((snap) => this.render(snap))
  }

  /** Redraw last frame (e.g. window resize) without resetting the engine. */
  redraw(): void {
    if (this.last) this.render(this.last)
  }

  destroy(): void {
    this.unsub?.()
    this.unsub = null
    this.last = null
  }

  private render(snap: EngineSnapshot): void {
    this.last = snap
    this.statusEl.textContent = snap.statusText
    const { width, height } = this.canvas
    const dpr = window.devicePixelRatio || 1
    const cssW = this.canvas.clientWidth || width
    const cssH = this.canvas.clientHeight || height
    if (this.canvas.width !== Math.floor(cssW * dpr) || this.canvas.height !== Math.floor(cssH * dpr)) {
      this.canvas.width = Math.floor(cssW * dpr)
      this.canvas.height = Math.floor(cssH * dpr)
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.ctx.clearRect(0, 0, cssW, cssH)

    const n = snap.array.length
    if (n === 0) return
    const max = Math.max(...snap.array, 1)
    const gap = 4
    const barW = (cssW - gap * (n + 1)) / n
    const base = cssH - 16

    for (let i = 0; i < n; i++) {
      const v = snap.array[i]!
      const h = (v / max) * (base - 12)
      const x = gap + i * (barW + gap)
      const y = base - h

      let fill = getComputedStyle(document.documentElement).getPropertyValue('--bar').trim() || '#3d8bfd'
      if (snap.marks.sorted.has(i)) {
        fill = getComputedStyle(document.documentElement).getPropertyValue('--bar-sorted').trim() || '#2a6b5e'
      }
      if (snap.compare && (snap.compare[0] === i || snap.compare[1] === i)) {
        fill = getComputedStyle(document.documentElement).getPropertyValue('--bar-compare').trim() || '#f0b429'
      } else if (snap.marks.active.has(i)) {
        fill = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7dd3c0'
      }

      this.ctx.fillStyle = fill
      const radius = this.reducedMotion ? 0 : 3
      this.roundRect(x, y, Math.max(barW, 1), h, radius)
      this.ctx.fill()
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx
    ctx.beginPath()
    if (r <= 0 || h < r) {
      ctx.rect(x, y, w, h)
      return
    }
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, 0)
    ctx.arcTo(x, y + h, x, y, 0)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }
}
