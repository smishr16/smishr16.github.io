import type { SystemsFrame } from '../contracts/systems'
import type { IPlaybackEngine, PlaybackSnapshot } from '../contracts/playback'

export class SystemsVisualizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private statusEl: HTMLElement
  private metricsEl: HTMLElement | null
  private panelEl: HTMLElement | null
  private unsub: (() => void) | null = null
  private last: SystemsFrame | null = null
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

  bind(engine: IPlaybackEngine<SystemsFrame>): void {
    this.unsub?.()
    this.unsub = engine.subscribe((s) => this.onSnap(s))
  }

  destroy(): void {
    this.ro?.disconnect()
    this.unsub?.()
  }

  private onSnap(snap: PlaybackSnapshot<SystemsFrame>): void {
    this.statusEl.textContent = snap.statusText
    if (!snap.frame) return
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

  private css(name: string, fb: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb
  }

  private setup(): { w: number; h: number } {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = this.canvas.getBoundingClientRect()
    const w = Math.max(Math.floor(rect.width), 1)
    const h = Math.max(Math.floor(rect.height), 1)
    this.canvas.width = Math.floor(w * dpr)
    this.canvas.height = Math.floor(h * dpr)
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.ctx.fillStyle = this.css('--bg-panel', '#0d1117')
    this.ctx.fillRect(0, 0, w, h)
    return { w, h }
  }

  private draw(frame: SystemsFrame): void {
    const { w, h } = this.setup()
    const ctx = this.ctx
    ctx.fillStyle = this.css('--text-muted', '#8b949e')
    ctx.font = '600 13px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(frame.title, 12, 18)

    if (frame.kind === 'gantt') this.drawGantt(frame, w, h)
    else if (frame.kind === 'frames') this.drawPages(frame, w, h)
    else if (frame.kind === 'cache') this.drawCache(frame, w, h)
    else if (frame.kind === 'stack') this.drawStack(frame, w, h)
    else if (frame.kind === 'tree') this.drawTree(frame, w, h)
    else this.drawProcess(frame, w, h)
  }

  private drawCache(frame: SystemsFrame, w: number, h: number): void {
    const ctx = this.ctx
    const lines = frame.cacheLines ?? []
    const n = Math.max(lines.length, 1)
    const boxW = Math.min(120, (w - 48) / n - 10)
    const boxH = 56
    const y = h * 0.38
    lines.forEach((line, i) => {
      const x = 28 + i * (boxW + 12)
      let fill = this.css('--bg-elevated', '#21262d')
      if (line.role === 'hit') fill = '#34d399'
      if (line.role === 'miss') fill = '#60a5fa'
      ctx.fillStyle = fill
      ctx.strokeStyle = this.css('--text', '#e8eef6')
      ctx.lineWidth = 1.5
      ctx.fillRect(x, y, boxW, boxH)
      ctx.strokeRect(x, y, boxW, boxH)
      ctx.fillStyle = this.css('--text', '#e8eef6')
      ctx.font = '600 14px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(line.tag == null ? '·' : `tag ${line.tag}`, x + boxW / 2, y + boxH / 2 + 5)
      ctx.font = '11px ui-sans-serif'
      ctx.fillStyle = this.css('--text-muted', '#a8b4c4')
      ctx.fillText(`line ${i}`, x + boxW / 2, y + boxH + 16)
    })
  }

  private drawStack(frame: SystemsFrame, w: number, h: number): void {
    const ctx = this.ctx
    const stack = frame.stackFrames ?? []
    const boxW = Math.min(220, w * 0.45)
    const boxH = 36
    const x = (w - boxW) / 2
    const baseY = h - 48
    if (!stack.length) {
      ctx.fillStyle = this.css('--text-muted', '#a8b4c4')
      ctx.font = '14px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Stack empty', w / 2, h / 2)
      return
    }
    stack.forEach((fr, i) => {
      const y = baseY - (i + 1) * (boxH + 8)
      let fill = this.css('--bg-elevated', '#21262d')
      if (fr.role === 'active') fill = this.css('--info', '#60a5fa')
      if (fr.role === 'return') fill = this.css('--warning', '#fbbf24')
      ctx.fillStyle = fill
      ctx.strokeStyle = this.css('--border-strong', '#35465c')
      ctx.fillRect(x, y, boxW, boxH)
      ctx.strokeRect(x, y, boxW, boxH)
      ctx.fillStyle = this.css('--text', '#e8eef6')
      ctx.font = '600 13px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(fr.label, x + boxW / 2, y + boxH / 2 + 4)
    })
    ctx.fillStyle = this.css('--text-faint', '#7a8799')
    ctx.font = '11px ui-sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('↑ higher addresses (conceptual)', w / 2, baseY + 18)
  }

  private drawTree(frame: SystemsFrame, w: number, h: number): void {
    const ctx = this.ctx
    const nodes = frame.treeNodes ?? []
    const edges = frame.treeEdges ?? []
    const pad = 40
    const pos = new Map<string, { x: number; y: number }>()
    for (const n of nodes) {
      pos.set(n.id, { x: pad + n.x * (w - pad * 2), y: pad + n.y * (h - pad * 2) })
    }
    for (const e of edges) {
      const a = pos.get(e.from)
      const b = pos.get(e.to)
      if (!a || !b) continue
      ctx.strokeStyle = this.css('--border-strong', '#35465c')
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
    for (const n of nodes) {
      const p = pos.get(n.id)!
      let fill = this.css('--bg-elevated', '#21262d')
      if (n.role === 'active') fill = this.css('--info', '#60a5fa')
      if (n.role === 'path') fill = this.css('--accent', '#5eead4')
      if (n.role === 'done') fill = this.css('--success', '#34d399')
      ctx.beginPath()
      ctx.fillStyle = fill
      ctx.strokeStyle = this.css('--text', '#e8eef6')
      ctx.lineWidth = 1.5
      ctx.arc(p.x, p.y, 22, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = this.css('--text', '#e8eef6')
      ctx.font = '600 11px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.value ? `${n.label.split(' ')[0]}:${n.value}` : n.label, p.x, p.y)
    }
  }

  private jobColor(id: string): string {
    const palette = ['#58a6ff', '#3fb950', '#d29922', '#a371f7', '#f778ba', '#79c0ff']
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) % palette.length
    return palette[h]!
  }

  private drawGantt(frame: SystemsFrame, w: number, h: number): void {
    const ctx = this.ctx
    const slices = frame.slices ?? []
    const maxT = Math.max(1, ...slices.map((s) => s.end), 1)
    const padL = 48
    const padR = 16
    const top = 48
    const barH = 36
    const usable = w - padL - padR

    // axis
    ctx.strokeStyle = this.css('--border', '#30363d')
    ctx.beginPath()
    ctx.moveTo(padL, top + barH + 8)
    ctx.lineTo(padL + usable, top + barH + 8)
    ctx.stroke()

    for (const s of slices) {
      const x = padL + (s.start / maxT) * usable
      const width = Math.max(4, ((s.end - s.start) / maxT) * usable)
      ctx.fillStyle = this.jobColor(s.jobId)
      ctx.globalAlpha = s.active ? 1 : 0.75
      ctx.fillRect(x, top, width - 1, barH)
      ctx.globalAlpha = 1
      if (s.active) {
        ctx.strokeStyle = this.css('--text', '#e6edf3')
        ctx.lineWidth = 2
        ctx.strokeRect(x, top, width - 1, barH)
      }
      ctx.fillStyle = '#0d1117'
      ctx.font = '600 12px ui-sans-serif'
      ctx.textAlign = 'center'
      if (width > 24) ctx.fillText(s.jobId, x + width / 2, top + barH / 2 + 4)
    }

    ctx.fillStyle = this.css('--text-muted', '#8b949e')
    ctx.font = '11px ui-sans-serif'
    ctx.textAlign = 'center'
    for (let t = 0; t <= maxT; t++) {
      const x = padL + (t / maxT) * usable
      ctx.fillText(String(t), x, top + barH + 24)
    }

    // legend
    const jobs = frame.jobs ?? []
    jobs.forEach((j, i) => {
      const x = padL + i * 90
      const y = h - 28
      ctx.fillStyle = this.jobColor(j.id)
      ctx.fillRect(x, y, 12, 12)
      ctx.fillStyle = this.css('--text', '#e6edf3')
      ctx.textAlign = 'left'
      ctx.font = '12px ui-sans-serif'
      ctx.fillText(`${j.id} b=${j.burst}`, x + 16, y + 11)
    })
  }

  private drawPages(frame: SystemsFrame, w: number, h: number): void {
    const ctx = this.ctx
    const slots = frame.framesSlots ?? []
    const n = Math.max(slots.length, 1)
    const boxW = Math.min(100, (w - 40) / n - 12)
    const boxH = 70
    const y = h * 0.35
    slots.forEach((s, i) => {
      const x = 30 + i * (boxW + 16)
      let fill = this.css('--bg-elevated', '#21262d')
      if (s.role === 'hit') fill = '#3fb950'
      if (s.role === 'miss') fill = '#58a6ff'
      if (s.role === 'victim') fill = '#d29922'
      ctx.fillStyle = fill
      ctx.strokeStyle = this.css('--text', '#e6edf3')
      ctx.lineWidth = 1.5
      ctx.fillRect(x, y, boxW, boxH)
      ctx.strokeRect(x, y, boxW, boxH)
      ctx.fillStyle = this.css('--text', '#e6edf3')
      ctx.font = '600 20px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(s.page == null ? '·' : String(s.page), x + boxW / 2, y + boxH / 2 + 7)
      ctx.font = '11px ui-sans-serif'
      ctx.fillStyle = this.css('--text-muted', '#8b949e')
      ctx.fillText(`frame ${i}`, x + boxW / 2, y + boxH + 16)
    })

    const refs = frame.refString ?? []
    ctx.textAlign = 'left'
    ctx.fillStyle = this.css('--text-muted', '#8b949e')
    ctx.font = '13px ui-monospace, monospace'
    ctx.fillText(
      'refs: ' +
        refs
          .map((r, i) => (i === frame.refIndex ? `[${r}]` : `${r}`))
          .join(' '),
      30,
      y + boxH + 48,
    )
  }

  private drawProcess(frame: SystemsFrame, w: number, h: number): void {
    const ctx = this.ctx
    const states = ['new', 'ready', 'running', 'blocked', 'terminated'] as const
    const positions: Record<string, { x: number; y: number }> = {
      new: { x: 0.12, y: 0.35 },
      ready: { x: 0.35, y: 0.35 },
      running: { x: 0.58, y: 0.35 },
      blocked: { x: 0.58, y: 0.7 },
      terminated: { x: 0.85, y: 0.35 },
    }
    // boxes
    for (const st of states) {
      const p = positions[st]!
      const x = p.x * w - 40
      const y = p.y * h - 22
      ctx.fillStyle = this.css('--bg-elevated', '#21262d')
      ctx.strokeStyle = this.css('--border', '#30363d')
      ctx.fillRect(x, y, 80, 44)
      ctx.strokeRect(x, y, 80, 44)
      ctx.fillStyle = this.css('--text-muted', '#8b949e')
      ctx.font = '11px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(st, x + 40, y + 26)
    }
    // processes
    const procs = frame.processes ?? []
    procs.forEach((pr, i) => {
      const p = positions[pr.state] ?? positions.ready!
      const x = p.x * w - 20 + i * 8
      const y = p.y * h - 50
      ctx.beginPath()
      ctx.fillStyle = pr.role === 'active' ? this.css('--viz-active', '#58a6ff') : this.css('--accent', '#3fb950')
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#0d1117'
      ctx.font = '600 11px ui-sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(pr.id, x, y + 4)
    })
  }
}
