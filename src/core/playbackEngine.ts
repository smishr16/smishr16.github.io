import type { IPlaybackEngine, PlaybackListener, PlaybackSnapshot } from '../contracts/playback'
import { statusFromFrame } from '../contracts/playback'

export class PlaybackEngine<TFrame extends { statusText?: string }> implements IPlaybackEngine<TFrame> {
  private frames: TFrame[] = []
  private index = -1
  private playing = false
  private speed = 1
  private listeners = new Set<PlaybackListener<TFrame>>()
  private timer: ReturnType<typeof setTimeout> | null = null

  load(frames: TFrame[]): void {
    this.pause()
    this.frames = frames.slice()
    this.index = -1
    this.emit()
  }

  play(): void {
    if (this.playing) return
    if (this.index >= this.frames.length - 1 && this.frames.length > 0) {
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
    if (this.index >= this.frames.length - 1) {
      this.playing = false
      this.emit()
      return
    }
    this.index += 1
    this.emit()
  }

  reset(): void {
    this.pause()
    this.index = -1
    this.emit()
  }

  setSpeed(multiplier: number): void {
    this.speed = Math.min(8, Math.max(0.25, multiplier))
    this.emit()
  }

  subscribe(listener: PlaybackListener<TFrame>): () => void {
    this.listeners.add(listener)
    listener(this.getSnapshot())
    return () => this.listeners.delete(listener)
  }

  getSnapshot(): PlaybackSnapshot<TFrame> {
    const frame = this.index >= 0 ? this.frames[this.index]! : null
    return {
      frames: this.frames,
      index: this.index,
      playing: this.playing,
      speed: this.speed,
      statusText: statusFromFrame(frame, this.index, this.frames.length),
      frame,
    }
  }

  private schedule(): void {
    if (!this.playing) return
    const delay = 480 / this.speed
    this.timer = setTimeout(() => {
      this.timer = null
      if (!this.playing) return
      if (this.index >= this.frames.length - 1) {
        this.playing = false
        this.emit()
        return
      }
      this.step()
      if (this.playing) this.schedule()
    }, delay)
  }

  private emit(): void {
    const snap = this.getSnapshot()
    for (const l of this.listeners) l(snap)
  }
}
