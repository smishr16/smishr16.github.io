import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

function levelShort(level: string): string {
  if (level === 'undergraduate+graduate') return 'UG · Grad'
  if (level === 'graduate') return 'Grad'
  return 'UG'
}

export function renderHome(): string {
  const cards = courses
    .map((c) => {
      const cta =
        c.status === 'soon'
          ? ''
          : `<span class="card-cta">${c.moduleCount} modules · ${c.liveLabCount} live labs →</span>`

      const inner = `
        <div class="card-meta">
          <span class="badge ${c.status === 'live' ? 'badge-live' : c.status === 'partial' ? 'badge-partial' : ''}">${
            c.status === 'soon' ? 'Soon' : c.status === 'partial' ? 'Partial' : 'Open'
          }</span>
          <span class="muted track">${c.track}</span>
          <span class="muted track">${levelShort(c.level)}</span>
        </div>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
        ${cta}`

      if (c.status === 'soon') {
        return `<div class="course-card soon" aria-disabled="true">${inner}</div>`
      }
      return `<a class="course-card live" href="${AppRoutes.course(c.id)}">${inner}</a>`
    })
    .join('')

  return `
  ${renderHeader('home')}
  <main>
    <section class="hero">
      <h1>Core CSE courses, made interactive.</h1>
      <p class="lede">
        <strong>Learn</strong> follows a real undergraduate path: Data Structures, Algorithms,
        Computer Organization, Operating Systems, and the rest of the required core—
        <em>not</em> intro-to-programming, and not one micro-course per algorithm.
        <strong>Lab</strong> is the instrumentation layer shared across those courses.
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
