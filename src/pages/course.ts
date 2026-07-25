import { AppRoutes, type CourseWork } from '../contracts'
import { getCourse } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'

function levelLabel(level: string): string {
  switch (level) {
    case 'undergraduate':
      return 'Undergraduate'
    case 'graduate':
      return 'Graduate'
    case 'undergraduate+graduate':
      return 'Undergraduate · Graduate extensions'
    default:
      return level
  }
}

function statusBadge(status: string): string {
  if (status === 'live') return `<span class="badge badge-live">Live</span>`
  if (status === 'partial') return `<span class="badge badge-partial">Partial</span>`
  return `<span class="badge">Soon</span>`
}

function workAction(w: CourseWork): string {
  const canLab =
    (w.status === 'live' || w.status === 'partial') &&
    w.labId &&
    w.config &&
    (w.kind === 'lab' || w.kind === 'implementation' || w.kind === 'project')

  if (canLab) {
    return `<a class="btn btn-primary" href="${AppRoutes.assignmentLab(w.labId!, w.id)}">Open lab →</a>`
  }
  if (w.kind === 'analysis' || w.kind === 'reading') {
    return `<span class="btn btn-ghost" title="Written / reading work">On paper</span>`
  }
  return `<span class="btn" aria-disabled="true">Soon</span>`
}

function kindLabel(kind: CourseWork['kind']): string {
  const map: Record<CourseWork['kind'], string> = {
    reading: 'Reading',
    analysis: 'Analysis',
    lab: 'Lab',
    implementation: 'Implement',
    project: 'Project',
  }
  return map[kind]
}

export function renderCourse(courseId: string): string | null {
  const course = getCourse(courseId)
  if (!course) return null

  const prereqs = course.prerequisites.map((p) => `<li>${p}</li>`).join('')
  const goals = course.learningGoals.map((g) => `<li>${g}</li>`).join('')

  const modules = course.modules
    .map((mod) => {
      const topics = mod.topics.map((t) => `<li>${t}</li>`).join('')
      const outcomes = mod.outcomes.map((o) => `<li>${o}</li>`).join('')
      const work = mod.work
        .map((w) => {
          return `
          <article class="work-card work-${w.status}">
            <div class="work-meta">
              ${statusBadge(w.status)}
              <span class="badge">${kindLabel(w.kind)}</span>
            </div>
            <h4>${w.title}</h4>
            <p class="work-objective"><strong>Objective.</strong> ${w.objective}</p>
            <p class="muted">${w.brief}</p>
            <div class="work-action">${workAction(w)}</div>
          </article>`
        })
        .join('')

      return `
      <section class="module-block" id="${mod.id}">
        <header class="module-head">
          <span class="module-code">${mod.code}</span>
          <div>
            <h3>${mod.title}</h3>
            <p class="muted">${mod.summary}</p>
          </div>
        </header>
        <div class="module-grid">
          <div>
            <h4 class="subhead">Topics</h4>
            <ul class="topic-list">${topics}</ul>
            <h4 class="subhead">Outcomes</h4>
            <ul class="topic-list">${outcomes}</ul>
          </div>
          <div>
            <h4 class="subhead">Coursework</h4>
            <div class="work-list">${work}</div>
          </div>
        </div>
      </section>`
    })
    .join('')

  return `
  ${renderHeader('learn')}
  <main class="page-shell page-course">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="${AppRoutes.learn}">Courses</a>
      <span aria-hidden="true">/</span>
      <span>${course.title}</span>
    </nav>

    <header class="page-intro course-hero">
      <p class="eyebrow">${course.track} · ${levelLabel(course.level)}</p>
      <div class="title-row">
        <h1>${course.title}</h1>
        ${statusBadge(course.status)}
      </div>
      ${course.academicNote ? `<p class="academic-note">${course.academicNote}</p>` : ''}
      <p class="lede">${course.overview}</p>
    </header>

    <section class="section-block two-col-info">
      <div>
        <h2>Prerequisites</h2>
        <ul class="goal-list">${prereqs}</ul>
      </div>
      <div>
        <h2>Learning goals</h2>
        <ul class="goal-list">${goals}</ul>
      </div>
    </section>

    <section class="section-block syllabus">
      <div class="section-head">
        <h2>Syllabus</h2>
        <p class="muted">
          Modules are topic units (as in a university course), not single-algorithm “lessons.”
          Labs open the shared visualizer preconfigured for experiments—theory and analysis remain first-class.
        </p>
      </div>
      ${modules}
    </section>

    <section class="section-block callout">
      <h2>Lab as instrument, not the course</h2>
      <p class="muted">
        The sorting visualizer is available anytime for free exploration. The course is the syllabus,
        arguments, and experimental discipline—not a sequence of toy demos.
      </p>
      <p><a class="btn" href="${AppRoutes.labSorting}">Open sorting visualizer →</a></p>
    </section>
  </main>
  ${renderFooter()}
  `
}
