import fs from 'fs'

const p = 'src/content/packs/other-meat.ts'
let t = fs.readFileSync(p, 'utf8')
const marker = 'export const labMeat'
const start = t.indexOf(marker)
if (start < 0) throw new Error('labMeat not found')
const pre = t.slice(0, start)
const body = t.slice(start)
const arrStart = body.indexOf('[')
const header = body.slice(0, arrStart + 1)
const rest = body.slice(arrStart + 1)
// split on pack starts "  {\n    workId:"
const re = /\n  \{\n    workId:/g
const indices = []
let m
while ((m = re.exec('\n' + rest))) {
  indices.push(m.index)
}
// normalize: rest may not start with newline pack
const packs = []
if (!rest.trimStart().startsWith('{')) {
  // unexpected
}
// Better: find all workId blocks with brace matching from each workId
const packRe = /\n  \{[\s\S]*?\n  \},/g
let packsRaw = []
let mm
const searchIn = rest.endsWith(']') ? rest.slice(0, rest.lastIndexOf(']')) : rest
while ((mm = packRe.exec('\n' + searchIn))) {
  packsRaw.push(mm[0].replace(/^\n/, '\n'))
}
// last pack might use }\n without comma
if (packsRaw.length === 0) {
  // fallback split
  const parts = ('\n' + searchIn).split(/\n(?=  \{)/).filter((x) => x.includes('workId:'))
  packsRaw = parts.map((x) => (x.startsWith('\n') ? x : '\n' + x))
}

const seen = new Set()
const kept = []
for (let pack of packsRaw) {
  const idm = pack.match(/workId:\s*'([^']+)'/)
  if (!idm) continue
  if (seen.has(idm[1])) {
    console.log('drop', idm[1])
    continue
  }
  seen.add(idm[1])
  // normalize ending
  pack = pack.replace(/\s+$/, '')
  if (!pack.endsWith(',')) {
    if (pack.endsWith('}')) pack += ','
  }
  kept.push(pack.startsWith('\n') ? pack : '\n' + pack)
}

const out = pre + header + kept.join('') + '\n]\n'
fs.writeFileSync(p, out)
console.log('kept', kept.length, 'unique workIds')
