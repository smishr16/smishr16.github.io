import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  ARRAY_SIZE_DEFAULT,
  AppRoutes,
  clampArraySize,
  type ISortingAlgorithm,
} from '../contracts'
import { sortingAlgorithms, getAlgorithm } from '../core/algorithms'
import { StepEngine } from '../core/stepEngine'
import { Visualizer2D } from '../viz/visualizer2d'
import { labBridge } from '../lab/labBridge'
import { pyodideBridge } from '../lab/pyodideBridge'
import { templateFor } from '../lab/templates'
import { sortingContent } from '../content/lessons'

export type LabCleanup = () => void

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 40))
}

export function mountSortingLab(root: HTMLElement): LabCleanup {
  let algoId = sortingAlgorithms[0]!.id
  let size = ARRAY_SIZE_DEFAULT
  let data = randomArray(size)
  const engine = new StepEngine()
  let editor: EditorView | null = null
  let viz: Visualizer2D | null = null
  let mode: 'reference' | 'python' = 'reference'

  root.innerHTML = `
  <div class="ide">
    <aside class="ide-rail" aria-label="Lab navigation">
      <a class="mark" href="${AppRoutes.home}" title="Home">CS</a>
      <a class="rail-link" href="${AppRoutes.home}">Home</a>
      <a class="rail-link" href="${AppRoutes.learn}">Learn</a>
      <a class="rail-link" href="${AppRoutes.sorting}" aria-current="page">Sort</a>
    </aside>
    <div class="ide-top">
      <div class="algo-tabs" role="tablist" aria-label="Algorithms">
        ${sortingAlgorithms
          .map(
            (a) =>
              `<button type="button" role="tab" data-algo="${a.id}" aria-selected="${a.id === algoId}">${a.label}</button>`,
          )
          .join('')}
      </div>
      <label class="muted" style="font-size:0.85rem;">
        n
        <input id="arr-size" type="number" min="4" max="64" value="${size}" style="width:3.5rem;margin-left:0.25rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.25rem;" />
      </label>
      <button type="button" class="btn" id="btn-shuffle">Shuffle</button>
      <div class="spacer"></div>
      <label class="muted" style="font-size:0.85rem;">
        Mode
        <select id="run-mode" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;">
          <option value="reference">Reference (TS)</option>
          <option value="python">Python lab</option>
        </select>
      </label>
      <button type="button" class="btn btn-primary" id="btn-run">Run</button>
    </div>
    <div class="ide-main">
      <section class="ide-pane" aria-label="Code editor">
        <div class="pane-label">Editor · Python template</div>
        <div class="editor-host" id="editor"></div>
        <div class="concept" id="concept"></div>
      </section>
      <section class="ide-pane" aria-label="Visualization">
        <div class="pane-label">Visualizer · 2D</div>
        <div class="viz-wrap">
          <canvas class="viz-canvas" id="viz" role="img" aria-label="Sorting bar chart"></canvas>
          <div class="viz-status" id="viz-status" aria-live="polite">Ready.</div>
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
      </section>
    </div>
    <div class="ide-console" id="console" aria-live="polite" aria-label="Console">Console ready.</div>
  </div>
  `

  const editorHost = root.querySelector('#editor') as HTMLElement
  editor = new EditorView({
    doc: templateFor(algoId),
    extensions: [basicSetup, python(), oneDark, EditorView.lineWrapping],
    parent: editorHost,
  })

  function setEditorDoc(text: string): void {
    if (!editor) return
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: text },
    })
  }

  const canvas = root.querySelector('#viz') as HTMLCanvasElement
  const statusEl = root.querySelector('#viz-status') as HTMLElement
  const consoleEl = root.querySelector('#console') as HTMLElement
  const conceptEl = root.querySelector('#concept') as HTMLElement

  viz = new Visualizer2D(canvas, statusEl)
  viz.bind(engine)

  function logConsole(html: string): void {
    consoleEl.innerHTML = html
  }

  function updateConcept(): void {
    const algo = getAlgorithm(algoId)!
    const note = sortingContent.perAlgo[algoId]
    conceptEl.innerHTML = `<strong>${algo.label}</strong> · ${note?.complexity ?? algo.complexity}<br/>${note?.idea ?? ''}<br/><span class="muted">${sortingContent.intro.slice(0, 160)}…</span>`
  }

  function loadReference(): void {
    const algo = getAlgorithm(algoId) as ISortingAlgorithm
    const steps = algo.generateSteps(data)
    engine.load(data, steps)
    logConsole(`Reference · ${algo.label} · ${steps.length} steps · n=${data.length}`)
  }

  updateConcept()
  loadReference()

  const onAlgo = (e: Event) => {
    const btn = (e.target as HTMLElement).closest('button[data-algo]') as HTMLButtonElement | null
    if (!btn) return
    algoId = btn.dataset.algo!
    root.querySelectorAll('.algo-tabs button').forEach((b) => {
      b.setAttribute('aria-selected', String((b as HTMLElement).dataset.algo === algoId))
    })
    updateConcept()
    setEditorDoc(templateFor(algoId))
    if (mode === 'reference') loadReference()
  }
  root.querySelector('.algo-tabs')!.addEventListener('click', onAlgo)

  root.querySelector('#btn-shuffle')!.addEventListener('click', () => {
    size = clampArraySize(Number((root.querySelector('#arr-size') as HTMLInputElement).value))
    ;(root.querySelector('#arr-size') as HTMLInputElement).value = String(size)
    data = randomArray(size)
    if (mode === 'reference') loadReference()
    else {
      engine.load(data, [])
      logConsole(`Shuffled n=${size}. Run Python to generate steps.`)
    }
  })

  root.querySelector('#arr-size')!.addEventListener('change', () => {
    size = clampArraySize(Number((root.querySelector('#arr-size') as HTMLInputElement).value))
    ;(root.querySelector('#arr-size') as HTMLInputElement).value = String(size)
  })

  root.querySelector('#run-mode')!.addEventListener('change', (e) => {
    mode = (e.target as HTMLSelectElement).value as 'reference' | 'python'
  })

  root.querySelector('#btn-play')!.addEventListener('click', () => engine.play())
  root.querySelector('#btn-pause')!.addEventListener('click', () => engine.pause())
  root.querySelector('#btn-step')!.addEventListener('click', () => engine.step())
  root.querySelector('#btn-reset')!.addEventListener('click', () => engine.reset())
  root.querySelector('#speed')!.addEventListener('input', (e) => {
    engine.setSpeed(Number((e.target as HTMLInputElement).value))
  })

  const runBtn = root.querySelector('#btn-run') as HTMLButtonElement
  runBtn.addEventListener('click', async () => {
    if (mode === 'reference') {
      loadReference()
      engine.play()
      return
    }
    runBtn.disabled = true
    logConsole(pyodideBridge.isReady() ? 'Running Python…' : 'Loading Python runtime (first time may take a bit)…')
    try {
      const code = editor!.state.doc.toString()
      const result = await labBridge.runPython(code, data)
      if (result.error) {
        logConsole(`<span class="err">Error: ${escapeHtml(result.error)}</span>`)
        if (result.logs.length) {
          logConsole(
            consoleEl.innerHTML +
              '<br/>' +
              result.logs.map((l) => escapeHtml(l)).join('<br/>'),
          )
        }
        return
      }
      engine.load(data, result.steps)
      const logs = result.logs.map((l) => escapeHtml(l)).join('<br/>')
      logConsole(
        `Python · ${result.steps.length} steps` + (logs ? `<br/>${logs}` : ''),
      )
      engine.play()
    } finally {
      runBtn.disabled = false
    }
  })

  const onResize = () => viz?.redraw()
  window.addEventListener('resize', onResize)

  return () => {
    window.removeEventListener('resize', onResize)
    viz?.destroy()
    editor?.destroy()
    engine.pause()
    root.innerHTML = ''
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
