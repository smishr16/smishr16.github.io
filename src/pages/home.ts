import { AppRoutes } from '../contracts'
import { lessons } from '../content/lessons'

export function renderHome(): string {
  const cards = lessons
    .map((l) => {
      if (l.status === 'live') {
        return `<a class="course-card live" href="${l.path}">
          <div><span class="badge badge-live">Live</span></div>
          <h3>${l.title}</h3>
          <p>${l.blurb}</p>
        </a>`
      }
      return `<div class="course-card soon" aria-disabled="true">
        <div><span class="badge">Soon</span></div>
        <h3>${l.title}</h3>
        <p>${l.blurb}</p>
      </div>`
    })
    .join('')

  return `
  <header class="site-header">
    <a class="brand" href="${AppRoutes.home}">CS VISUAL LAB</a>
    <nav class="nav-links" aria-label="Primary">
      <a href="${AppRoutes.learn}">Learn</a>
      <a href="${AppRoutes.sorting}">Sorting Lab</a>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>See computer science as it runs.</h1>
      <p class="lede">Interactive labs for algorithms and systems thinking — step through visualizations, then run guided Python that drives what you see.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${AppRoutes.sorting}">Open Sorting Lab →</a>
        <a class="btn" href="${AppRoutes.learn}">Browse courses</a>
      </div>
    </section>
    <section class="course-grid" aria-label="Courses">
      ${cards}
    </section>
  </main>
  <footer class="site-footer">CS Visual Lab · educational prototypes on GitHub Pages</footer>
  `
}
