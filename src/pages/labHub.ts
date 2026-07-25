import { labs } from '../content/courses'
import { renderFooter, renderHeader } from '../ui/siteChrome'
import { statusBadgeHtml, statusLabel } from '../ui/status'

export function renderLabHub(): string {
  const cards = labs
    .map((l) => {
      const topics = l.topics.map((t) => `<span class="chip">${t}</span>`).join('')
      if (l.status === 'live') {
        return `<a class="course-card live course-card-lg" href="${l.path}">
          <div class="card-meta">
            ${statusBadgeHtml('live')}
            <span class="chip">Instrument</span>
          </div>
          <h3>${l.title}</h3>
          <p>${l.blurb}</p>
          <div class="assignment-tags">${topics}</div>
          <span class="card-cta">Enter lab →</span>
        </a>`
      }
      return `<div class="course-card soon course-card-lg" aria-label="${l.title} (${statusLabel(l.status)})">
        <div class="card-meta">${statusBadgeHtml(l.status)}<span class="chip">Instrument</span></div>
        <h3>${l.title}</h3>
        <p>${l.blurb}</p>
        <div class="assignment-tags">${topics}</div>
        <span class="card-cta muted">Coming soon</span>
      </div>`
    })
    .join('')

  return `
  ${renderHeader('lab')}
  <main class="page-shell" id="main">
    <header class="page-intro">
      <p class="eyebrow">Lab</p>
      <h1>Instruments</h1>
      <p class="lede">
        Shared visualizers for the core curriculum—not courses themselves.
        Explore freely, or open preconfigured from course work.
      </p>
    </header>
    <div class="course-grid course-grid-lg" aria-label="Labs">
      ${cards}
    </div>
  </main>
  ${renderFooter()}
  `
}
