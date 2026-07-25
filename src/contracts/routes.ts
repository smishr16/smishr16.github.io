export const AppRoutes = {
  home: '/',
  learn: '/learn',
  sorting: '/learn/sorting',
} as const

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes]
