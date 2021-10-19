import { Route, useNavigationState } from '@react-navigation/native'

export function usePreviousRoute(): Route<string> | null {
  return useNavigationState((state) => {
    const numberOfRoutes = state.routes.length
    if (numberOfRoutes > 1) {
      const previousRoute = state.routes[numberOfRoutes - 2]
      return previousRoute
    }
    return null
  })
}
