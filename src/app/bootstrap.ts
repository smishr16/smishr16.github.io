import { AppRoutes, LEGACY_SORTING_COURSE_PATH } from '../contracts'
import { findAssignmentById, getCourse, LEGACY_COURSE_REDIRECTS } from '../content/courses'
import { bindLinkInterception, navigate, startRouter } from '../ui/router'
import { renderHome } from '../pages/home'
import { renderLearn } from '../pages/learn'
import { renderCourse } from '../pages/course'
import { renderLabHub } from '../pages/labHub'
import { renderNotFound } from '../pages/notFound'
import { mountSortingLab, type LabCleanup } from '../pages/sortingLab'

function queryParams(): URLSearchParams {
  return new URLSearchParams(window.location.search)
}

function setDocumentTitle(parts: string[]): void {
  const title = [...parts, 'CS Visual Lab'].filter(Boolean).join(' · ')
  document.title = title
  const ann = document.getElementById('route-announcer')
  if (ann) ann.textContent = title
}

function afterRoute(app: HTMLElement, titleParts: string[]): void {
  setDocumentTitle(titleParts)
  window.scrollTo(0, 0)
  // Programmatic focus for SPA views (skip target is #app)
  app.setAttribute('tabindex', '-1')
  try {
    app.focus({ preventScroll: true })
  } catch {
    app.focus()
  }
}

export function bootstrap(app: HTMLElement): () => void {
  bindLinkInterception(document)
  let labCleanup: LabCleanup | null = null

  const stopRouter = startRouter((path) => {
    labCleanup?.()
    labCleanup = null

    if (path === AppRoutes.home || path === '') {
      app.innerHTML = renderHome()
      afterRoute(app, [])
      return
    }

    if (path === AppRoutes.learn) {
      app.innerHTML = renderLearn()
      afterRoute(app, ['Learn'])
      return
    }

    if (path === AppRoutes.lab) {
      app.innerHTML = renderLabHub()
      afterRoute(app, ['Lab'])
      return
    }

    if (path.startsWith('/learn/')) {
      let courseId = path.slice('/learn/'.length).split('/').filter(Boolean)[0]
      if (courseId) {
        if (LEGACY_COURSE_REDIRECTS[courseId]) {
          courseId = LEGACY_COURSE_REDIRECTS[courseId]
          if (path === LEGACY_SORTING_COURSE_PATH || path.endsWith('/sorting')) {
            history.replaceState({}, '', AppRoutes.course(courseId))
          }
        }
        const html = renderCourse(courseId)
        if (html) {
          app.innerHTML = html
          const course = getCourse(courseId)
          afterRoute(app, [course?.title ?? courseId, 'Learn'])
          return
        }
      }
    }

    if (path === AppRoutes.labSorting || path === '/lab/sorting') {
      const assignmentId = queryParams().get('assignment')
      app.innerHTML = ''
      const host = document.createElement('div')
      host.id = 'lab-root'
      app.appendChild(host)

      if (assignmentId) {
        const found = findAssignmentById(assignmentId)
        if (found) {
          const mod = found.course.modules.find((m) => m.id === found.moduleId)
          labCleanup = mountSortingLab(host, {
            context: 'assignment',
            assignment: found.assignment,
            courseTitle: found.course.title,
            moduleTitle: mod ? `${mod.code} ${mod.title}` : undefined,
            config: found.assignment.config,
          })
          afterRoute(app, [found.assignment.title, 'Lab'])
          return
        }
      }

      labCleanup = mountSortingLab(host, { context: 'visualizer' })
      afterRoute(app, ['Sorting visualizer', 'Lab'])
      return
    }

    if (path.startsWith('/lab/')) {
      app.innerHTML = renderNotFound()
      afterRoute(app, ['Not found'])
      return
    }

    app.innerHTML = renderNotFound()
    afterRoute(app, ['Not found'])
  })

  return () => {
    labCleanup?.()
    stopRouter()
  }
}

export { navigate }
