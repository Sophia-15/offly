import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import { RootLayout } from './RootLayout'
import { FocusRoute } from './routes/FocusRoute'
import { MeRoute } from './routes/MeRoute'
import { MissionsRoute } from './routes/MissionsRoute'
import { UnlocksRoute } from './routes/UnlocksRoute'

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/missions' })
  },
})

const missionsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/missions', component: MissionsRoute })
const focusRoute = createRoute({ getParentRoute: () => rootRoute, path: '/focus', component: FocusRoute })
const unlocksRoute = createRoute({ getParentRoute: () => rootRoute, path: '/unlocks', component: UnlocksRoute })
const meRoute = createRoute({ getParentRoute: () => rootRoute, path: '/me', component: MeRoute })

const routeTree = rootRoute.addChildren([indexRoute, missionsRoute, focusRoute, unlocksRoute, meRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
