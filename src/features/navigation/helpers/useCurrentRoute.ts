import { Route, useNavigationState } from '@react-navigation/native'

export function useCurrentRoute(): Route<string> | null {
  return useNavigationState((state) => {
    const numberOfRoutes = state?.routes.length
    if (numberOfRoutes > 0) {
      return state.routes[numberOfRoutes - 1]
    }
    return null
  })
}
