import { AppRoutes } from '../contracts'
import { lessons } from '../content/lessons'

export function renderLearn(): string {
  const items = lessons
    .map((l) => {
      const status =
        l.status === 'live'
          ? `<a href="${l.path}">Enter lab →</a>`
          : `<span class="muted">Coming soon</span>`
      return `<li>
        <strong>${l.title}</strong>
        <span class="badge ${l.status === 'live' ? 'badge-live' : ''}">${l.status}</span>
        <p class="muted">${l.blurb}</p>
        ${status}
      </li>`
    })
    .join('')

  return `
  <header class="site-header">
    <a class="brand" href="${AppRoutes.home}">CS VISUAL LAB</a>
    <nav class="nav-links" aria-label="Primary">
      <a href="${AppRoutes.learn}" aria-current="page">Learn</a>
      <a href="${AppRoutes.sorting}">Sorting Lab</a>
    </nav>
  </header>
  <main class="page-learn">
    <h1>Course map</h1>
    <p class="muted">Start with Sorting — more modules land as the lab grows.</p>
    <ol style="padding-left:1.2rem;display:flex;flex-direction:column;gap:1.25rem;">
      ${items}
    </ol>
  </main>
  `
}
