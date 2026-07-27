import { AppRoutes } from '../contracts'

export type NavKey = 'home' | 'learn' | 'lab'

export function renderHeader(active: NavKey): string {
  return `
  <header class="site-header">
    <div class="site-header-inner">
      <a class="brand" href="${AppRoutes.home}" ${active === 'home' ? 'aria-current="page"' : ''}>
        <span class="brand-mark" aria-hidden="true">▣</span>
        <span class="brand-text">CS Visual Lab</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a class="nav-link" href="${AppRoutes.home}" ${active === 'home' ? 'aria-current="page"' : ''}>Home</a>
        <a class="nav-link" href="${AppRoutes.learn}" ${active === 'learn' ? 'aria-current="page"' : ''}>Courses</a>
        <a class="nav-link" href="${AppRoutes.lab}" ${active === 'lab' ? 'aria-current="page"' : ''}>Labs</a>
      </nav>
    </div>
  </header>`
}

export function renderFooter(): string {
  return `
  <footer class="site-footer">
    <div class="site-footer-inner">
      <p><strong>CS Visual Lab</strong> — interactive CSE courses &amp; instruments</p>
      <p class="faint">
        Status badges: <span class="badge badge-live">Live</span> multi-lab ·
        <span class="badge badge-partial">Partial</span> some labs ·
        <span class="badge badge-syllabus">Syllabus</span> outline only.
        Independent educational product — peer course codes are alignment anchors, not affiliation.
      </p>
    </div>
  </footer>`
}
