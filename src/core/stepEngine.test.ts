import { describe, expect, it } from 'vitest'
import { StepEngine } from './stepEngine'
import { bubbleSort } from './algorithms'

describe('StepEngine', () => {
  it('starts before first step and steps within bounds', () => {
    const engine = new StepEngine()
    const arr = [3, 1, 2]
    const steps = bubbleSort.generateSteps(arr)
    engine.load(arr, steps)
    expect(engine.getSnapshot().index).toBe(-1)
    engine.step()
    expect(engine.getSnapshot().index).toBe(0)
    for (let i = 0; i < steps.length + 5; i++) engine.step()
    expect(engine.getSnapshot().index).toBe(steps.length - 1)
  })

  it('reset restores initial array', () => {
    const engine = new StepEngine()
    const arr = [3, 1, 2]
    engine.load(arr, bubbleSort.generateSteps(arr))
    while (engine.getSnapshot().index < engine.getSnapshot().steps.length - 1) {
      engine.step()
    }
    engine.reset()
    expect(engine.getSnapshot().array).toEqual(arr)
    expect(engine.getSnapshot().index).toBe(-1)
  })
})
