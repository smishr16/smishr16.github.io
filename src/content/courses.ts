/** Re-exports catalog API. Prefer importing from content/courses/index. */
export {
  courses,
  labs,
  sortingContent,
  getCourse,
  getAllCourses,
  findAssignmentById,
  getAllLiveLabWork,
  LEGACY_COURSE_REDIRECTS,
} from './courses/index'
