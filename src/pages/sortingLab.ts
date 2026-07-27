import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  ARRAY_SIZE_DEFAULT,
  AppRoutes,
  clampArraySize,
  type AssignmentConfig,
  type CourseWork,
  type ISortingAlgorithm,
} from '../contracts'
import { sortingAlgorithms, getAlgorithm } from '../core/algorithms'
import { StepEngine } from '../core/stepEngine'
import { countStepStats, formatStats } from '../core/stepStats'
import { Visualizer2D } from '../viz/visualizer2d'
import { labBridge } from '../lab/labBridge'
import { pyodideBridge } from '../lab/pyodideBridge'
import { templateFor } from '../lab/templates'
import { sortingContent } from '../content/sortingContent'

export type LabCleanup = () => void

export interface SortingLabOptions {
  /** Free visualizer vs course coursework */
  context: 'visualizer' | 'assignment'
  assignment?: CourseWork
  courseTitle?: string
  moduleTitle?: string
  config?: AssignmentConfig
}

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

export function mountSortingLab(root: HTMLElement, options: SortingLabOptions = { context: 'visualizer' }): LabCleanup {
  const cfg = options.config ?? {}
  let algoId = cfg.algoId ?? sortingAlgorithms[0]!.id
  let algoBId =
    cfg.algoBId ??
    sortingAlgorithms.find((a) => a.id !== algoId)?.id ??
    sortingAlgorithms[0]!.id
  let size = clampArraySize(cfg.arraySize ?? ARRAY_SIZE_DEFAULT)
  let data = cfg.fixedArray?.slice() ?? randomArray(size)
  if (cfg.fixedArray) size = cfg.fixedArray.length

  const engineA = new StepEngine()
  const engineB = new StepEngine()
  let editor: EditorView | null = null
  let vizA: Visualizer2D | null = null
  let vizB: Visualizer2D | null = null
  let mode: 'reference' | 'python' = cfg.runMode ?? 'reference'
  let compareMode = Boolean(cfg.compare)
  /** Code pane collapsed — default collapsed in compare for chart space */
  let codeCollapsed = compareMode
  const isAssignment = options.context === 'assignment' && options.assignment

  const assignmentBanner = isAssignment
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
          <a class="btn" href="${AppRoutes.course('algorithms')}">Back to Algorithms</a>
          <a class="btn" href="${AppRoutes.labSorting}">Dismiss to free lab</a>
        </div>
      </div>`
    : `<div class="lab-context-bar">
        <span class="muted">Lab · Sorting visualizer (free exploration)</span>
        <span class="muted">·</span>
        <a href="${AppRoutes.lab}">All labs</a>
        <span class="muted">·</span>
        <a href="${AppRoutes.course('algorithms')}">Algorithms course</a>
        <span class="muted">· M3 Sorting unit</span>
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
      ${assignmentBanner}
      <div class="ide-top">
        <div class="algo-tabs" role="tablist" aria-label="Primary algorithm">
          ${sortingAlgorithms
            .map(
              (a) =>
                `<button type="button" role="tab" data-algo="${a.id}" aria-selected="${a.id === algoId}">${a.label}</button>`,
            )
            .join('')}
        </div>
        <label class="muted compare-only" id="vs-label" ${compareMode ? '' : 'hidden'}>
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
        <button type="button" class="btn" id="btn-compare" aria-pressed="${compareMode}" title="Compare two algorithms on the same array">Compare</button>
        <div class="spacer"></div>
        <label class="muted single-only" style="font-size:0.85rem;" ${compareMode ? 'hidden' : ''}>
          Mode
          <select id="run-mode" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;">
            <option value="reference" ${mode === 'reference' ? 'selected' : ''}>Reference (TS)</option>
            <option value="python" ${mode === 'python' ? 'selected' : ''}>Python lab</option>
          </select>
        </label>
        <button type="button" class="btn" id="btn-toggle-code-top" title="Collapse or expand the code pane">Code</button>
        <button type="button" class="btn btn-primary" id="btn-run">Run</button>
      </div>
      <div class="ide-main ${compareMode ? 'compare-layout' : ''} ${codeCollapsed ? 'code-collapsed' : ''}" id="ide-main">
        <section class="ide-pane editor-pane ${codeCollapsed ? 'editor-collapsed' : ''}" aria-label="Code editor" id="pane-editor">
          <div class="pane-label">
            <span class="pane-title">Editor · Python</span>
            <button type="button" class="btn-pane-toggle" id="btn-toggle-code" aria-expanded="${!codeCollapsed}" aria-controls="editor-body">
              ${codeCollapsed ? 'Expand' : 'Collapse'}
            </button>
          </div>
          <div class="editor-body" id="editor-body">
            <div class="editor-host" id="editor"></div>
            <div class="concept" id="concept"></div>
          </div>
        </section>
        <div class="viz-stage" id="viz-stage">
          <section class="viz-pane" aria-label="Visualization A" id="pane-viz-a">
            <div class="pane-label"><span class="pane-title" id="label-a">Visualizer · 2D</span></div>
            <div class="viz-wrap">
              <canvas class="viz-canvas" id="viz-a" role="img" aria-label="Sorting visualization A"></canvas>
              <div class="lab-empty-hint" id="empty-a">Press <strong>Run</strong> to generate frames, then Play / Step.</div>
              <div class="viz-status" id="viz-status-a" aria-live="polite">Ready.</div>
              <div class="viz-stats" id="stats-a" aria-label="Algorithm A stats"></div>
              <div class="viz-legend" aria-hidden="true">
                <span class="lg-default">bars</span>
                <span class="lg-compare">compare</span>
                <span class="lg-active">active</span>
                <span class="lg-sorted">sorted</span>
              </div>
            </div>
          </section>
          <section class="viz-pane compare-only" aria-label="Visualization B" id="pane-viz-b" ${compareMode ? '' : 'hidden'}>
            <div class="pane-label"><span class="pane-title" id="label-b">Visualizer B</span></div>
            <div class="viz-wrap">
              <canvas class="viz-canvas" id="viz-b" role="img" aria-label="Sorting visualization B"></canvas>
              <div class="lab-empty-hint" id="empty-b">Compare pane — Run both sides.</div>
              <div class="viz-status" id="viz-status-b" aria-live="polite">Ready.</div>
              <div class="viz-stats" id="stats-b" aria-label="Algorithm B stats"></div>
              <div class="viz-legend" aria-hidden="true">
                <span class="lg-default">bars</span>
                <span class="lg-compare">compare</span>
                <span class="lg-active">active</span>
                <span class="lg-sorted">sorted</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="transport-bar">
        <div class="transport">
          <button type="button" class="btn" id="btn-play">${compareMode ? 'Play both' : 'Play'}</button>
          <button type="button" class="btn" id="btn-pause">Pause</button>
          <button type="button" class="btn" id="btn-step">${compareMode ? 'Step both' : 'Step'}</button>
          <button type="button" class="btn" id="btn-reset">Reset</button>
          <label class="muted" style="font-size:0.85rem;align-self:center;">
            Speed
            <input id="speed" type="range" min="0.25" max="4" step="0.25" value="1" />
          </label>
        </div>
        <div class="compare-summary muted" id="compare-summary" ${compareMode ? '' : 'hidden'}></div>
      </div>
      <div class="ide-console" id="console" aria-live="polite" aria-label="Console">Console ready.</div>
    </div>
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
  const paneEditor = root.querySelector('#pane-editor') as HTMLElement
  const ideMain = root.querySelector('#ide-main') as HTMLElement
  const compareBtn = root.querySelector('#btn-compare') as HTMLButtonElement
  const algoBSelect = root.querySelector('#algo-b') as HTMLSelectElement
  const vsLabel = root.querySelector('#vs-label') as HTMLElement
  const runModeLabel = root.querySelector('label.single-only') as HTMLElement | null
  const playBtn = root.querySelector('#btn-play') as HTMLButtonElement
  const stepBtn = root.querySelector('#btn-step') as HTMLButtonElement
  const toggleCodeBtn = root.querySelector('#btn-toggle-code') as HTMLButtonElement
  const toggleCodeTop = root.querySelector('#btn-toggle-code-top') as HTMLButtonElement

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

  function hideEmptyHints(): void {
    const a = root.querySelector('#empty-a') as HTMLElement | null
    const b = root.querySelector('#empty-b') as HTMLElement | null
    if (a) a.hidden = true
    if (b) b.hidden = true
  }

  function loadReferenceSingle(): void {
    const algo = getAlgorithm(algoId) as ISortingAlgorithm
    const steps = algo.generateSteps(data)
    engineA.load(data, steps)
    engineB.load(data, [])
    setStats(statsAEl, algo, steps)
    statsBEl.textContent = ''
    summaryEl.hidden = true
    hideEmptyHints()
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
    hideEmptyHints()
    ;(root.querySelector('#label-a') as HTMLElement).textContent = `A · ${a.label}`
    ;(root.querySelector('#label-b') as HTMLElement).textContent = `B · ${b.label}`
    logConsole(
      `Compare · ${a.label} (${formatStats(countStepStats(stepsA))}) vs ${b.label} (${formatStats(countStepStats(stepsB))}) · same n=${data.length}`,
    )
  }

  function applyCodeCollapse(): void {
    paneEditor.classList.toggle('editor-collapsed', codeCollapsed)
    ideMain.classList.toggle('code-collapsed', codeCollapsed)
    toggleCodeBtn.setAttribute('aria-expanded', String(!codeCollapsed))
    toggleCodeBtn.textContent = codeCollapsed ? 'Expand' : 'Collapse'
    toggleCodeTop.classList.toggle('btn-active', !codeCollapsed)
    toggleCodeTop.textContent = codeCollapsed ? 'Show code' : 'Hide code'
    requestAnimationFrame(() => {
      vizA?.redraw()
      if (compareMode) vizB?.redraw()
    })
  }

  function applyLayout(): void {
    const ide = root.querySelector('#ide-root') as HTMLElement
    ide.classList.toggle('is-compare', compareMode)
    paneB.hidden = !compareMode
    paneEditor.hidden = false
    summaryEl.hidden = !compareMode
    vsLabel.hidden = !compareMode
    if (runModeLabel) runModeLabel.hidden = compareMode
    ideMain.classList.toggle('compare-layout', compareMode)
    compareBtn.setAttribute('aria-pressed', String(compareMode))
    compareBtn.classList.toggle('btn-active', compareMode)
    playBtn.textContent = compareMode ? 'Play both' : 'Play'
    stepBtn.textContent = compareMode ? 'Step both' : 'Step'
    ;(root.querySelector('#label-a') as HTMLElement).textContent = compareMode
      ? `A · ${getAlgorithm(algoId)?.label ?? 'A'}`
      : 'Visualizer · 2D'

    algoBSelect.innerHTML = algoOptions(algoBId, algoId)
    if (![...algoBSelect.options].some((o) => o.value === algoBId)) {
      algoBId = algoBSelect.value
    } else {
      algoBSelect.value = algoBId
    }

    applyCodeCollapse()

    if (compareMode) {
      mode = 'reference'
      loadCompare()
      requestAnimationFrame(() => {
        vizA?.redraw()
        vizB?.redraw()
      })
    } else {
      if (mode === 'reference') loadReferenceSingle()
      else {
        engineA.load(data, [])
        logConsole('Python mode — edit the template and press Run.')
      }
      requestAnimationFrame(() => vizA?.redraw())
    }
  }

  function toggleCodePane(): void {
    codeCollapsed = !codeCollapsed
    applyCodeCollapse()
  }

  updateConcept()
  applyLayout()

  // Auto-run reference loads for assignment python mode still show template
  if (!compareMode && mode === 'python') {
    setEditorDoc(templateFor(algoId))
    engineA.load(data, [])
    logConsole(
      isAssignment
        ? `Assignment ready · Python mode · n=${data.length}. Implement using compare/swap, then Run.`
        : `Python mode · n=${data.length}. Run when ready.`,
    )
  }

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
    // Free space for side-by-side charts when entering compare
    if (compareMode) codeCollapsed = true
    applyLayout()
  })

  toggleCodeBtn.addEventListener('click', toggleCodePane)
  toggleCodeTop.addEventListener('click', toggleCodePane)

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
