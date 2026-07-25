import { AppRoutes } from '../contracts'
import { bindLinkInterception, startRouter } from '../ui/router'
import { renderHome } from '../pages/home'
import { renderLearn } from '../pages/learn'
import { renderNotFound } from '../pages/notFound'
import { mountSortingLab, type LabCleanup } from '../pages/sortingLab'

export function bootstrap(app: HTMLElement): () => void {
  bindLinkInterception(document)
  let labCleanup: LabCleanup | null = null

  const stopRouter = startRouter((path) => {
    labCleanup?.()
    labCleanup = null

    if (path === AppRoutes.home || path === '') {
      app.innerHTML = renderHome()
      return
    }
    if (path === AppRoutes.learn) {
      app.innerHTML = renderLearn()
      return
    }
    if (path === AppRoutes.sorting) {
      app.innerHTML = ''
      const host = document.createElement('div')
      host.id = 'lab-root'
      app.appendChild(host)
      labCleanup = mountSortingLab(host)
      return
    }
    app.innerHTML = renderNotFound()
  })

  return () => {
    labCleanup?.()
    stopRouter()
  }
}
