import { AppRoutes } from '../contracts'

export type NavKey = 'home' | 'learn' | 'lab'

export function renderHeader(active: NavKey): string {
  return `
  <header class="site-header">
    <a class="brand" href="${AppRoutes.home}" ${active === 'home' ? 'aria-current="page"' : ''}>CS VISUAL LAB</a>
    <nav class="nav-links" aria-label="Primary">
      <a href="${AppRoutes.learn}" ${active === 'learn' ? 'aria-current="page"' : ''}>Learn</a>
      <a href="${AppRoutes.lab}" ${active === 'lab' ? 'aria-current="page"' : ''}>Lab</a>
    </nav>
  </header>`
}

export function renderFooter(): string {
  return `<footer class="site-footer">CS Visual Lab · core CSE courses · instrumented labs · content may be partial</footer>`
}
