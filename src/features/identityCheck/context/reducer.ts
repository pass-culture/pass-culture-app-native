import { IdentityCheckState, Action } from 'features/identityCheck/context/types'

export const initialIdentityCheckState: IdentityCheckState = {}

export const identityCheckReducer = (
  state: IdentityCheckState,
  action: Action
): IdentityCheckState => {
  switch (action.type) {
    case 'INIT':
      return initialIdentityCheckState
    case 'SET_STATE':
      return { ...initialIdentityCheckState, ...action.payload }
    default:
      return state
  }
}
