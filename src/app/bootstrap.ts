import { AppRoutes, LEGACY_SORTING_COURSE_PATH } from '../contracts'
import { findAssignmentById, LEGACY_COURSE_REDIRECTS } from '../content/courses'
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

    if (path === AppRoutes.lab) {
      app.innerHTML = renderLabHub()
      return
    }

    // /learn/:courseId — legacy /learn/sorting → Algorithms
    if (path.startsWith('/learn/')) {
      let courseId = path.slice('/learn/'.length).split('/').filter(Boolean)[0]
      if (courseId) {
        if (LEGACY_COURSE_REDIRECTS[courseId]) {
          courseId = LEGACY_COURSE_REDIRECTS[courseId]
          // Normalize URL without breaking back button stack badly
          if (path === LEGACY_SORTING_COURSE_PATH || path.endsWith('/sorting')) {
            history.replaceState({}, '', AppRoutes.course(courseId))
          }
        }
        const html = renderCourse(courseId)
        if (html) {
          app.innerHTML = html
          return
        }
      }
    }

    // /lab/sorting — free visualizer or assignment deep-link
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
          return
        }
      }

      labCleanup = mountSortingLab(host, { context: 'visualizer' })
      return
    }

    // Unknown /lab/* soon
    if (path.startsWith('/lab/')) {
      app.innerHTML = renderNotFound()
      return
    }

    app.innerHTML = renderNotFound()
  })

  // Support query-only changes on same path (assignment param)
  const onPop = () => {
    /* startRouter already listens popstate */
  }
  window.addEventListener('popstate', onPop)

  return () => {
    labCleanup?.()
    stopRouter()
    window.removeEventListener('popstate', onPop)
  }
}

// Re-export navigate for tests/tools if needed
export { navigate }
