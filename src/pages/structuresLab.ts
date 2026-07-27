import { AppRoutes } from '../contracts'
import type { CourseWork } from '../contracts'
import type { StructureFrame } from '../contracts/structures'
import { PlaybackEngine } from '../core/playbackEngine'
import {
  DEFAULT_STRUCTURE_VALUES,
  getStructureDemo,
  structureDemos,
} from '../core/structures/demos'
import { StructureVisualizer } from '../viz/structureVisualizer'
import {
  runStructurePython,
  structurePythonMode,
  templateForStructure,
} from '../lab/structurePython'

export type LabCleanup = () => void

export interface StructuresLabOptions {
  context: 'visualizer' | 'assignment'
  assignment?: CourseWork
  courseTitle?: string
  moduleTitle?: string
  config?: {
    structureDemo?: string
    values?: number[]
    runMode?: 'reference' | 'python'
  }
}

export function mountStructuresLab(
  root: HTMLElement,
  options: StructuresLabOptions = { context: 'visualizer' },
): LabCleanup {
  const cfg = options.config ?? {}
  let demoId = cfg.structureDemo ?? 'bst-insert'
  let values = (cfg.values?.length ? cfg.values : DEFAULT_STRUCTURE_VALUES).slice()
  let mode: 'reference' | 'python' = cfg.runMode ?? 'reference'

  const engine = new PlaybackEngine<StructureFrame>()
  let viz: StructureVisualizer | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let editor: any = null

  const isAssignment = options.context === 'assignment' && options.assignment
  const banner = isAssignment
    ? `<div class="assignment-banner" role="region" aria-label="Coursework">
        <div>
          <p class="eyebrow">${options.courseTitle ?? 'Course'}${
            options.moduleTitle ? ` · ${options.moduleTitle}` : ''
          }</p>
          <strong>${options.assignment!.title}</strong>
          <p class="muted"><strong>Objective.</strong> ${options.assignment!.objective}</p>
          <p class="muted">${options.assignment!.brief}</p>
        </div>
        <div class="assignment-banner-actions">
          <a class="btn" href="${AppRoutes.course('data-structures')}">Data Structures</a>
          <a class="btn" href="${AppRoutes.labStructures}">Dismiss to free lab</a>
        </div>
      </div>`
    : `<div class="lab-context-bar">
        <span class="muted">Lab · Data structures visualizer</span>
        <span class="muted">·</span>
        <a href="${AppRoutes.lab}">All labs</a>
        <span class="muted">·</span>
        <a href="${AppRoutes.course('data-structures')}">Data Structures course</a>
      </div>`

  root.innerHTML = `
  <div class="ide" id="ide-root">
    <aside class="ide-rail" aria-label="Lab navigation">
      <a class="mark" href="${AppRoutes.home}" title="Home">CS</a>
      <a class="rail-link" href="${AppRoutes.home}">Home</a>
      <a class="rail-link" href="${AppRoutes.learn}">Learn</a>
      <a class="rail-link" href="${AppRoutes.lab}" aria-current="page">Lab</a>
    </aside>
    <div class="ide-column">
      ${banner}
      <div class="ide-top">
        <div class="algo-tabs" role="tablist" aria-label="Structure demo">
          ${structureDemos
            .map(
              (d) =>
                `<button type="button" role="tab" data-demo="${d.id}" aria-selected="${d.id === demoId}">${d.label}</button>`,
            )
            .join('')}
        </div>
        <label class="muted" style="font-size:0.85rem;">
          Values
          <input id="values" type="text" value="${values.join(',')}" style="width:11rem;margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;" title="Comma-separated integers" />
        </label>
        <button type="button" class="btn" id="btn-shuffle">Randomize</button>
        <label class="muted" style="font-size:0.85rem;">
          Mode
          <select id="run-mode" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;">
            <option value="reference" ${mode === 'reference' ? 'selected' : ''}>Reference (TS)</option>
            <option value="python" ${mode === 'python' ? 'selected' : ''}>Python lab</option>
          </select>
        </label>
        <div class="spacer"></div>
        <button type="button" class="btn btn-primary" id="btn-run">Run</button>
      </div>
      <div class="ide-main" id="ide-main">
        <section class="ide-pane editor-pane" aria-label="Notes and panels" id="pane-editor">
          <div class="pane-label"><span class="pane-title" id="pane-title">Notes</span></div>
          <div class="editor-body">
            <div class="editor-host" id="editor" hidden></div>
            <div class="concept" id="concept"></div>
            <div id="panels" class="struct-panels"></div>
          </div>
        </section>
        <div class="viz-stage" id="viz-stage">
          <section class="viz-pane" aria-label="Structure visualization">
            <div class="pane-label"><span class="pane-title">Structure · 2D</span></div>
            <div class="viz-wrap">
              <canvas class="viz-canvas" id="viz" role="img" aria-label="Data structure visualization"></canvas>
              <div class="lab-empty-hint" id="empty-hint">Press <strong>Run</strong> to build the structure, then Play / Step.</div>
              <div class="viz-status" id="viz-status" aria-live="polite">Ready.</div>
              <div class="viz-stats" id="stats"></div>
              <div class="viz-legend" aria-hidden="true">
                <span class="lg-active">focus</span>
                <span class="lg-path">new / path</span>
                <span class="lg-default">nodes</span>
              </div>
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
            Speed
            <input id="speed" type="range" min="0.25" max="4" step="0.25" value="1" />
          </label>
        </div>
      </div>
      <div class="ide-console" id="console" aria-live="polite">Console ready.</div>
    </div>
  </div>
  `

  const conceptEl = root.querySelector('#concept') as HTMLElement
  const consoleEl = root.querySelector('#console') as HTMLElement
  const valuesInput = root.querySelector('#values') as HTMLInputElement
  const modeSel = root.querySelector('#run-mode') as HTMLSelectElement
  const canvas = root.querySelector('#viz') as HTMLCanvasElement
  const statusEl = root.querySelector('#viz-status') as HTMLElement
  const statsEl = root.querySelector('#stats') as HTMLElement
  const panelsEl = root.querySelector('#panels') as HTMLElement
  const editorHost = root.querySelector('#editor') as HTMLElement
  const paneTitle = root.querySelector('#pane-title') as HTMLElement

  function parseValues(): number[] {
    const parts = valuesInput.value
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n))
    return parts.length ? parts.slice(0, 16) : DEFAULT_STRUCTURE_VALUES.slice()
  }

  function updateConcept(): void {
    const d = getStructureDemo(demoId)
    conceptEl.innerHTML = `<strong>${d.label}</strong><br/>${d.description}<br/>
      <span class="muted">Reference = TS demo. Python mode: list append, BST insert, heap insert, and hash chaining hooks.</span>`
  }

  async function ensureEditor(): Promise<void> {
    if (editor) return
    const { EditorView, basicSetup } = await import('codemirror')
    const { python } = await import('@codemirror/lang-python')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    editorHost.hidden = false
    editor = new EditorView({
      doc: templateForStructure(demoId),
      extensions: [basicSetup, python(), oneDark, EditorView.lineWrapping],
      parent: editorHost,
    })
  }

  function setEditorDoc(text: string): void {
    if (!editor) return
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: text },
    })
  }

  async function syncModeUi(): Promise<void> {
    if (mode === 'python') {
      paneTitle.textContent = 'Editor · Python'
      editorHost.hidden = false
      await ensureEditor()
      setEditorDoc(templateForStructure(demoId))
    } else {
      paneTitle.textContent = 'Notes'
      editorHost.hidden = true
    }
    updateConcept()
  }

  async function run(): Promise<void> {
    values = parseValues()
    valuesInput.value = values.join(',')
    const demo = getStructureDemo(demoId)

    if (mode === 'python') {
      await ensureEditor()
      const code = editor?.state.doc.toString() ?? templateForStructure(demoId)
      consoleEl.textContent = 'Loading Pyodide / running Python…'
      const pyMode = structurePythonMode(demoId)
      const result = await runStructurePython(code, values, pyMode)
      if (result.error) {
        consoleEl.textContent = `Error: ${result.error}`
        if (result.frames.length) engine.load(result.frames)
        return
      }
      engine.load(result.frames)
      statsEl.textContent = `Python · ${demo.label} · ${result.frames.length} frames`
      consoleEl.textContent = `Python OK · ${result.logs.slice(-3).join(' · ') || 'done'}`
      return
    }

    const frames = demo.generate(values)
    engine.load(frames)
    const empty = root.querySelector('#empty-hint') as HTMLElement | null
    if (empty) empty.hidden = true
    statsEl.textContent = `${demo.label} · ${frames.length} frames · n≈${values.length}`
    consoleEl.textContent = `Reference · ${demo.label} on [${values.join(', ')}]`
    updateConcept()
  }

  viz = new StructureVisualizer(canvas, statusEl, statsEl, panelsEl)
  viz.bind(engine)
  updateConcept()

  root.querySelectorAll('[data-demo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      demoId = (btn as HTMLElement).dataset.demo!
      root.querySelectorAll('[data-demo]').forEach((b) => {
        b.setAttribute('aria-selected', String((b as HTMLElement).dataset.demo === demoId))
      })
      void syncModeUi().then(() => run())
    })
  })

  modeSel.addEventListener('change', () => {
    mode = modeSel.value as 'reference' | 'python'
    void syncModeUi().then(() => run())
  })

  root.querySelector('#btn-run')!.addEventListener('click', () => void run())
  root.querySelector('#btn-shuffle')!.addEventListener('click', () => {
    values = Array.from({ length: 6 }, () => 1 + Math.floor(Math.random() * 20))
    valuesInput.value = values.join(',')
    void run()
  })
  root.querySelector('#btn-play')!.addEventListener('click', () => engine.play())
  root.querySelector('#btn-pause')!.addEventListener('click', () => engine.pause())
  root.querySelector('#btn-step')!.addEventListener('click', () => engine.step())
  root.querySelector('#btn-reset')!.addEventListener('click', () => engine.reset())
  root.querySelector('#speed')!.addEventListener('input', (e) => {
    engine.setSpeed(Number((e.target as HTMLInputElement).value))
  })

  void syncModeUi().then(() => run())

  return () => {
    engine.pause()
    viz?.destroy()
    editor?.destroy?.()
    viz = null
    editor = null
    root.innerHTML = ''
  }
}
