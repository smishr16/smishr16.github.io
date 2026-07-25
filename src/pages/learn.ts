import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

function levelLabel(level: string): string {
  if (level === 'undergraduate+graduate') return 'UG + grad extensions'
  if (level === 'graduate') return 'Graduate'
  return 'Undergraduate'
}

export function renderLearn(): string {
  const cards = courses
    .map((c) => {
      const inner = `
        <div class="card-meta">
          <span class="badge ${
            c.status === 'live' ? 'badge-live' : c.status === 'partial' ? 'badge-partial' : ''
          }">${c.status === 'soon' ? 'Soon' : c.status === 'partial' ? 'Partial' : 'Open'}</span>
          <span class="muted track">${c.track}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="level-line muted">${levelLabel(c.level)}</p>
        <p>${c.blurb}</p>
        ${
          c.status === 'soon'
            ? `<span class="card-cta muted">Syllabus forthcoming</span>`
            : `<span class="card-cta">${c.moduleCount} modules · enter course →</span>`
        }`

      if (c.status === 'soon') {
        return `<div class="course-card soon course-card-lg" aria-disabled="true">${inner}</div>`
      }
      return `<a class="course-card live course-card-lg" href="${AppRoutes.course(c.id)}">${inner}</a>`
    })
    .join('')

  return `
  ${renderHeader('learn')}
  <main class="page-shell">
    <header class="page-intro">
      <p class="eyebrow">Learn</p>
      <h1>Course catalog</h1>
      <p class="lede">
        Courses mirror how CS is taught in degree programs: multi-module syllabi with prerequisites,
        learning goals, analysis work, and labs. A course is <em>Sorting Algorithms</em> or
        <em>Operating Systems</em>—not “intro to one named procedure.”
      </p>
      <p class="muted">
        Need an instrument without a syllabus?
        <a href="${AppRoutes.lab}">Open the Lab</a> visualizers directly.
      </p>
    </header>
    <div class="course-grid course-grid-lg" aria-label="Course catalog">
      ${cards}
    </div>
  </main>
  ${renderFooter()}
  `
}
