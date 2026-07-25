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
import { countStepStats, formatStats } from '../core/stepStats'
import { Visualizer2D } from '../viz/visualizer2d'
import { labBridge } from '../lab/labBridge'
import { pyodideBridge } from '../lab/pyodideBridge'
import { templateFor } from '../lab/templates'
import { sortingContent } from '../content/lessons'

export type LabCleanup = () => void

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 40))
}

function algoOptions(selected: string, exclude?: string): string {
  return sortingAlgorithms
    .filter((a) => a.id !== exclude)
    .map(
      (a) =>
        `<option value="${a.id}" ${a.id === selected ? 'selected' : ''}>${a.label}</option>`,
    )
    .join('')
}

export function mountSortingLab(root: HTMLElement): LabCleanup {
  let algoId = sortingAlgorithms[0]!.id
  let algoBId =
    sortingAlgorithms.find((a) => a.id !== algoId)?.id ?? sortingAlgorithms[0]!.id
  let size = ARRAY_SIZE_DEFAULT
  let data = randomArray(size)
  const engineA = new StepEngine()
  const engineB = new StepEngine()
  let editor: EditorView | null = null
  let vizA: Visualizer2D | null = null
  let vizB: Visualizer2D | null = null
  let mode: 'reference' | 'python' = 'reference'
  let compareMode = false

  root.innerHTML = `
  <div class="ide" id="ide-root">
    <aside class="ide-rail" aria-label="Lab navigation">
      <a class="mark" href="${AppRoutes.home}" title="Home">CS</a>
      <a class="rail-link" href="${AppRoutes.home}">Home</a>
      <a class="rail-link" href="${AppRoutes.learn}">Learn</a>
      <a class="rail-link" href="${AppRoutes.sorting}" aria-current="page">Sort</a>
    </aside>
    <div class="ide-top">
      <div class="algo-tabs" role="tablist" aria-label="Primary algorithm">
        ${sortingAlgorithms
          .map(
            (a) =>
              `<button type="button" role="tab" data-algo="${a.id}" aria-selected="${a.id === algoId}">${a.label}</button>`,
          )
          .join('')}
      </div>
      <label class="muted compare-only" style="font-size:0.85rem;display:none;" id="vs-label">
        vs
        <select id="algo-b" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;">
          ${algoOptions(algoBId, algoId)}
        </select>
      </label>
      <label class="muted" style="font-size:0.85rem;">
        n
        <input id="arr-size" type="number" min="4" max="64" value="${size}" style="width:3.5rem;margin-left:0.25rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.25rem;" />
      </label>
      <button type="button" class="btn" id="btn-shuffle">Shuffle</button>
      <button type="button" class="btn" id="btn-compare" aria-pressed="false" title="Compare two algorithms on the same array">Compare</button>
      <div class="spacer"></div>
      <label class="muted single-only" style="font-size:0.85rem;">
        Mode
        <select id="run-mode" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;">
          <option value="reference">Reference (TS)</option>
          <option value="python">Python lab</option>
        </select>
      </label>
      <button type="button" class="btn btn-primary" id="btn-run">Run</button>
    </div>
    <div class="ide-main" id="ide-main">
      <section class="ide-pane single-only" aria-label="Code editor" id="pane-editor">
        <div class="pane-label">Editor · Python template</div>
        <div class="editor-host" id="editor"></div>
        <div class="concept" id="concept"></div>
      </section>
      <section class="ide-pane" aria-label="Visualization A" id="pane-viz-a">
        <div class="pane-label" id="label-a">Visualizer · 2D</div>
        <div class="viz-wrap">
          <canvas class="viz-canvas" id="viz-a" role="img" aria-label="Sorting visualization A"></canvas>
          <div class="viz-status" id="viz-status-a" aria-live="polite">Ready.</div>
          <div class="viz-stats" id="stats-a" aria-label="Algorithm A stats"></div>
        </div>
      </section>
      <section class="ide-pane compare-only" aria-label="Visualization B" id="pane-viz-b" hidden>
        <div class="pane-label" id="label-b">Visualizer B</div>
        <div class="viz-wrap">
          <canvas class="viz-canvas" id="viz-b" role="img" aria-label="Sorting visualization B"></canvas>
          <div class="viz-status" id="viz-status-b" aria-live="polite">Ready.</div>
          <div class="viz-stats" id="stats-b" aria-label="Algorithm B stats"></div>
        </div>
      </section>
    </div>
    <div class="transport-bar">
      <div class="transport">
        <button type="button" class="btn" id="btn-play">Play both</button>
        <button type="button" class="btn" id="btn-pause">Pause</button>
        <button type="button" class="btn" id="btn-step">Step both</button>
        <button type="button" class="btn" id="btn-reset">Reset</button>
        <label class="muted" style="font-size:0.85rem;align-self:center;">
          Speed
          <input id="speed" type="range" min="0.25" max="4" step="0.25" value="1" />
        </label>
      </div>
      <div class="compare-summary muted" id="compare-summary" hidden></div>
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

  const canvasA = root.querySelector('#viz-a') as HTMLCanvasElement
  const statusA = root.querySelector('#viz-status-a') as HTMLElement
  const canvasB = root.querySelector('#viz-b') as HTMLCanvasElement
  const statusB = root.querySelector('#viz-status-b') as HTMLElement
  const consoleEl = root.querySelector('#console') as HTMLElement
  const conceptEl = root.querySelector('#concept') as HTMLElement
  const statsAEl = root.querySelector('#stats-a') as HTMLElement
  const statsBEl = root.querySelector('#stats-b') as HTMLElement
  const summaryEl = root.querySelector('#compare-summary') as HTMLElement
  const paneB = root.querySelector('#pane-viz-b') as HTMLElement
  const ideMain = root.querySelector('#ide-main') as HTMLElement
  const compareBtn = root.querySelector('#btn-compare') as HTMLButtonElement
  const algoBSelect = root.querySelector('#algo-b') as HTMLSelectElement
  const playBtn = root.querySelector('#btn-play') as HTMLButtonElement

  vizA = new Visualizer2D(canvasA, statusA)
  vizA.bind(engineA)
  vizB = new Visualizer2D(canvasB, statusB)
  vizB.bind(engineB)

  function logConsole(html: string): void {
    consoleEl.innerHTML = html
  }

  function updateConcept(): void {
    const algo = getAlgorithm(algoId)!
    const note = sortingContent.perAlgo[algoId]
    conceptEl.innerHTML = `<strong>${algo.label}</strong> · ${note?.complexity ?? algo.complexity}<br/>${note?.idea ?? ''}<br/><span class="muted">${sortingContent.intro.slice(0, 160)}…</span>`
  }

  function setStats(
    el: HTMLElement,
    algo: ISortingAlgorithm,
    steps: ReturnType<ISortingAlgorithm['generateSteps']>,
  ): void {
    const s = countStepStats(steps)
    el.innerHTML = `<strong>${algo.label}</strong> · ${formatStats(s)} · ${algo.complexity}`
  }

  function updateCompareSummary(
    a: ISortingAlgorithm,
    stepsA: ReturnType<ISortingAlgorithm['generateSteps']>,
    b: ISortingAlgorithm,
    stepsB: ReturnType<ISortingAlgorithm['generateSteps']>,
  ): void {
    const sa = countStepStats(stepsA)
    const sb = countStepStats(stepsB)
    const cmpWinner =
      sa.compares === sb.compares
        ? 'same compare count'
        : sa.compares < sb.compares
          ? `${a.label} fewer compares (${sa.compares} vs ${sb.compares})`
          : `${b.label} fewer compares (${sb.compares} vs ${sa.compares})`
    const stepWinner =
      sa.total === sb.total
        ? 'same step count'
        : sa.total < sb.total
          ? `${a.label} fewer total steps`
          : `${b.label} fewer total steps`
    summaryEl.innerHTML = `<strong>Same array n=${data.length}</strong> · ${cmpWinner} · ${stepWinner}`
  }

  function loadReferenceSingle(): void {
    const algo = getAlgorithm(algoId) as ISortingAlgorithm
    const steps = algo.generateSteps(data)
    engineA.load(data, steps)
    engineB.load(data, [])
    setStats(statsAEl, algo, steps)
    statsBEl.textContent = ''
    summaryEl.hidden = true
    logConsole(`Reference · ${algo.label} · ${formatStats(countStepStats(steps))} · n=${data.length}`)
  }

  function loadCompare(): void {
    if (algoBId === algoId) {
      const alt = sortingAlgorithms.find((a) => a.id !== algoId)
      if (alt) algoBId = alt.id
      algoBSelect.value = algoBId
    }
    const a = getAlgorithm(algoId) as ISortingAlgorithm
    const b = getAlgorithm(algoBId) as ISortingAlgorithm
    const stepsA = a.generateSteps(data)
    const stepsB = b.generateSteps(data)
    engineA.load(data, stepsA)
    engineB.load(data, stepsB)
    setStats(statsAEl, a, stepsA)
    setStats(statsBEl, b, stepsB)
    updateCompareSummary(a, stepsA, b, stepsB)
    summaryEl.hidden = false
    ;(root.querySelector('#label-a') as HTMLElement).textContent = `A · ${a.label}`
    ;(root.querySelector('#label-b') as HTMLElement).textContent = `B · ${b.label}`
    logConsole(
      `Compare · ${a.label} (${formatStats(countStepStats(stepsA))}) vs ${b.label} (${formatStats(countStepStats(stepsB))}) · same n=${data.length}`,
    )
  }

  function applyLayout(): void {
    const ide = root.querySelector('#ide-root') as HTMLElement
    ide.classList.toggle('is-compare', compareMode)
    paneB.hidden = !compareMode
    summaryEl.hidden = !compareMode
    root.querySelectorAll('.compare-only').forEach((el) => {
      ;(el as HTMLElement).style.display = compareMode ? '' : 'none'
    })
    root.querySelectorAll('.single-only').forEach((el) => {
      ;(el as HTMLElement).style.display = compareMode ? 'none' : ''
    })
    ideMain.classList.toggle('compare-layout', compareMode)
    compareBtn.setAttribute('aria-pressed', String(compareMode))
    compareBtn.classList.toggle('btn-primary', compareMode)
    playBtn.textContent = compareMode ? 'Play both' : 'Play'
    root.querySelector('#btn-step')!.textContent = compareMode ? 'Step both' : 'Step'
    ;(root.querySelector('#label-a') as HTMLElement).textContent = compareMode
      ? `A · ${getAlgorithm(algoId)?.label ?? 'A'}`
      : 'Visualizer · 2D'

    // Refresh algo B options excluding A
    algoBSelect.innerHTML = algoOptions(algoBId, algoId)
    if (algoBSelect.value !== algoBId) {
      algoBId = algoBSelect.value || algoBId
    }

    if (compareMode) {
      mode = 'reference'
      loadCompare()
      requestAnimationFrame(() => {
        vizA?.redraw()
        vizB?.redraw()
      })
    } else {
      loadReferenceSingle()
      requestAnimationFrame(() => vizA?.redraw())
    }
  }

  updateConcept()
  applyLayout()

  const onAlgo = (e: Event) => {
    const btn = (e.target as HTMLElement).closest('button[data-algo]') as HTMLButtonElement | null
    if (!btn) return
    algoId = btn.dataset.algo!
    root.querySelectorAll('.algo-tabs button').forEach((b) => {
      b.setAttribute('aria-selected', String((b as HTMLElement).dataset.algo === algoId))
    })
    updateConcept()
    setEditorDoc(templateFor(algoId))
    if (compareMode) {
      if (algoBId === algoId) {
        const alt = sortingAlgorithms.find((a) => a.id !== algoId)
        if (alt) algoBId = alt.id
      }
      algoBSelect.innerHTML = algoOptions(algoBId, algoId)
      loadCompare()
    } else if (mode === 'reference') {
      loadReferenceSingle()
    }
  }
  root.querySelector('.algo-tabs')!.addEventListener('click', onAlgo)

  algoBSelect.addEventListener('change', () => {
    algoBId = algoBSelect.value
    if (compareMode) loadCompare()
  })

  compareBtn.addEventListener('click', () => {
    compareMode = !compareMode
    applyLayout()
  })

  root.querySelector('#btn-shuffle')!.addEventListener('click', () => {
    size = clampArraySize(Number((root.querySelector('#arr-size') as HTMLInputElement).value))
    ;(root.querySelector('#arr-size') as HTMLInputElement).value = String(size)
    data = randomArray(size)
    if (compareMode) loadCompare()
    else if (mode === 'reference') loadReferenceSingle()
    else {
      engineA.load(data, [])
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

  root.querySelector('#btn-play')!.addEventListener('click', () => {
    engineA.play()
    if (compareMode) engineB.play()
  })
  root.querySelector('#btn-pause')!.addEventListener('click', () => {
    engineA.pause()
    engineB.pause()
  })
  root.querySelector('#btn-step')!.addEventListener('click', () => {
    engineA.step()
    if (compareMode) engineB.step()
  })
  root.querySelector('#btn-reset')!.addEventListener('click', () => {
    engineA.reset()
    if (compareMode) engineB.reset()
  })
  root.querySelector('#speed')!.addEventListener('input', (e) => {
    const v = Number((e.target as HTMLInputElement).value)
    engineA.setSpeed(v)
    engineB.setSpeed(v)
  })

  const runBtn = root.querySelector('#btn-run') as HTMLButtonElement
  runBtn.addEventListener('click', async () => {
    if (compareMode) {
      loadCompare()
      engineA.play()
      engineB.play()
      return
    }
    if (mode === 'reference') {
      loadReferenceSingle()
      engineA.play()
      return
    }
    runBtn.disabled = true
    logConsole(
      pyodideBridge.isReady()
        ? 'Running Python…'
        : 'Loading Python runtime (first time may take a bit)…',
    )
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
      engineA.load(data, result.steps)
      const algo = getAlgorithm(algoId)!
      setStats(statsAEl, algo, result.steps)
      const logs = result.logs.map((l) => escapeHtml(l)).join('<br/>')
      logConsole(
        `Python · ${formatStats(countStepStats(result.steps))}` + (logs ? `<br/>${logs}` : ''),
      )
      engineA.play()
    } finally {
      runBtn.disabled = false
    }
  })

  const onResize = () => {
    vizA?.redraw()
    vizB?.redraw()
  }
  window.addEventListener('resize', onResize)

  return () => {
    window.removeEventListener('resize', onResize)
    vizA?.destroy()
    vizB?.destroy()
    editor?.destroy()
    engineA.pause()
    engineB.pause()
    root.innerHTML = ''
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
