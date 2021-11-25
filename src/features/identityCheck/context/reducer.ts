import { IdentityCheckState, Action } from 'features/identityCheck/context/types'

export const initialIdentityCheckState: IdentityCheckState = {
  step: null,
  profile: {
    city: null,
    status: null,
  },
  identification: {
    done: false,
  },
  confirmation: {
    accepted: false,
  },
}

export const identityCheckReducer = (
  state: IdentityCheckState,
  action: Action
): IdentityCheckState => {
  switch (action.type) {
    case 'INIT':
      return initialIdentityCheckState
    case 'SET_STATE':
      return { ...initialIdentityCheckState, ...action.payload }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'SET_CITY':
      return { ...state, profile: { ...state.profile, city: action.payload } }
    default:
      return state
  }
}
