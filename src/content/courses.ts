import type { CourseDetail, CourseMeta, LabMeta } from '../contracts'
import { AppRoutes } from '../contracts'
import { sortingContent } from './sortingContent'

export { sortingContent }

export const courses: CourseMeta[] = [
  {
    id: 'sorting',
    title: 'Sorting Fundamentals',
    status: 'live',
    track: 'Algorithms',
    labCount: 4,
    blurb:
      'Compare, swap, and measure classic sorts — then complete preconfigured lab assignments.',
  },
  {
    id: 'search',
    title: 'Searching',
    status: 'soon',
    track: 'Algorithms',
    labCount: 0,
    blurb: 'Linear vs binary search with live probes into the array.',
  },
  {
    id: 'structures',
    title: 'Data Structures',
    status: 'soon',
    track: 'Structures',
    labCount: 0,
    blurb: 'Arrays, lists, trees — layout, access cost, and growth in motion.',
  },
  {
    id: 'systems',
    title: 'Systems Concepts',
    status: 'soon',
    track: 'Systems',
    labCount: 0,
    blurb: 'Scheduling, memory, and concurrency ideas made visual.',
  },
]

export const labs: LabMeta[] = [
  {
    id: 'sorting',
    title: 'Sorting visualizer',
    status: 'live',
    path: AppRoutes.labSorting,
    blurb:
      'Open playground: step algorithms, compare two side-by-side, or drive the viz with Python.',
    topics: ['Algorithms', 'Complexity', 'Python'],
  },
  {
    id: 'search',
    title: 'Search visualizer',
    status: 'soon',
    path: '/lab/search',
    blurb: 'Probe arrays with linear and binary search.',
    topics: ['Algorithms'],
  },
  {
    id: 'structures',
    title: 'Structures visualizer',
    status: 'soon',
    path: '/lab/structures',
    blurb: 'Watch structures grow, shrink, and rebalance.',
    topics: ['Data structures'],
  },
]

const sortingCourse: CourseDetail = {
  ...courses[0]!,
  overview:
    'This course teaches sorting by watching algorithms act on the same data. Start with guided assignments that open the Sorting lab already configured — then use the free visualizer anytime to explore on your own.',
  learningGoals: [
    'Explain how bubble, insertion, and merge sort rearrange an array',
    'Compare algorithms using compare/swap/step counts on identical input',
    'Drive the visualization with guided Python compare/swap hooks',
  ],
  assignments: [
    {
      id: 'bubble-walkthrough',
      title: 'Walk through Bubble Sort',
      brief:
        'Open Bubble Sort in reference mode. Play and step until you can narrate each compare and swap.',
      labId: 'sorting',
      status: 'live',
      config: {
        algoId: 'bubble',
        runMode: 'reference',
        arraySize: 12,
        compare: false,
      },
    },
    {
      id: 'compare-bubble-insertion',
      title: 'Compare Bubble vs Insertion',
      brief:
        'Same array, two algorithms. Note which needs fewer compares on a shuffled list, then shuffle again.',
      labId: 'sorting',
      status: 'live',
      config: {
        algoId: 'bubble',
        algoBId: 'insertion',
        compare: true,
        runMode: 'reference',
        arraySize: 16,
      },
    },
    {
      id: 'compare-bubble-merge',
      title: 'Compare Bubble vs Merge',
      brief:
        'See asymptotic difference in action: Bubble vs Merge on the same input. Watch total steps and compares.',
      labId: 'sorting',
      status: 'live',
      config: {
        algoId: 'bubble',
        algoBId: 'merge',
        compare: true,
        runMode: 'reference',
        arraySize: 20,
      },
    },
    {
      id: 'python-bubble',
      title: 'Python lab: implement Bubble Sort',
      brief:
        'Use compare(i, j) and swap(i, j) so your Python code drives the visualization. Run until the array sorts.',
      labId: 'sorting',
      status: 'live',
      config: {
        algoId: 'bubble',
        runMode: 'python',
        arraySize: 10,
        compare: false,
      },
    },
  ],
}

const courseDetails: Record<string, CourseDetail> = {
  sorting: sortingCourse,
}

export function getCourse(id: string): CourseDetail | undefined {
  return courseDetails[id]
}

export function getAssignment(
  courseId: string,
  assignmentId: string,
): { course: CourseDetail; assignment: CourseDetail['assignments'][0] } | undefined {
  const course = getCourse(courseId)
  if (!course) return undefined
  const assignment = course.assignments.find((a) => a.id === assignmentId)
  if (!assignment) return undefined
  return { course, assignment }
}

/** Resolve assignment from query even without course id (labs know assignment ids). */
export function findAssignmentById(assignmentId: string) {
  for (const c of Object.values(courseDetails)) {
    const a = c.assignments.find((x) => x.id === assignmentId)
    if (a) return { course: c, assignment: a }
  }
  return undefined
}
