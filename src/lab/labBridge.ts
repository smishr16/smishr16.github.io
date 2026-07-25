import type { ILabBridge, LabRunResult, PythonLabHooks, SortStep } from '../contracts'
import { pyodideBridge } from './pyodideBridge'

export class LabBridge implements ILabBridge {
  createHooks(initial: number[]) {
    const array = initial.slice()
    const steps: SortStep[] = []
    const logs: string[] = []

    const hooks: PythonLabHooks = {
      get_array: () => array.slice(),
      compare: (i, j) => {
        steps.push({ type: 'compare', i, j })
        if (array[i]! < array[j]!) return -1
        if (array[i]! > array[j]!) return 1
        return 0
      },
      swap: (i, j) => {
        const t = array[i]!
        array[i] = array[j]!
        array[j] = t
        steps.push({ type: 'swap', i, j })
      },
      log: (message) => {
        logs.push(message)
      },
    }

    return {
      hooks,
      getSteps: () => steps.slice(),
      getArray: () => array.slice(),
      getLogs: () => logs.slice(),
    }
  }

  async runPython(code: string, initial: number[]): Promise<LabRunResult> {
    const { hooks, getSteps, getLogs } = this.createHooks(initial)
    try {
      await pyodideBridge.run(code, hooks)
      const steps = getSteps()
      if (steps.length === 0) {
        return {
          steps: [],
          logs: getLogs(),
          error:
            'No compare/swap steps recorded. Call compare(i, j) and swap(i, j) in your Python so the visualization can run.',
        }
      }
      steps.push({ type: 'done' })
      return { steps, logs: getLogs(), error: null }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      return { steps: getSteps(), logs: getLogs(), error: message }
    }
  }
}

export const labBridge = new LabBridge()
