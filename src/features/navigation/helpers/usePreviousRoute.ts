import { Route, useNavigationState } from '@react-navigation/native'

export function usePreviousRoute(): Route<string> | null {
  // @ts-expect-error: because of noUncheckedIndexedAccess
  return useNavigationState((state) => {
    const numberOfRoutes = state.routes.length
    if (numberOfRoutes > 1) {
      return state.routes[numberOfRoutes - 2]
    }
    return null
  })
}
