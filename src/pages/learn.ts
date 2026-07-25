import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'
import { levelLabel, statusBadgeHtml, statusLabel } from '../ui/status'

export function renderLearn(): string {
  const cards = courses
    .map((c) => {
      const cta =
        c.status === 'soon'
          ? `<span class="card-cta muted">Coming soon · syllabus scaffold</span>`
          : `<span class="card-cta">${c.moduleCount} modules · enter course →</span>`

      const inner = `
        <div class="card-meta">
          ${statusBadgeHtml(c.status)}
          <span class="muted track">${c.track}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="level-line muted">${levelLabel(c.level, 'long')}</p>
        <p>${c.blurb}</p>
        ${cta}`

      if (c.status === 'soon') {
        return `<div class="course-card soon course-card-lg" aria-label="${c.title} (${statusLabel(c.status)})">${inner}</div>`
      }
      return `<a class="course-card live course-card-lg" href="${AppRoutes.course(c.id)}">${inner}</a>`
    })
    .join('')

  return `
  ${renderHeader('learn')}
  <main class="page-shell" id="main">
    <header class="page-intro">
      <p class="eyebrow">Learn</p>
      <h1>Core curriculum</h1>
      <p class="lede">
        Courses match foundational CSE requirements after intro programming.
        Instruments live under Lab; coursework deep-links them preconfigured.
      </p>
    </header>
    <div class="course-grid course-grid-lg" aria-label="Course catalog">
      ${cards}
    </div>
  </main>
  ${renderFooter()}
  `
}
