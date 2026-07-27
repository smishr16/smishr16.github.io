import { AppRoutes } from '../contracts'
import type { GraphAlgoId, GraphFrame } from '../contracts/graph'
import type { CourseWork } from '../contracts'
import { PlaybackEngine } from '../core/playbackEngine'
import { graphAlgorithms, getGraphAlgorithm } from '../core/graph/searchAlgos'
import { getGraphInstance, graphInstances } from '../core/graph/instances'
import { GraphVisualizer } from '../viz/graphVisualizer'
import { runGraphPython, templateForGraphAlgo } from '../lab/graphPython'

export type LabCleanup = () => void

export interface GraphLabOptions {
  context: 'visualizer' | 'assignment'
  assignment?: CourseWork
  courseTitle?: string
  moduleTitle?: string
  config?: {
    graphAlgo?: GraphAlgoId | string
    graphId?: string
    start?: string
    goal?: string
    runMode?: 'reference' | 'python'
  }
}

export function mountGraphLab(root: HTMLElement, options: GraphLabOptions = { context: 'visualizer' }): LabCleanup {
  const cfg = options.config ?? {}
  let algoId = (cfg.graphAlgo as GraphAlgoId) ?? 'bfs'
  let graphId = cfg.graphId ?? graphInstances[0]!.id
  let graph = getGraphInstance(graphId)
  let start = cfg.start ?? graph.defaultStart
  let goal = cfg.goal ?? graph.defaultGoal
  let mode: 'reference' | 'python' = cfg.runMode ?? 'reference'

  const engine = new PlaybackEngine<GraphFrame>()
  let viz: GraphVisualizer | null = null
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
          <a class="btn" href="${AppRoutes.course('algorithms')}">Algorithms</a>
          <a class="btn" href="${AppRoutes.course('artificial-intelligence')}">AI</a>
          <a class="btn" href="${AppRoutes.labGraphs}">Dismiss to free lab</a>
        </div>
      </div>`
    : `<div class="lab-context-bar">
        <span class="muted">Lab · Graph &amp; search visualizer</span>
        <span class="muted">·</span>
        <a href="${AppRoutes.lab}">All labs</a>
        <span class="muted">·</span>
        <a href="${AppRoutes.course('algorithms')}">Algorithms M4</a>
        <span class="muted">·</span>
        <a href="${AppRoutes.course('artificial-intelligence')}">AI M2</a>
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
        <div class="algo-tabs" role="tablist" aria-label="Search algorithm">
          ${graphAlgorithms
            .map(
              (a) =>
                `<button type="button" role="tab" data-algo="${a.id}" aria-selected="${a.id === algoId}">${a.label}</button>`,
            )
            .join('')}
        </div>
        <label class="muted" style="font-size:0.85rem;">
          Graph
          <select id="graph-id" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;">
            ${graphInstances
              .map((g) => `<option value="${g.id}" ${g.id === graphId ? 'selected' : ''}>${g.name}</option>`)
              .join('')}
          </select>
        </label>
        <label class="muted" style="font-size:0.85rem;">
          Start
          <select id="start-node" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;"></select>
        </label>
        <label class="muted" style="font-size:0.85rem;">
          Goal
          <select id="goal-node" style="margin-left:0.35rem;background:var(--bg-elevated);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:0.3rem;"></select>
        </label>
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
        <section class="ide-pane editor-pane" aria-label="Code / notes" id="pane-editor">
          <div class="pane-label"><span class="pane-title" id="pane-title">Notes</span></div>
          <div class="editor-body" id="editor-body">
            <div class="editor-host" id="editor" hidden></div>
            <div class="concept" id="concept"></div>
          </div>
        </section>
        <div class="viz-stage" id="viz-stage">
          <section class="viz-pane" aria-label="Graph visualization">
            <div class="pane-label"><span class="pane-title" id="label-a">Graph · search</span></div>
            <div class="viz-wrap">
              <canvas class="viz-canvas" id="viz" role="img" aria-label="Graph search visualization"></canvas>
              <div class="lab-empty-hint" id="empty-hint">Press <strong>Run</strong>, then Play / Step through search.</div>
              <div class="viz-status" id="viz-status" aria-live="polite">Ready.</div>
              <div class="viz-stats" id="stats" aria-label="Search metrics"></div>
              <div class="viz-legend" aria-hidden="true">
                <span class="lg-frontier">frontier</span>
                <span class="lg-visited">visited</span>
                <span class="lg-path">path</span>
                <span class="lg-active">current</span>
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
      <div class="ide-console" id="console" aria-live="polite" aria-label="Console">Console ready.</div>
    </div>
  </div>
  `

  const startSel = root.querySelector('#start-node') as HTMLSelectElement
  const goalSel = root.querySelector('#goal-node') as HTMLSelectElement
  const graphSel = root.querySelector('#graph-id') as HTMLSelectElement
  const modeSel = root.querySelector('#run-mode') as HTMLSelectElement
  const conceptEl = root.querySelector('#concept') as HTMLElement
  const consoleEl = root.querySelector('#console') as HTMLElement
  const canvas = root.querySelector('#viz') as HTMLCanvasElement
  const statusEl = root.querySelector('#viz-status') as HTMLElement
  const statsEl = root.querySelector('#stats') as HTMLElement
  const editorHost = root.querySelector('#editor') as HTMLElement
  const paneTitle = root.querySelector('#pane-title') as HTMLElement

  function fillNodeSelects(): void {
    const opts = graph.nodes.map((n) => `<option value="${n.id}">${n.label}</option>`).join('')
    startSel.innerHTML = opts
    goalSel.innerHTML = opts
    startSel.value = start
    goalSel.value = goal
  }

  function updateConcept(): void {
    const a = getGraphAlgorithm(algoId)
    conceptEl.innerHTML = `<strong>${a.label}</strong> · ${a.complexity}<br/>${a.description}<br/>
      <span class="muted">Reference = TS engine. Python = BFS/DFS/Dijkstra templates with visit/explore hooks. A* remains reference-only (layout heuristic).</span>`
  }

  async function ensureEditor(): Promise<void> {
    if (editor) return
    const { EditorView, basicSetup } = await import('codemirror')
    const { python } = await import('@codemirror/lang-python')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    editorHost.hidden = false
    editor = new EditorView({
      doc: templateForGraphAlgo(algoId),
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
      setEditorDoc(templateForGraphAlgo(algoId === 'dfs' ? 'dfs' : 'bfs'))
    } else {
      paneTitle.textContent = 'Notes'
      if (editorHost) editorHost.hidden = true
    }
    updateConcept()
  }

  async function run(): Promise<void> {
    graph = getGraphInstance(graphId)
    start = startSel.value
    goal = goalSel.value
    const algo = getGraphAlgorithm(algoId)

    if (mode === 'python') {
      if (algoId === 'astar') {
        consoleEl.textContent =
          'Python lab supports BFS, DFS, and Dijkstra. Use Reference mode for A* (layout heuristic).'
        return
      }
      await ensureEditor()
      const code = editor?.state.doc.toString() ?? templateForGraphAlgo(algoId)
      consoleEl.textContent = 'Loading Pyodide / running Python…'
      const result = await runGraphPython(code, graph, start, goal)
      if (result.error) {
        consoleEl.textContent = `Error: ${result.error}`
        if (result.frames.length) engine.load(result.frames)
        return
      }
      engine.load(result.frames)
      statsEl.textContent = `Python · ${algo.label} · ${result.frames.length} frames`
      consoleEl.textContent = `Python OK · ${result.logs.join(' · ') || 'done'}`
      return
    }

    const frames = algo.generate(graph, start, goal)
    engine.load(frames)
    const empty = root.querySelector('#empty-hint') as HTMLElement | null
    if (empty) empty.hidden = true
    statsEl.textContent = `${algo.label} · ${frames.length} frames · ${graph.name}`
    consoleEl.textContent = `Reference · ${algo.label} on ${graph.name}: ${start} → ${goal}`
    updateConcept()
  }

  fillNodeSelects()
  updateConcept()
  viz = new GraphVisualizer(canvas, statusEl, statsEl)
  viz.bind(engine)

  root.querySelectorAll('[data-algo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      algoId = (btn as HTMLElement).dataset.algo as GraphAlgoId
      root.querySelectorAll('[data-algo]').forEach((b) => {
        b.setAttribute('aria-selected', String((b as HTMLElement).dataset.algo === algoId))
      })
      void syncModeUi().then(() => run())
    })
  })

  graphSel.addEventListener('change', () => {
    graphId = graphSel.value
    graph = getGraphInstance(graphId)
    start = graph.defaultStart
    goal = graph.defaultGoal
    fillNodeSelects()
    void run()
  })

  modeSel.addEventListener('change', () => {
    mode = modeSel.value as 'reference' | 'python'
    void syncModeUi().then(() => run())
  })

  root.querySelector('#btn-run')!.addEventListener('click', () => void run())
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
