export type RouteHandler = (path: string) => void

export function getPath(): string {
  return window.location.pathname.replace(/\/$/, '') || '/'
}

export function getFullPath(): string {
  return getPath() + window.location.search
}

/** Navigate to path, optionally with query (e.g. /lab/sorting?assignment=x). */
export function navigate(to: string): void {
  const url = new URL(to, window.location.origin)
  const next = url.pathname.replace(/\/$/, '') || '/'
  const nextFull = next + url.search
  const curFull = getFullPath()
  if (nextFull !== curFull) {
    history.pushState({}, '', nextFull)
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function startRouter(onRoute: RouteHandler): () => void {
  const handler = () => onRoute(getPath())
  window.addEventListener('popstate', handler)
  handler()
  return () => window.removeEventListener('popstate', handler)
}

/** Intercept internal links (including query strings). */
export function bindLinkInterception(root: ParentNode = document): void {
  root.addEventListener('click', (e) => {
    const t = e.target
    if (!(t instanceof Element)) return
    const a = t.closest('a')
    if (!a) return
    const href = a.getAttribute('href')
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || a.target === '_blank')
      return
    if (href.startsWith('/')) {
      e.preventDefault()
      navigate(href)
    }
  })
}
