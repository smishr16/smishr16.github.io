import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'
import { levelLabel, statusBadgeHtml, statusLabel } from '../ui/status'

export function renderHome(): string {
  const cards = courses
    .map((c) => {
      const cta =
        c.status === 'soon'
          ? `<span class="card-cta muted">Coming soon · syllabus scaffold</span>`
          : `<span class="card-cta">${c.moduleCount} modules · ${c.liveLabCount} live labs →</span>`

      const inner = `
        <div class="card-meta">
          ${statusBadgeHtml(c.status)}
          <span class="muted track">${c.track}</span>
          <span class="muted track">${levelLabel(c.level, 'short')}</span>
        </div>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
        ${cta}`

      if (c.status === 'soon') {
        return `<div class="course-card soon" aria-label="${c.title} (${statusLabel(c.status)})">${inner}</div>`
      }
      return `<a class="course-card live" href="${AppRoutes.course(c.id)}">${inner}</a>`
    })
    .join('')

  return `
  ${renderHeader('home')}
  <main class="page-shell" id="main">
    <section class="hero">
      <h1>Core CSE courses, made interactive.</h1>
      <p class="lede">
        Degree-path courses—Data Structures, Algorithms, systems, AI, ML—with instrumented labs.
        Not intro programming; not one micro-course per algorithm.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${AppRoutes.learn}">Course catalog →</a>
        <a class="btn" href="${AppRoutes.lab}">Lab instruments</a>
      </div>
    </section>
    <section class="section-block">
      <div class="section-head">
        <h2>Foundational courses</h2>
        <p class="muted">Same grain as a CSE degree audit. Topics like sorting live inside Algorithms.</p>
      </div>
      <div class="course-grid" aria-label="Courses">
        ${cards}
      </div>
    </section>
  </main>
  ${renderFooter()}
  `
}
