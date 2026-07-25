import { AppRoutes } from '../contracts'

export function renderNotFound(): string {
  return `
  <main class="not-found">
    <p class="brand">CS VISUAL LAB</p>
    <h1>Page not found</h1>
    <p class="muted">That route is not part of the lab yet.</p>
    <p><a class="btn btn-primary" href="${AppRoutes.home}">Back home</a></p>
  </main>
  `
}
