import { AppRoutes, LEGACY_SORTING_PATH } from '../contracts'
import { findAssignmentById } from '../content/courses'
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

    // /learn/:courseId (includes legacy /learn/sorting → Sorting Fundamentals course)
    if (path.startsWith('/learn/')) {
      const courseId = path.slice('/learn/'.length).split('/').filter(Boolean)[0]
      if (courseId) {
        const html = renderCourse(courseId)
        if (html) {
          app.innerHTML = html
          return
        }
      }
    }

    // Keep legacy constant referenced for docs/grep
    void LEGACY_SORTING_PATH

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
          labCleanup = mountSortingLab(host, {
            context: 'assignment',
            assignment: found.assignment,
            courseTitle: found.course.title,
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
