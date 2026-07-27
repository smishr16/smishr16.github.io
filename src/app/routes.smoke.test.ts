import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../contracts'
import { courses, labs, getCourse, findAssignmentById } from '../content/courses'
import { renderHome } from '../pages/home'
import { renderLearn } from '../pages/learn'
import { renderCourse } from '../pages/course'
import { renderLabHub } from '../pages/labHub'
import { renderNotFound } from '../pages/notFound'

/** Route/render smoke without a browser — catches broken templates. */
describe('route render smoke', () => {
  it('home / learn / lab hub / 404 render non-empty HTML', () => {
    for (const html of [renderHome(), renderLearn(), renderLabHub(), renderNotFound()]) {
      expect(html.length).toBeGreaterThan(200)
      expect(html).toContain('<main')
    }
  })

  it('every catalog course renders a course page', () => {
    for (const c of courses) {
      const html = renderCourse(c.id)
      expect(html, c.id).toBeTruthy()
      expect(html!).toContain(c.title)
      expect(html!).toContain('Syllabus')
      expect(html!).toContain('Peer course anchors')
    }
  })

  it('legacy sorting course resolves', () => {
    expect(getCourse('sorting')?.id).toBe('algorithms')
    expect(renderCourse('sorting')).toContain('Algorithms')
  })

  it('assignment deep-links resolve for a sample per instrument', () => {
    const samples = [
      'm3-asymptotic-lab',
      'alg-m4-bfs-dfs-lab',
      'ds-m4-lab',
      'os-m3-lab-rr',
      'ml-m3-lab',
    ]
    for (const id of samples) {
      const found = findAssignmentById(id)
      expect(found, id).toBeDefined()
      expect(AppRoutes.assignmentLab(found!.assignment.labId!, id)).toContain(id)
    }
  })

  it('lab hub lists all live instruments', () => {
    const html = renderLabHub()
    for (const l of labs.filter((x) => x.status === 'live')) {
      expect(html).toContain(l.title)
    }
  })
})
