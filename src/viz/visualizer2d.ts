import type { EngineSnapshot, IStepEngine } from '../contracts'

/**
 * Polished 2D bar visualizer — density-aware bar sizing, baseline,
 * soft active glow. Designed to look intentional at 360–1920px widths.
 */
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

  redraw(): void {
    if (this.last) this.render(this.last)
  }

  destroy(): void {
    this.unsub?.()
    this.unsub = null
    this.last = null
  }

  private cssVar(name: string, fallback: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  }

  private render(snap: EngineSnapshot): void {
    this.last = snap
    this.statusEl.textContent = snap.statusText

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssW = Math.max(this.canvas.clientWidth || 280, 120)
    const cssH = Math.max(this.canvas.clientHeight || 140, 96)
    const bw = Math.floor(cssW * dpr)
    const bh = Math.floor(cssH * dpr)
    if (this.canvas.width !== bw || this.canvas.height !== bh) {
      this.canvas.width = bw
      this.canvas.height = bh
    }
    const ctx = this.ctx
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssW, cssH)

    // Panel background wash
    const bg = this.cssVar('--bg-panel', '#0d1117')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, cssW, cssH)

    const n = snap.array.length
    if (n === 0) return

    const padX = Math.max(10, Math.min(20, cssW * 0.04))
    const padTop = 10
    const padBottom = 18
    const plotW = cssW - padX * 2
    const plotH = cssH - padTop - padBottom
    const baseY = padTop + plotH

    // Subtle baseline
    ctx.strokeStyle = this.cssVar('--border', '#1e2a38')
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padX, baseY + 0.5)
    ctx.lineTo(padX + plotW, baseY + 0.5)
    ctx.stroke()

    const max = Math.max(...snap.array, 1)
    // Density-aware: more elements → thinner bars, still capped
    const gap = n > 32 ? 1.5 : n > 20 ? 2 : 3
    const maxBarW = cssW < 360 ? 10 : cssW < 520 ? 12 : 16
    const minBarW = 2
    const raw = (plotW - gap * (n - 1)) / n
    const barW = Math.max(minBarW, Math.min(maxBarW, raw))
    const groupW = n * barW + (n - 1) * gap
    const originX = padX + Math.max(0, (plotW - groupW) / 2)

    const colDefault = this.cssVar('--bar', '#3d8bfd')
    const colSorted = this.cssVar('--bar-sorted', '#2f8f7a')
    const colCompare = this.cssVar('--bar-compare', '#f0b429')
    const colActive = this.cssVar('--accent', '#7dd3c0')

    for (let i = 0; i < n; i++) {
      const v = snap.array[i]!
      const h = Math.max(2, (v / max) * (plotH - 4))
      const x = originX + i * (barW + gap)
      const y = baseY - h

      let fill = colDefault
      let glow: string | null = null
      if (snap.marks.sorted.has(i)) fill = colSorted
      if (snap.compare && (snap.compare[0] === i || snap.compare[1] === i)) {
        fill = colCompare
        glow = 'rgba(240, 180, 41, 0.35)'
      } else if (snap.marks.active.has(i)) {
        fill = colActive
        glow = 'rgba(125, 211, 192, 0.3)'
      }

      if (glow && !this.reducedMotion) {
        ctx.shadowColor = glow
        ctx.shadowBlur = 10
      } else {
        ctx.shadowBlur = 0
      }

      // Vertical gradient for depth
      const grad = ctx.createLinearGradient(x, y, x, baseY)
      grad.addColorStop(0, fill)
      grad.addColorStop(1, this.shade(fill, -0.22))
      ctx.fillStyle = grad

      const r = this.reducedMotion || barW < 4 ? 0 : Math.min(3, barW / 2)
      this.roundTop(x, y, barW, h, r)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }

  private shade(hex: string, amount: number): string {
    // amount -1..1 darken/lighten; supports #rgb and #rrggbb
    const h = hex.replace('#', '')
    const full =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h
    if (full.length !== 6) return hex
    const n = parseInt(full, 16)
    const r = Math.min(255, Math.max(0, ((n >> 16) & 255) * (1 + amount)))
    const g = Math.min(255, Math.max(0, ((n >> 8) & 255) * (1 + amount)))
    const b = Math.min(255, Math.max(0, (n & 255) * (1 + amount)))
    return `rgb(${r | 0},${g | 0},${b | 0})`
  }

  private roundTop(x: number, y: number, w: number, h: number, r: number): void {
    const ctx = this.ctx
    ctx.beginPath()
    if (r <= 0 || h < r * 2) {
      ctx.rect(x, y, w, h)
      return
    }
    ctx.moveTo(x, y + h)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h)
    ctx.closePath()
  }
}
