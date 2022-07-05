export function sanitizeNavigationState(state: Record<string, unknown>) {
  const newState = { ...state }
  // @ts-ignore NavigationState is normally readonly, we voluntary don't use this type
  newState.routes = newState?.routes?.map((route) => {
    if (route.params?.screen === 'Search' && route.params?.params) {
      delete route.params.params
      // @ts-ignore NavigationState is normally readonly, we voluntary don't use this type
      route.state.routes = route.state?.routes?.map((r) => {
        if (r.name === 'Search') {
          delete r.params
        }
        return r
      })
    }
    return route
  })
  return newState
}
