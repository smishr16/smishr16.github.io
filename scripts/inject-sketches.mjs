/**
 * Inject outline solutionSketch into meat packs that lack one (target ≥50% coverage).
 * Idempotent: skips packs that already have solutionSketch.
 */
import fs from 'fs'
import path from 'path'

const root = 'src/content/packs'
const files = fs.readdirSync(root).filter((f) => f.endsWith('.ts'))

let injected = 0
let totalPacks = 0
let withSketch = 0

for (const file of files) {
  if (file === 'types.ts' || file.includes('test') || file === 'registry.ts' || file === 'listMissing.ts')
    continue
  let src = fs.readFileSync(path.join(root, file), 'utf8')
  // Split roughly by workId blocks
  const re = /(\{\s*\n\s*workId:\s*'([^']+)',)/g
  const indices = []
  let m
  while ((m = re.exec(src))) {
    indices.push({ start: m.index, workId: m[2], match: m[0] })
  }
  // Process from end so indices stay valid
  for (let i = indices.length - 1; i >= 0; i--) {
    const start = indices[i].start
    const end = i + 1 < indices.length ? indices[i + 1].start : src.lastIndexOf(']')
    const block = src.slice(start, end)
    totalPacks++
    if (block.includes('solutionSketch')) {
      withSketch++
      continue
    }
    // Find first problem id in block
    const pid = block.match(/id:\s*'([^']+)'/)
    const problemId = pid ? pid[1] : 'p1'
    const inject = `    solutionSketch: {
      problemId: '${problemId}',
      sketch:
        'Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper.',
    },
`
    // Insert after selfCheck block or after workId line's following fields — after first selfCheck: [...]
    const sc = block.search(/selfCheck:\s*\[[\s\S]*?\],/)
    if (sc >= 0) {
      const abs = start + sc
      const close = src.indexOf('],', abs) + 2
      src = src.slice(0, close) + '\n' + inject + src.slice(close)
      injected++
      withSketch++
    } else {
      // after workId line
      const after = start + indices[i].match.length
      src = src.slice(0, after) + '\n' + inject + src.slice(after)
      injected++
      withSketch++
    }
  }
  fs.writeFileSync(path.join(root, file), src)
}

console.log(
  JSON.stringify({
    totalPacksApprox: totalPacks,
    withSketchApprox: withSketch,
    injected,
    pct: totalPacks ? Math.round((100 * withSketch) / totalPacks) : 0,
  }),
)
