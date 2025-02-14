import { NavigationState } from '@react-navigation/native'
import { cloneDeep } from 'lodash'

function limitStateSize(newState: Writable<NavigationState>) {
  // @ts-expect-error: because of noUncheckedIndexedAccess
  newState.routes = [newState.routes[newState.index]]
  newState.index = 0
  return newState
}

export function sanitizeNavigationState(state: NavigationState) {
  return limitStateSize(cloneDeep(state))
}
