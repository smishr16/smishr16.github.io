import type { EngineListener, EngineSnapshot, IStepEngine, SortStep } from '../contracts'

function emptyMarks() {
  return {
    sorted: new Set<number>(),
    pivot: new Set<number>(),
    active: new Set<number>(),
  }
}

function statusFor(step: SortStep | undefined, index: number, total: number): string {
  if (!step) return total === 0 ? 'No steps loaded.' : 'Ready.'
  switch (step.type) {
    case 'compare':
      return `Comparing indices ${step.i} and ${step.j} (step ${index + 1}/${total})`
    case 'swap':
      return `Swapping indices ${step.i} and ${step.j} (step ${index + 1}/${total})`
    case 'set':
      return `Writing value ${step.value} at index ${step.index} (step ${index + 1}/${total})`
    case 'mark':
      return `Marking ${step.role}: [${step.indices.join(', ')}] (step ${index + 1}/${total})`
    case 'done':
      return 'Sorting complete.'
  }
}

export class StepEngine implements IStepEngine {
  private initial: number[] = []
  private array: number[] = []
  private steps: SortStep[] = []
  private index = -1
  private playing = false
  private speed = 1
  private compare: [number, number] | null = null
  private marks = emptyMarks()
  private listeners = new Set<EngineListener>()
  private timer: ReturnType<typeof setTimeout> | null = null

  load(array: number[], steps: SortStep[]): void {
    this.pause()
    this.initial = array.slice()
    this.array = array.slice()
    this.steps = steps.slice()
    this.index = -1
    this.compare = null
    this.marks = emptyMarks()
    this.emit()
  }

  play(): void {
    if (this.playing) return
    if (this.index >= this.steps.length - 1 && this.steps.length > 0) {
      this.reset()
    }
    this.playing = true
    this.emit()
    this.schedule()
  }

  pause(): void {
    this.playing = false
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.emit()
  }

  step(): void {
    if (this.index >= this.steps.length - 1) {
      this.playing = false
      this.emit()
      return
    }
    this.index += 1
    this.apply(this.steps[this.index]!)
    this.emit()
  }

  reset(): void {
    this.pause()
    this.array = this.initial.slice()
    this.index = -1
    this.compare = null
    this.marks = emptyMarks()
    this.emit()
  }

  setSpeed(multiplier: number): void {
    this.speed = Math.min(8, Math.max(0.25, multiplier))
    this.emit()
  }

  subscribe(listener: EngineListener): () => void {
    this.listeners.add(listener)
    listener(this.getSnapshot())
    return () => this.listeners.delete(listener)
  }

  getSnapshot(): EngineSnapshot {
    const step = this.index >= 0 ? this.steps[this.index] : undefined
    return {
      array: this.array.slice(),
      steps: this.steps,
      index: this.index,
      playing: this.playing,
      speed: this.speed,
      statusText: statusFor(step, this.index, this.steps.length),
      compare: this.compare,
      marks: {
        sorted: new Set(this.marks.sorted),
        pivot: new Set(this.marks.pivot),
        active: new Set(this.marks.active),
      },
    }
  }

  private schedule(): void {
    if (!this.playing) return
    const delay = 420 / this.speed
    this.timer = setTimeout(() => {
      this.timer = null
      if (!this.playing) return
      if (this.index >= this.steps.length - 1) {
        this.playing = false
        this.emit()
        return
      }
      this.step()
      if (this.playing) this.schedule()
    }, delay)
  }

  private apply(step: SortStep): void {
    this.compare = null
    this.marks.active.clear()
    switch (step.type) {
      case 'compare':
        this.compare = [step.i, step.j]
        this.marks.active.add(step.i)
        this.marks.active.add(step.j)
        break
      case 'swap': {
        const t = this.array[step.i]!
        this.array[step.i] = this.array[step.j]!
        this.array[step.j] = t
        this.marks.active.add(step.i)
        this.marks.active.add(step.j)
        break
      }
      case 'set':
        this.array[step.index] = step.value
        this.marks.active.add(step.index)
        break
      case 'mark':
        for (const i of step.indices) {
          if (step.role === 'sorted') this.marks.sorted.add(i)
          if (step.role === 'pivot') this.marks.pivot.add(i)
          if (step.role === 'active') this.marks.active.add(i)
        }
        break
      case 'done':
        for (let i = 0; i < this.array.length; i++) this.marks.sorted.add(i)
        break
    }
  }

  private emit(): void {
    const snap = this.getSnapshot()
    for (const l of this.listeners) l(snap)
  }
}
