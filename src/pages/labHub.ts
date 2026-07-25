import { AppRoutes } from '../contracts'
import { labs } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

export function renderLabHub(): string {
  const cards = labs
    .map((l) => {
      const topics = l.topics.map((t) => `<span class="badge">${t}</span>`).join('')
      if (l.status === 'live') {
        return `<a class="course-card live course-card-lg" href="${l.path}">
          <div class="card-meta">
            <span class="badge badge-live">Visualizer</span>
          </div>
          <h3>${l.title}</h3>
          <p>${l.blurb}</p>
          <div class="assignment-tags">${topics}</div>
          <span class="card-cta">Enter lab →</span>
        </a>`
      }
      return `<div class="course-card soon course-card-lg" aria-disabled="true">
        <div class="card-meta"><span class="badge">Soon</span></div>
        <h3>${l.title}</h3>
        <p>${l.blurb}</p>
        <div class="assignment-tags">${topics}</div>
      </div>`
    })
    .join('')

  return `
  ${renderHeader('lab')}
  <main class="page-shell">
    <header class="page-intro">
      <p class="eyebrow">Lab</p>
      <h1>Visualizer workspace</h1>
      <p class="lede">
        Use the lab as a playground: visualize algorithms, data structures, and other CS concepts
        in action. No assignment required — configure freely, compare side-by-side, or run Python.
      </p>
      <p class="muted">
        Want a guided path?
        <a href="${AppRoutes.learn}">Start a course</a> — assignments open these same labs preconfigured.
      </p>
    </header>
    <div class="course-grid course-grid-lg" aria-label="Labs">
      ${cards}
    </div>
  </main>
  ${renderFooter()}
  `
}
