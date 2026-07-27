import fs from 'fs'

const fixes = {
  'db-m5-lab-join-cost': {
    problemId: 'c1',
    sketch:
      'Toy |R|=|S|=3: NLJ probes=9, hash build+probe≈6. Scale 10³: NLJ ~10⁶ vs hash ~2·10³. NLJ wins with tiny outer + index on inner.',
  },
  'pl-m4-lab-stlc': {
    problemId: 't1',
    sketch:
      '⊢ (λx:Bool.x) true : Bool via T-Abs (gives Bool→Bool) and T-App. Paper tree needs Γ,x:Bool ⊢ x:Bool. Unsound cast breaks progress.',
  },
  'ml-m4-ps': {
    problemId: 'bv1',
    sketch:
      'Low d: high bias underfit (train+test high). High d: train↓ test↑ overfit. Pick d by validation min. Larger λ ⇒ simpler model (higher bias).',
  },
  'ml-m6-ps': {
    problemId: 'e1',
    sketch:
      'k-fold: rotate holdout; never tune on final test. Leak: fitting scaler on full data including test — fit on train fold only.',
  },
  'ml-m7-ps': {
    problemId: 'c1',
    sketch:
      'Confusion matrix cells; precision=TP/(TP+FP), recall=TP/(TP+FN). Imbalance: accuracy can look high while minority fails — report F1/AUPRC.',
  },
  'm3-implement-merge': {
    problemId: 'im1',
    sketch:
      'Merge structure: divide mid, recurse, combine sorted halves. Instrumentation should count compares in merge; validate vs reference on fixed array.',
  },
  'ml-m8-lab-kmeans': {
    problemId: 'k1',
    sketch:
      'Assign points to nearest center; update means; stop when centers stable. k choice: elbow of inertia. Sensitive to init — try multiple seeds.',
  },
  'net-m3-lab-arq': {
    problemId: 'a1',
    sketch:
      'Stop-and-wait: 1 outstanding. Window=2 pipelines two DATAs. Utilization ↑ when RTT≫tx. GBN rewinds from base; SR retransmits lost only.',
  },
  'pl-m2-lab-env': {
    problemId: 'e1',
    sketch:
      'x hits local g binding 9 (shadows global 1); y from parent f; z unbound. Static chain follows definition, not call stack.',
  },
  'pl-m3-lab-sos': {
    problemId: 's1',
    sketch:
      '(2+3)*4 → 5*4 → 20. Congruence reduces addition inside mul context first. Big-step collapses to one ⇓ judgment.',
  },
  'os-m5-lab-fifo': {
    problemId: 'ff1',
    sketch:
      '3 frames FIFO: fault when page not in memory; victim = oldest. Count faults on lab ref string; list final residents.',
  },
  'os-m5-lab-lru': {
    problemId: 'lr1',
    sketch:
      'LRU evicts least-recently used; often fewer faults than FIFO on looping refs. Clock approximates with reference bit.',
  },
}

const GENERIC =
  "Outline: state assumptions, show key equation or trace step, conclude with Θ/complexity or accept/reject claim. Expand on paper."

function patchFile(path) {
  let t = fs.readFileSync(path, 'utf8')
  let n = 0
  for (const [workId, { problemId, sketch }] of Object.entries(fixes)) {
    if (!t.includes(`workId: '${workId}'`)) continue
    const esc = sketch.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    const block = `solutionSketch: {\n      problemId: '${problemId}',\n      sketch:\n        '${esc}',\n    },\n    `
    // if already has sketch, replace the sketch block inside that pack
    const idIdx = t.indexOf(`workId: '${workId}'`)
    if (idIdx < 0) continue
    const next = t.indexOf('workId:', idIdx + 10)
    const slice = t.slice(idIdx, next > 0 ? next : idIdx + 2500)
    if (slice.includes('solutionSketch')) {
      const newSlice = slice.replace(
        /solutionSketch:\s*\{[\s\S]*?\n\s*\},/,
        block.trim().replace(/,\s*$/, '') + '\n    },',
      )
      t = t.slice(0, idIdx) + newSlice + t.slice(next > 0 ? next : idIdx + slice.length)
      n++
    } else {
      // insert after selfCheck
      const sc = slice.search(/selfCheck:\s*\[[\s\S]*?\],/)
      if (sc >= 0) {
        const abs = idIdx + sc
        const close = t.indexOf('],', abs) + 2
        t = t.slice(0, close) + '\n    ' + block + t.slice(close)
        n++
      }
    }
  }
  // replace remaining GENERIC sketches
  if (t.includes(GENERIC)) {
    const count = t.split(GENERIC).length - 1
    // leave a better generic if any remain — replace with domain-neutral improved text
    t = t.split(GENERIC).join(
      'Instantiate the prompt’s numbers/instance; show one full trace or closed form; end with the claim (Θ, accept/reject, or table). Expand on paper.',
    )
    n += count
  }
  fs.writeFileSync(path, t)
  return n
}

const files = [
  'src/content/packs/other-meat.ts',
  'src/content/packs/math-ai-ml-meat.ts',
  'src/content/packs/systems-os-meat.ts',
  'src/content/packs/algorithms-meat.ts',
  'src/content/packs/ds-meat.ts',
]
let total = 0
for (const f of files) {
  if (fs.existsSync(f)) total += patchFile(f)
}
console.log('patched ops', total)
