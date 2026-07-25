import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

export function renderLearn(): string {
  const cards = courses
    .map((c) => {
      const inner = `
        <div class="card-meta">
          <span class="badge ${c.status === 'live' ? 'badge-live' : ''}">${c.status === 'live' ? 'Open' : 'Soon'}</span>
          <span class="muted track">${c.track}</span>
        </div>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
        ${
          c.status === 'live'
            ? `<span class="card-cta">${c.labCount} assignments · enter course →</span>`
            : `<span class="card-cta muted">Coming soon</span>`
        }`

      if (c.status === 'live') {
        return `<a class="course-card live course-card-lg" href="${AppRoutes.course(c.id)}">${inner}</a>`
      }
      return `<div class="course-card soon course-card-lg" aria-disabled="true">${inner}</div>`
    })
    .join('')

  return `
  ${renderHeader('learn')}
  <main class="page-shell">
    <header class="page-intro">
      <p class="eyebrow">Learn</p>
      <h1>Courses</h1>
      <p class="lede">
        Courses package ideas into a path. Assignments open the lab with the right algorithm,
        mode, and (when useful) side-by-side compare — so you spend time thinking, not configuring.
      </p>
      <p class="muted">
        Prefer free exploration?
        <a href="${AppRoutes.lab}">Use the Lab visualizer</a> without enrolling in a course.
      </p>
    </header>
    <div class="course-grid course-grid-lg" aria-label="Course catalog">
      ${cards}
    </div>
  </main>
  ${renderFooter()}
  `
}
