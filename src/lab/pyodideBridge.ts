import type { IPyodideBridge, PythonLabHooks } from '../contracts'

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: { set: (k: string, v: unknown) => void }
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>
  }
}

const PYODIDE_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/'

/**
 * Lazy Pyodide loader. Importing this module does NOT load Pyodide.
 * Only `load()` fetches the runtime (must not be called from the home route).
 */
export class PyodideBridge implements IPyodideBridge {
  private py: PyodideInterface | null = null
  private loading: Promise<void> | null = null

  isReady(): boolean {
    return this.py !== null
  }

  async load(): Promise<void> {
    if (this.py) return
    if (this.loading) return this.loading
    this.loading = this.doLoad()
    try {
      await this.loading
    } finally {
      this.loading = null
    }
  }

  async run(code: string, hooks: PythonLabHooks): Promise<void> {
    await this.load()
    if (!this.py) throw new Error('Pyodide failed to initialize')

    this.py.globals.set('get_array', () => hooks.get_array())
    this.py.globals.set('compare', (i: number, j: number) => hooks.compare(i, j))
    this.py.globals.set('swap', (i: number, j: number) => hooks.swap(i, j))
    this.py.globals.set('log', (msg: string) => hooks.log(String(msg)))

    const timeoutMs = 8000
    await Promise.race([
      this.py.runPythonAsync(code),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Python run timed out after ${timeoutMs}ms`)), timeoutMs),
      ),
    ])
  }

  private async doLoad(): Promise<void> {
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `${PYODIDE_INDEX}pyodide.js`
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Pyodide script'))
        document.head.appendChild(s)
      })
    }
    if (!window.loadPyodide) throw new Error('loadPyodide missing after script load')
    this.py = await window.loadPyodide({ indexURL: PYODIDE_INDEX })
  }
}

/** Singleton for app use — still lazy until load(). */
export const pyodideBridge = new PyodideBridge()
