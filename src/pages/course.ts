import { AppRoutes, type CourseWork, type SourceRef } from '../contracts'
import { getCourse, labs } from '../content/courses'
import { getMeatPack } from '../content/packs/registry'
import { renderFooter, renderHeader } from '../ui/siteChrome'
import { courseStatusHint, levelLabel, statusBadgeHtml } from '../ui/status'

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
    return `<p class="status-text">Paper · written work</p>`
  }
  return `<p class="status-text">Instrument not published</p>`
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

function kindChip(kind: CourseWork['kind']): string {
  return `<span class="chip chip-kind-${kind}">${kindLabel(kind)}</span>`
}

function sourceList(sources: SourceRef[] | undefined, empty = ''): string {
  if (!sources?.length) return empty
  return `<ul class="source-list">${sources
    .map((s) => {
      const loc = s.locator ? ` <span class="faint">(${s.locator})</span>` : ''
      const label = s.url
        ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a>`
        : s.label
      return `<li><span class="chip chip-sm">${s.kind}</span> ${label}${loc}</li>`
    })
    .join('')}</ul>`
}

function moduleStatus(work: CourseWork[]): string {
  if (work.some((w) => w.status === 'live' && w.labId && w.config)) return 'live'
  if (work.some((w) => w.status === 'live' || w.status === 'partial')) return 'partial'
  return 'soon'
}

/** Render meat pack as structured problem cards (Coursera/Canvas-style assignment body). */
function renderProblemPack(w: CourseWork): string {
  const meat = getMeatPack(w.id)
  if (meat) {
    const cards = meat.problems
      .map(
        (p) => `
      <li class="problem-card">
        <div class="problem-card-head">
          <span class="problem-card-title">${p.title}</span>
          ${p.points != null ? `<span class="problem-card-pts">${p.points} pts</span>` : ''}
        </div>
        <p class="problem-card-prompt">${p.prompt}</p>
        ${p.hint ? `<p class="problem-card-hint">Hint: ${p.hint}</p>` : ''}
      </li>`,
      )
      .join('')
    return `
      <details class="handout" open>
        <summary>Problem pack · ${meat.timeEstimate} · ${meat.problems.length} problems</summary>
        <div class="handout-body">
          <ol class="problem-cards">${cards}</ol>
          <h5 class="subhead">Deliverables</h5>
          <ul class="handout-meta-list">${meat.deliverables.map((d) => `<li>${d}</li>`).join('')}</ul>
          <h5 class="subhead">Self-check</h5>
          <ul class="handout-meta-list">${meat.selfCheck.map((d) => `<li>${d}</li>`).join('')}</ul>
          ${
            meat.solutionSketch
              ? `<h5 class="subhead">Solution sketch (not full answers)</h5>
                 <p class="problem-card-prompt"><strong>${meat.solutionSketch.problemId}:</strong> ${meat.solutionSketch.sketch}</p>`
              : ''
          }
        </div>
      </details>`
  }

  if (!w.handout) return ''
  return `
    <details class="handout"${w.status === 'live' ? ' open' : ''}>
      <summary>Problem pack${w.handout.timeEstimate ? ` · ${w.handout.timeEstimate}` : ''}</summary>
      <div class="handout-body">
        <h5 class="subhead">Tasks</h5>
        <ol class="handout-meta-list">${w.handout.tasks.map((t) => `<li>${t}</li>`).join('')}</ol>
        <h5 class="subhead">Deliverables</h5>
        <ul class="handout-meta-list">${w.handout.deliverables.map((t) => `<li>${t}</li>`).join('')}</ul>
        <h5 class="subhead">Self-check</h5>
        <ul class="handout-meta-list">${w.handout.selfCheck.map((t) => `<li>${t}</li>`).join('')}</ul>
      </div>
    </details>`
}

export function renderCourse(courseId: string): string | null {
  const course = getCourse(courseId)
  if (!course) return null

  const liveLabs = course.modules
    .flatMap((m) => m.work)
    .filter(
      (w) =>
        w.status === 'live' &&
        w.labId &&
        w.config &&
        (w.kind === 'lab' || w.kind === 'implementation' || w.kind === 'project'),
    ).length
  const paperItems = course.modules
    .flatMap((m) => m.work)
    .filter((w) => w.kind === 'analysis' || w.kind === 'reading').length
  const totalWork = course.modules.reduce((n, m) => n + m.work.length, 0)

  const prereqs = course.prerequisites.map((p) => `<li>${p}</li>`).join('')
  const goals = course.learningGoals.map((g) => `<li>${g}</li>`).join('')

  const peerAnchors = course.peerAnchors
    .map((p) => {
      const title = p.url
        ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.courseCode} · ${p.title}</a>`
        : `${p.courseCode} · ${p.title}`
      const note = p.note ? `<span class="muted"> — ${p.note}</span>` : ''
      return `<li><strong>${p.school}</strong> ${title}${note}</li>`
    })
    .join('')

  const ka = course.cs2023Areas.map((a) => `<span class="chip">${a}</span>`).join(' ')

  const outline = course.modules
    .map((mod) => {
      const st = moduleStatus(mod.work)
      return `<li>
        <a href="#${mod.id}">
          <span class="module-code">${mod.code}</span>
          <span>${mod.title}</span>
          ${statusBadgeHtml(st)}
        </a>
      </li>`
    })
    .join('')

  const modules = course.modules
    .map((mod) => {
      const topics = mod.topics.map((t) => `<li>${t}</li>`).join('')
      const outcomes = mod.outcomes.map((o) => `<li>${o}</li>`).join('')
      const readings = sourceList(
        mod.readings,
        `<p class="muted">See peer anchors and standard texts.</p>`,
      )
      const work = mod.work
        .map((w) => {
          const src = sourceList(w.sources)
          return `
          <article class="work-card work-${w.status}" id="work-${w.id}">
            <div class="work-meta">
              ${statusBadgeHtml(w.status)}
              ${kindChip(w.kind)}
              <label class="progress-check muted">
                <input type="checkbox" data-progress-work="${w.id}" />
                Mark done
              </label>
            </div>
            <h4>${w.title}</h4>
            <p class="work-objective"><strong>Objective.</strong> ${w.objective}</p>
            <p class="muted">${w.brief}</p>
            ${renderProblemPack(w)}
            ${src ? `<div class="work-sources"><h5 class="subhead">Sources</h5>${src}</div>` : ''}
            <div class="work-action">${workAction(w)}</div>
          </article>`
        })
        .join('')

      const schedule = mod.schedule
        ? `<span class="schedule-label">${mod.schedule}</span>`
        : ''

      return `
      <section class="module-block" id="${mod.id}">
        <header class="module-head">
          <span class="module-code">${mod.code}</span>
          <div>
            <div class="module-title-row">
              <h3>${mod.title}</h3>
              ${statusBadgeHtml(moduleStatus(mod.work))}
              ${schedule}
            </div>
            <p>${mod.summary}</p>
          </div>
        </header>
        <div class="module-grid">
          <div>
            <h4 class="subhead">Topics</h4>
            <ul class="topic-list">${topics}</ul>
            <h4 class="subhead">Outcomes</h4>
            <ul class="topic-list">${outcomes}</ul>
            ${
              mod.lectureBeats?.length
                ? `<h4 class="subhead">Lecture beats</h4><ul class="topic-list beat-list">${mod.lectureBeats
                    .map((b) => `<li>${b}</li>`)
                    .join('')}</ul>`
                : ''
            }
            <h4 class="subhead">Readings</h4>
            ${readings}
          </div>
          <div>
            <h4 class="subhead">Coursework</h4>
            <div class="work-list">${work || '<p class="muted">None yet.</p>'}</div>
          </div>
        </div>
      </section>`
    })
    .join('')

  const relatedLabs = labs
    .filter((l) => l.status === 'live')
    .filter((l) =>
      l.topics.some(
        (t) =>
          course.title.toLowerCase().includes(t.toLowerCase().split(' ')[0]!) ||
          t.toLowerCase().includes(course.title.toLowerCase().split(' ')[0]!),
      ),
    )
    .slice(0, 4)

  const labLinks =
    relatedLabs.length > 0
      ? relatedLabs.map((l) => `<a class="btn" href="${l.path}">${l.title} →</a>`).join(' ')
      : `<a class="btn" href="${AppRoutes.lab}">Lab hub →</a>`

  const sortingExtra =
    course.id === 'algorithms'
      ? ` <a class="btn" href="${AppRoutes.labSorting}">Sorting visualizer →</a>`
      : ''

  const readinessNote =
    course.status === 'live'
      ? 'This course has multiple live instruments plus full problem packs. Treat it as usable end-to-end.'
      : course.status === 'partial'
        ? 'Syllabus and problem packs are complete; only some units have interactive labs. Paper work is first-class.'
        : 'Full syllabus and paper problem packs are ready. Interactive instruments for this course are not shipped yet — use Lab hub for shared tools where relevant.'

  return `
  ${renderHeader('learn')}
  <main class="page-shell page-course" id="main">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="${AppRoutes.learn}">Courses</a></li>
        <li aria-current="page">${course.title}</li>
      </ol>
    </nav>

    <header class="page-intro course-hero">
      <p class="eyebrow">${course.track} · ${levelLabel(course.level, 'long')}</p>
      <div class="title-row">
        <h1>${course.title}</h1>
        ${statusBadgeHtml(course.status)}
      </div>
      <p class="status-hint muted">${courseStatusHint(course.status, course.liveLabCount)}</p>
      <p class="progress-summary muted" data-progress-summary>Progress loads locally…</p>
      <p class="progress-actions"><button type="button" class="btn btn-sm" data-progress-export>Export progress JSON</button></p>
      ${course.academicNote ? `<p class="academic-note">${course.academicNote}</p>` : ''}
      <p class="cs2023-line"><span class="muted">CS2023:</span> ${ka}</p>
      <p class="lede">${course.overview}</p>

      <div class="readiness-strip" aria-label="Course readiness">
        <div class="readiness-stat">
          <span class="stat-value">${course.modules.length}</span>
          <span class="stat-label">Modules</span>
        </div>
        <div class="readiness-stat">
          <span class="stat-value">${totalWork}</span>
          <span class="stat-label">Work items</span>
        </div>
        <div class="readiness-stat">
          <span class="stat-value">${liveLabs}</span>
          <span class="stat-label">Live labs</span>
        </div>
        <div class="readiness-stat">
          <span class="stat-value">${paperItems}</span>
          <span class="stat-label">Paper sets</span>
        </div>
      </div>
      <p class="muted" style="margin:0;font-size:0.9rem;line-height:1.55;max-width:40rem;">${readinessNote}</p>
    </header>

    <div class="course-layout">
      <aside class="syllabus-nav" aria-label="Syllabus outline">
        <h2 class="subhead">On this page</h2>
        <ol class="outline-list">${outline}</ol>
        <p class="license-note">${course.licenseNote}</p>
      </aside>

      <div class="course-main">
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

        <section class="section-block peer-block">
          <h2>Peer course anchors</h2>
          <p class="muted">Alignment examples only — not affiliation or mirrored problem sets.</p>
          <ul class="peer-list">${peerAnchors}</ul>
        </section>

        <section class="section-block syllabus">
          <div class="section-head">
            <h2>Modules</h2>
            <p class="muted">
              University-style units: topics → lecture beats → readings → coursework.
              Problem packs open with structured cards (points + prompts).
            </p>
          </div>
          ${modules}
        </section>

        <section class="section-block callout">
          <h2>Labs are instruments</h2>
          <p>
            Visualizers support coursework; they are not the whole course. Free exploration is under Labs.
            Coursework deep-links open instruments preconfigured when available.
          </p>
          <p class="lab-cta-row">
            <a class="btn" href="${AppRoutes.lab}">Lab hub →</a>
            ${labLinks}
            ${sortingExtra}
          </p>
        </section>
      </div>
    </div>
  </main>
  ${renderFooter()}
  `
}
