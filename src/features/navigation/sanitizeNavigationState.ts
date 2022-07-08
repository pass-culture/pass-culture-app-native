import cloneDeep from 'lodash.clonedeep'

function clearSearchParams(newState: Record<string, unknown>) {
  // @ts-ignore NavigationState is normally readonly, we voluntary don't use this type
  newState.routes = newState?.routes?.map((route) => {
    if (route?.params?.screen === 'Search' && route?.params?.params) {
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

function limitStateSize(newState: Record<string, unknown>) {
  if (newState.index !== undefined && newState.routes) {
    newState.routes = [(newState.routes as [])[newState.index as number]]
    newState.index = 0
  }
  return newState
}

export function sanitizeNavigationState(state: Record<string, unknown>) {
  const clonedState = cloneDeep(state)
  let newState = limitStateSize(clonedState)
  newState = clearSearchParams(newState)
  return newState
}
