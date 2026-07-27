/** Generic frame-based playback for non-sorting instruments. */

export interface PlaybackSnapshot<TFrame> {
  frames: TFrame[]
  index: number
  playing: boolean
  speed: number
  statusText: string
  frame: TFrame | null
}

export type PlaybackListener<TFrame> = (snap: PlaybackSnapshot<TFrame>) => void

export interface IPlaybackEngine<TFrame> {
  load(frames: TFrame[]): void
  play(): void
  pause(): void
  step(): void
  reset(): void
  setSpeed(multiplier: number): void
  subscribe(listener: PlaybackListener<TFrame>): () => void
  getSnapshot(): PlaybackSnapshot<TFrame>
}

export function statusFromFrame(frame: { statusText?: string } | null, index: number, total: number): string {
  if (!frame) return total === 0 ? 'No frames loaded.' : 'Ready.'
  if (frame.statusText) return `${frame.statusText} (${index + 1}/${total})`
  return `Step ${index + 1}/${total}`
}
