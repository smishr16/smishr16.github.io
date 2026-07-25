import { AppRoutes } from '../contracts'
import { getCourse } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

export function renderCourse(courseId: string): string | null {
  const course = getCourse(courseId)
  if (!course) return null

  const goals = course.learningGoals.map((g) => `<li>${g}</li>`).join('')
  const assignments = course.assignments
    .map((a, i) => {
      const href =
        a.status === 'live'
          ? AppRoutes.assignmentLab(a.labId, a.id)
          : '#'
      const action =
        a.status === 'live'
          ? `<a class="btn btn-primary" href="${href}">Start in lab →</a>`
          : `<span class="btn" aria-disabled="true">Soon</span>`
      const tags: string[] = []
      if (a.config.compare) tags.push('Compare')
      if (a.config.runMode === 'python') tags.push('Python')
      else tags.push('Visualizer')
      if (a.config.algoId) tags.push(a.config.algoId)
      if (a.config.algoBId) tags.push(`vs ${a.config.algoBId}`)

      return `
      <article class="assignment-card ${a.status === 'soon' ? 'soon' : ''}">
        <div class="assignment-index">${String(i + 1).padStart(2, '0')}</div>
        <div class="assignment-body">
          <h3>${a.title}</h3>
          <p>${a.brief}</p>
          <div class="assignment-tags">
            ${tags.map((t) => `<span class="badge">${t}</span>`).join('')}
          </div>
        </div>
        <div class="assignment-action">${action}</div>
      </article>`
    })
    .join('')

  return `
  ${renderHeader('learn')}
  <main class="page-shell">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="${AppRoutes.learn}">Courses</a>
      <span aria-hidden="true">/</span>
      <span>${course.title}</span>
    </nav>
    <header class="page-intro">
      <p class="eyebrow">${course.track} · Course</p>
      <h1>${course.title}</h1>
      <p class="lede">${course.overview}</p>
    </header>

    <section class="section-block">
      <h2>What you’ll learn</h2>
      <ul class="goal-list">${goals}</ul>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h2>Assignments</h2>
        <p class="muted">Each opens the lab preconfigured. Complete in order or jump around.</p>
      </div>
      <div class="assignment-list" role="list">
        ${assignments}
      </div>
    </section>

    <section class="section-block callout">
      <h2>Open playground</h2>
      <p class="muted">Skip the syllabus and use the sorting visualizer freely — compare algos, shuffle data, run Python.</p>
      <p><a class="btn" href="${AppRoutes.labSorting}">Open Sorting lab →</a></p>
    </section>
  </main>
  ${renderFooter()}
  `
}
