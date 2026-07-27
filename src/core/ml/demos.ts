import type { IMlDemo, MlFrame } from '../../contracts/ml'

/** Tiny 1D linear regression GD frames. */
function linreg(): MlFrame[] {
  const xs = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85]
  const ys = xs.map((x) => 0.2 + 0.7 * x + (x > 0.5 ? 0.05 : -0.03))
  let m = 0
  let b = 0.5
  const lr = 0.35
  const frames: MlFrame[] = []
  const pts = xs.map((x, i) => ({ x, y: ys[i]!, label: 0 }))

  frames.push({
    kind: 'scatter',
    title: 'Linear regression (1D toy)',
    statusText: 'Init m=0, b=0.5',
    points: pts,
    line: { x1: 0, y1: b, x2: 1, y2: m + b },
    metrics: 'epoch 0',
    panels: [{ title: 'Model', lines: ['y = m x + b', 'Squared loss GD', 'Teaching toy dataset'] }],
  })

  for (let epoch = 1; epoch <= 12; epoch++) {
    let gm = 0
    let gb = 0
    for (let i = 0; i < xs.length; i++) {
      const pred = m * xs[i]! + b
      const err = pred - ys[i]!
      gm += err * xs[i]!
      gb += err
    }
    gm /= xs.length
    gb /= xs.length
    m -= lr * gm
    b -= lr * gb
    frames.push({
      kind: 'scatter',
      title: 'Linear regression (1D toy)',
      statusText: `Epoch ${epoch}: m=${m.toFixed(3)}, b=${b.toFixed(3)}`,
      points: pts,
      line: { x1: 0, y1: b, x2: 1, y2: Math.max(0, Math.min(1, m + b)) },
      metrics: `loss≈${(gm * gm + gb * gb).toFixed(4)} (grad norm proxy)`,
      panels: [
        { title: 'Update', lines: [`m ← m − η·∂L/∂m`, `b ← b − η·∂L/∂b`, `η=${lr}`] },
      ],
    })
  }
  return frames
}

/** Hard-margin style linear classifier by iterating a simple perceptron. */
function decisionBoundary(): MlFrame[] {
  const points = [
    { x: 0.2, y: 0.3, label: 0 },
    { x: 0.25, y: 0.55, label: 0 },
    { x: 0.35, y: 0.25, label: 0 },
    { x: 0.7, y: 0.75, label: 1 },
    { x: 0.8, y: 0.55, label: 1 },
    { x: 0.65, y: 0.85, label: 1 },
  ]
  let w0 = 0.1
  let w1 = 0.1
  let bias = 0
  const frames: MlFrame[] = []

  function lineFromWeights(): MlFrame['line'] {
    // w0 x + w1 y + bias = 0 → y = -(w0/w1)x - bias/w1
    if (Math.abs(w1) < 1e-6) return { x1: 0.5, y1: 0, x2: 0.5, y2: 1 }
    const m = -w0 / w1
    const b = -bias / w1
    return { x1: 0, y1: b, x2: 1, y2: m + b }
  }

  frames.push({
    kind: 'scatter',
    title: 'Perceptron decision boundary',
    statusText: 'Init weights',
    points: points.map((p) => ({ ...p })),
    line: lineFromWeights(),
    panels: [{ title: 'Classes', lines: ['label 0 · left cluster', 'label 1 · right cluster'] }],
  })

  for (let ep = 1; ep <= 10; ep++) {
    for (const p of points) {
      const yhat = w0 * p.x + w1 * p.y + bias >= 0 ? 1 : 0
      if (yhat !== p.label) {
        const y = p.label === 1 ? 1 : -1
        w0 += 0.4 * y * p.x
        w1 += 0.4 * y * p.y
        bias += 0.4 * y
      }
    }
    frames.push({
      kind: 'scatter',
      title: 'Perceptron decision boundary',
      statusText: `Epoch ${ep}`,
      points: points.map((p) => ({ ...p })),
      line: lineFromWeights(),
      metrics: `w=(${w0.toFixed(2)}, ${w1.toFixed(2)}) b=${bias.toFixed(2)}`,
    })
  }
  return frames
}

function kmeans(): MlFrame[] {
  const data = [
    [0.2, 0.25],
    [0.28, 0.35],
    [0.22, 0.4],
    [0.75, 0.7],
    [0.8, 0.78],
    [0.68, 0.72],
    [0.5, 0.2],
    [0.55, 0.28],
  ].map(([x, y]) => ({ x: x!, y: y! }))
  let c0 = { x: 0.3, y: 0.3 }
  let c1 = { x: 0.6, y: 0.6 }
  const frames: MlFrame[] = []

  for (let it = 0; it < 6; it++) {
    const labels = data.map((p) => {
      const d0 = (p.x - c0.x) ** 2 + (p.y - c0.y) ** 2
      const d1 = (p.x - c1.x) ** 2 + (p.y - c1.y) ** 2
      return d0 <= d1 ? 0 : 1
    })
    frames.push({
      kind: 'scatter',
      title: 'k-means (k=2 toy)',
      statusText: `Assign step ${it + 1}`,
      points: [
        ...data.map((p, i) => ({ x: p.x, y: p.y, label: labels[i] })),
        { x: c0.x, y: c0.y, role: 'centroid' as const, label: 0 },
        { x: c1.x, y: c1.y, role: 'centroid' as const, label: 1 },
      ],
      metrics: `c0=(${c0.x.toFixed(2)},${c0.y.toFixed(2)}) c1=(${c1.x.toFixed(2)},${c1.y.toFixed(2)})`,
    })
    const g0 = data.filter((_, i) => labels[i] === 0)
    const g1 = data.filter((_, i) => labels[i] === 1)
    if (g0.length) c0 = { x: g0.reduce((s, p) => s + p.x, 0) / g0.length, y: g0.reduce((s, p) => s + p.y, 0) / g0.length }
    if (g1.length) c1 = { x: g1.reduce((s, p) => s + p.x, 0) / g1.length, y: g1.reduce((s, p) => s + p.y, 0) / g1.length }
    frames.push({
      kind: 'scatter',
      title: 'k-means (k=2 toy)',
      statusText: `Update centroids ${it + 1}`,
      points: [
        ...data.map((p, i) => ({ x: p.x, y: p.y, label: labels[i] })),
        { x: c0.x, y: c0.y, role: 'centroid', label: 0 },
        { x: c1.x, y: c1.y, role: 'centroid', label: 1 },
      ],
    })
  }
  return frames
}

/** Capacity axis: train error ↓ then flat; test U-shape (classic cartoon). */
function trainTestCurves(): MlFrame[] {
  const frames: MlFrame[] = []
  // model complexity k = 1..10; train falls; test falls then rises
  for (let k = 1; k <= 10; k++) {
    const train = Math.max(0.05, 0.55 - 0.05 * k)
    const test = 0.15 + 0.02 * (k - 5) * (k - 5) + 0.08
    // accumulate curve history
    const hist: { x: number; y: number; label: number }[] = []
    for (let j = 1; j <= k; j++) {
      const tr = Math.max(0.05, 0.55 - 0.05 * j)
      const te = 0.15 + 0.02 * (j - 5) * (j - 5) + 0.08
      hist.push({ x: j / 11, y: 1 - tr, label: 0 })
      hist.push({ x: j / 11, y: 1 - te, label: 1 })
    }
    frames.push({
      kind: 'scatter',
      title: 'Train vs test error (cartoon)',
      statusText: `Complexity k=${k} · train=${train.toFixed(2)} test=${test.toFixed(2)}`,
      points: hist.map((p, i) => ({
        ...p,
        role: i >= hist.length - 2 ? 'active' : 'default',
      })),
      metrics: k < 5 ? 'underfit region' : k === 5 ? 'sweet spot' : 'overfit region',
      panels: [
        {
          title: 'Legend',
          lines: [
            'Teal points ≈ train accuracy (up = lower error)',
            'Blue points ≈ test accuracy',
            'U-shape test error is the classic generalization cartoon',
            'Not real cross-validation — teaching sketch only',
          ],
        },
      ],
    })
  }
  return frames
}

export const mlDemos: IMlDemo[] = [
  {
    id: 'linreg-1d',
    label: 'Linear regression',
    description: 'Gradient descent on a tiny 1D least-squares problem.',
    generate: linreg,
  },
  {
    id: 'decision-boundary',
    label: 'Perceptron boundary',
    description: '2D binary classification with a linear decision boundary.',
    generate: decisionBoundary,
  },
  {
    id: 'kmeans-2d',
    label: 'k-means',
    description: 'Two-cluster k-means on a fixed 2D toy set.',
    generate: kmeans,
  },
  {
    id: 'train-test-curves',
    label: 'Train/test curves',
    description: 'Cartoon capacity axis: underfit → sweet spot → overfit.',
    generate: trainTestCurves,
  },
]

export function getMlDemo(id: string): IMlDemo {
  const d = mlDemos.find((x) => x.id === id)
  if (!d) throw new Error(`Unknown ML demo "${id}". Valid: ${mlDemos.map((x) => x.id).join(', ')}`)
  return d
}
