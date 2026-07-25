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
      <h1>Computer science, visualized with rigor.</h1>
      <p class="lede">
        <strong>Learn</strong> is a catalog of courses at bachelor’s and master’s depth—algorithms,
        structures, systems—not single-trick demos.
        <strong>Lab</strong> is the instrumentation layer: open visualizers for experiments, compare runs,
        and implementation work.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${AppRoutes.learn}">Course catalog →</a>
        <a class="btn" href="${AppRoutes.lab}">Lab visualizers</a>
      </div>
    </section>
    <section class="section-block">
      <div class="section-head">
        <h2>Courses</h2>
        <p class="muted">Syllabus-first topics. Labs attach to modules where measurement helps theory land.</p>
      </div>
      <div class="course-grid" aria-label="Courses">
        ${cards}
      </div>
    </section>
  </main>
  ${renderFooter()}
  `
}
