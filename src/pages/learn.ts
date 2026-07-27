import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'
import { courseStatusHint, levelLabel, statusBadgeHtml } from '../ui/status'

export function renderLearn(): string {
  const cards = courses
    .map((c) => {
      const hint = courseStatusHint(c.status, c.liveLabCount)
      const ka = (c.cs2023Areas ?? [])
        .slice(0, 3)
        .map((a) => `<span class="chip chip-sm">${a}</span>`)
        .join(' ')

      const hay = `${c.title} ${c.blurb} ${c.track} ${(c.cs2023Areas ?? []).join(' ')}`.toLowerCase()
      return `<a class="course-card course-card-lg" href="${AppRoutes.course(c.id)}" data-status="${c.status}" data-search="${hay.replace(/"/g, '')}">
        <div class="card-meta">
          ${statusBadgeHtml(c.status)}
          <span class="muted track">${c.track}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="level-line muted">${levelLabel(c.level, 'long')}</p>
        ${ka ? `<p class="ka-row">${ka}</p>` : ''}
        <p>${c.blurb}</p>
        <span class="card-cta">${c.moduleCount} modules · ${c.liveLabCount} live labs · ${hint} →</span>
      </a>`
    })
    .join('')

  return `
  ${renderHeader('learn')}
  <main class="page-shell" id="main">
    <header class="page-intro">
      <p class="eyebrow">Courses</p>
      <h1>Core CSE catalog</h1>
      <p class="lede">
        Twelve foundational courses after intro programming — Algorithms and AI/ML as separate tracks.
        Every course has a full syllabus and problem packs; interactive depth varies by badge.
      </p>
      <label class="search-field muted">
        Search catalog
        <input type="search" id="catalog-search" placeholder="e.g. graphs, OS, ML…" autocomplete="off" />
      </label>
      <ul class="legend-row" aria-label="Status legend">
        <li>${statusBadgeHtml('live')} ≥4 openable labs — best interactive experience</li>
        <li>${statusBadgeHtml('partial')} 1–3 labs — mix of instruments and paper</li>
        <li>${statusBadgeHtml('soon')} Syllabus + paper packs — instruments later</li>
      </ul>
    </header>
    <div class="course-grid course-grid-lg" aria-label="Course catalog" id="catalog-grid">
      ${cards}
    </div>
  </main>
  ${renderFooter()}
  `
}

/** Client filter for catalog search (call after inject). */
export function bindLearnSearch(root: ParentNode = document): void {
  const input = root.querySelector<HTMLInputElement>('#catalog-search')
  const grid = root.querySelector('#catalog-grid')
  if (!input || !grid) return
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase()
    grid.querySelectorAll<HTMLElement>('[data-search]').forEach((card) => {
      const hay = card.dataset.search ?? ''
      card.hidden = Boolean(q) && !hay.includes(q)
    })
  })
}
