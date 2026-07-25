import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

export function renderHome(): string {
  const cards = courses
    .map((c) => {
      if (c.status === 'live') {
        return `<a class="course-card live" href="${AppRoutes.course(c.id)}">
          <div class="card-meta">
            <span class="badge badge-live">Course</span>
            <span class="muted track">${c.track}</span>
          </div>
          <h3>${c.title}</h3>
          <p>${c.blurb}</p>
          <span class="card-cta">${c.labCount} assignments →</span>
        </a>`
      }
      return `<div class="course-card soon" aria-disabled="true">
        <div class="card-meta">
          <span class="badge">Soon</span>
          <span class="muted track">${c.track}</span>
        </div>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
      </div>`
    })
    .join('')

  return `
  ${renderHeader('home')}
  <main>
    <section class="hero">
      <h1>See computer science as it runs.</h1>
      <p class="lede">
        <strong>Learn</strong> through courses with preconfigured lab assignments.
        <strong>Lab</strong> is the open visualizer — explore algorithms and structures without a course path.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${AppRoutes.learn}">Browse courses →</a>
        <a class="btn" href="${AppRoutes.lab}">Open lab visualizer</a>
      </div>
    </section>
    <section class="section-block">
      <div class="section-head">
        <h2>Courses</h2>
        <p class="muted">Structured tracks. Each assignment opens the lab already set up for you.</p>
      </div>
      <div class="course-grid" aria-label="Courses">
        ${cards}
      </div>
    </section>
  </main>
  ${renderFooter()}
  `
}
