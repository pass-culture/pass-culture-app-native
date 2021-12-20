import { IdentityCheckState, Action } from 'features/identityCheck/context/types'

export const initialIdentityCheckState: IdentityCheckState = {
  step: null,
  profile: {
    name: null,
    city: null,
    address: null,
    status: null,
    hasSchoolTypes: false,
    schoolType: null,
  },
  identification: {
    done: false,
    firstName: null,
    lastName: null,
    birthDate: null,
    method: null,
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
    case 'SET_NAME':
      return { ...state, profile: { ...state.profile, name: action.payload } }
    case 'SET_STATUS':
      return { ...state, profile: { ...state.profile, status: action.payload } }
    case 'SET_CITY':
      return { ...state, profile: { ...state.profile, city: action.payload } }
    case 'SET_HAS_SCHOOL_TYPES':
      return { ...state, profile: { ...state.profile, hasSchoolTypes: action.payload } }
    case 'SET_SCHOOL_TYPE':
      return { ...state, profile: { ...state.profile, schoolType: action.payload } }
    case 'SET_ADDRESS':
      return { ...state, profile: { ...state.profile, address: action.payload } }
    case 'SET_IDENTIFICATION':
      return { ...state, identification: { ...state.identification, ...action.payload } }
    case 'SET_METHOD':
      return { ...state, identification: { ...state.identification, method: action.payload } }
    default:
      return state
  }
}
