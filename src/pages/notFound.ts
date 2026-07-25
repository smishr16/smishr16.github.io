import { AppRoutes } from '../contracts'
import { renderFooter, renderHeader } from '../ui/siteChrome'

export function renderNotFound(): string {
  return `
  ${renderHeader('home')}
  <main class="not-found">
    <h1>Page not found</h1>
    <p class="muted">That route is not part of the lab yet.</p>
    <p>
      <a class="btn btn-primary" href="${AppRoutes.home}">Home</a>
      <a class="btn" href="${AppRoutes.learn}">Courses</a>
      <a class="btn" href="${AppRoutes.lab}">Lab</a>
    </p>
  </main>
  ${renderFooter()}
  `
}
