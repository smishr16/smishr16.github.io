import { AppRoutes } from '../contracts'
import { courses } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'
import { courseStatusHint, levelLabel, statusBadgeHtml } from '../ui/status'

export function renderHome(): string {
  const live = courses.filter((c) => c.status === 'live')
  const partial = courses.filter((c) => c.status === 'partial')
  const syllabus = courses.filter((c) => c.status === 'soon')

  const card = (c: (typeof courses)[0]) => {
    const hint = courseStatusHint(c.status, c.liveLabCount)
    return `<a class="course-card" href="${AppRoutes.course(c.id)}" data-status="${c.status}">
      <div class="card-meta">
        ${statusBadgeHtml(c.status)}
        <span class="muted track">${c.track}</span>
        <span class="muted track">${levelLabel(c.level, 'short')}</span>
      </div>
      <h3>${c.title}</h3>
      <p>${c.blurb}</p>
      <span class="card-cta">${c.moduleCount} modules · ${hint} →</span>
    </a>`
  }

  return `
  ${renderHeader('home')}
  <main class="page-shell" id="main">
    <section class="hero">
      <p class="eyebrow">Interactive CSE curriculum</p>
      <h1>Learn by running the algorithm — not only reading about it.</h1>
      <p class="lede">
        Degree-path courses with instrumented labs: sorting, graphs, structures, systems, and ML toys.
        Honest readiness labels so you always know what is interactive vs paper-first.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${AppRoutes.learn}">Browse courses →</a>
        <a class="btn" href="${AppRoutes.lab}">Open labs</a>
        <a class="btn" href="${AppRoutes.course('algorithms')}">Start Algorithms</a>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h2>Ready to run</h2>
        <p class="muted">Live = ≥4 openable instruments + full problem packs. Jump in for the fullest experience.</p>
      </div>
      <div class="course-grid" aria-label="Live courses">
        ${live.map(card).join('') || '<p class="muted">None yet.</p>'}
      </div>
    </section>

    ${
      partial.length
        ? `<section class="section-block">
      <div class="section-head">
        <h2>Partial — labs on some units</h2>
        <p class="muted">Full syllabus and problem packs; instruments on a subset of modules.</p>
      </div>
      <div class="course-grid" aria-label="Partial courses">
        ${partial.map(card).join('')}
      </div>
    </section>`
        : ''
    }

    ${
      syllabus.length
        ? `<section class="section-block">
      <div class="section-head">
        <h2>Syllabus-ready — paper first</h2>
        <p class="muted">Structured courses with midterm-style packs; dedicated course instruments not yet shipped.</p>
      </div>
      <div class="course-grid" aria-label="Syllabus courses">
        ${syllabus.map(card).join('')}
      </div>
    </section>`
        : ''
    }
  </main>
  ${renderFooter()}
  `
}
