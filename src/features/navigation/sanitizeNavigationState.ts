function limitStateSize(newState: Record<string, unknown>) {
  if (newState.index !== undefined && newState.routes) {
    newState.routes = [(newState.routes as [])[newState.index as number]]
    newState.index = 0
  }
  return newState
}

export function sanitizeNavigationState(state: Record<string, unknown>) {
  return limitStateSize(structuredClone(state))
}
