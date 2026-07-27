import { AppRoutes } from '../contracts'
import type { CourseWork } from '../contracts'
import type { MlFrame } from '../contracts/ml'
import { PlaybackEngine } from '../core/playbackEngine'
import { getMlDemo, mlDemos } from '../core/ml/demos'
import { MlVisualizer } from '../viz/mlVisualizer'

export type LabCleanup = () => void

export interface MlLabOptions {
  context: 'visualizer' | 'assignment'
  assignment?: CourseWork
  courseTitle?: string
  moduleTitle?: string
  config?: { mlDemo?: string }
}

export function mountMlLab(root: HTMLElement, options: MlLabOptions = { context: 'visualizer' }): LabCleanup {
  const cfg = options.config ?? {}
  let demoId = cfg.mlDemo ?? 'decision-boundary'
  const engine = new PlaybackEngine<MlFrame>()
  let viz: MlVisualizer | null = null

  const isAssignment = options.context === 'assignment' && options.assignment
  const banner = isAssignment
    ? `<div class="assignment-banner"><div>
        <p class="eyebrow">${options.courseTitle ?? 'Course'}${options.moduleTitle ? ` · ${options.moduleTitle}` : ''}</p>
        <strong>${options.assignment!.title}</strong>
        <p class="muted"><strong>Objective.</strong> ${options.assignment!.objective}</p>
        <p class="muted">${options.assignment!.brief}</p>
      </div>
      <div class="assignment-banner-actions">
        <a class="btn" href="${AppRoutes.course('machine-learning')}">Machine Learning</a>
        <a class="btn" href="${AppRoutes.labMl}">Free lab</a>
      </div></div>`
    : `<div class="lab-context-bar">
        <span class="muted">Lab · ML playground (toy, client-side)</span>
        <a href="${AppRoutes.lab}">All labs</a>
        <a href="${AppRoutes.course('machine-learning')}">ML course</a>
      </div>`

  root.innerHTML = `
  <div class="ide">
    <aside class="ide-rail" aria-label="Lab navigation">
      <a class="mark" href="${AppRoutes.home}">CS</a>
      <a class="rail-link" href="${AppRoutes.home}">Home</a>
      <a class="rail-link" href="${AppRoutes.learn}">Learn</a>
      <a class="rail-link" href="${AppRoutes.lab}" aria-current="page">Lab</a>
    </aside>
    <div class="ide-column">
      ${banner}
      <div class="ide-top">
        <div class="algo-tabs" role="tablist" aria-label="ML demo">
          ${mlDemos
            .map(
              (d) =>
                `<button type="button" role="tab" data-demo="${d.id}" aria-selected="${d.id === demoId}">${d.label}</button>`,
            )
            .join('')}
        </div>
        <div class="spacer"></div>
        <button type="button" class="btn btn-primary" id="btn-run">Run</button>
      </div>
      <div class="ide-main">
        <section class="ide-pane editor-pane">
          <div class="pane-label"><span class="pane-title">Notes</span></div>
          <div class="editor-body">
            <div class="concept" id="concept"></div>
            <div id="panels" class="struct-panels"></div>
          </div>
        </section>
        <div class="viz-stage">
          <section class="viz-pane">
            <div class="pane-label"><span class="pane-title">ML · toy</span></div>
            <div class="viz-wrap">
              <canvas class="viz-canvas" id="viz" role="img" aria-label="ML visualization"></canvas>
              <div class="viz-status" id="viz-status" aria-live="polite">Ready.</div>
              <div class="viz-stats" id="stats"></div>
            </div>
          </section>
        </div>
      </div>
      <div class="transport-bar">
        <div class="transport">
          <button type="button" class="btn" id="btn-play">Play</button>
          <button type="button" class="btn" id="btn-pause">Pause</button>
          <button type="button" class="btn" id="btn-step">Step</button>
          <button type="button" class="btn" id="btn-reset">Reset</button>
          <label class="muted" style="font-size:0.85rem;align-self:center;">
            Speed <input id="speed" type="range" min="0.25" max="4" step="0.25" value="1" />
          </label>
        </div>
      </div>
      <div class="ide-console" id="console">Console ready.</div>
    </div>
  </div>`

  const conceptEl = root.querySelector('#concept') as HTMLElement
  const consoleEl = root.querySelector('#console') as HTMLElement
  const canvas = root.querySelector('#viz') as HTMLCanvasElement
  const statusEl = root.querySelector('#viz-status') as HTMLElement
  const statsEl = root.querySelector('#stats') as HTMLElement
  const panelsEl = root.querySelector('#panels') as HTMLElement

  function run(): void {
    try {
      const demo = getMlDemo(demoId)
      const frames = demo.generate()
      engine.load(frames)
      conceptEl.innerHTML = `<strong>${demo.label}</strong><br/>${demo.description}<br/>
        <span class="muted">Client-side toy — not GPU training. Expectation-setting: rigorous intuition, not production ML.</span>`
      statsEl.textContent = `${demo.label} · ${frames.length} frames`
      consoleEl.textContent = `Loaded ${demo.label}`
    } catch (e) {
      consoleEl.textContent = e instanceof Error ? e.message : String(e)
    }
  }

  viz = new MlVisualizer(canvas, statusEl, statsEl, panelsEl)
  viz.bind(engine)
  root.querySelectorAll('[data-demo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      demoId = (btn as HTMLElement).dataset.demo!
      root.querySelectorAll('[data-demo]').forEach((b) => {
        b.setAttribute('aria-selected', String((b as HTMLElement).dataset.demo === demoId))
      })
      run()
    })
  })
  root.querySelector('#btn-run')!.addEventListener('click', () => run())
  root.querySelector('#btn-play')!.addEventListener('click', () => engine.play())
  root.querySelector('#btn-pause')!.addEventListener('click', () => engine.pause())
  root.querySelector('#btn-step')!.addEventListener('click', () => engine.step())
  root.querySelector('#btn-reset')!.addEventListener('click', () => engine.reset())
  root.querySelector('#speed')!.addEventListener('input', (e) => {
    engine.setSpeed(Number((e.target as HTMLInputElement).value))
  })
  run()
  return () => {
    engine.pause()
    viz?.destroy()
    root.innerHTML = ''
  }
}
