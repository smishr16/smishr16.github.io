import { copyFileSync } from 'node:fs'
import { join } from 'node:path'

// GitHub Pages SPA fallback: unknown paths serve 404.html
const dist = join(process.cwd(), 'dist')
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
console.log('copied dist/index.html → dist/404.html')
