import { IdentityCheckStep } from 'features/identityCheck/types'
import { SuggestedCity } from 'libs/place'

export interface IdentityCheckState {
  step: IdentityCheckStep | null
  profile: {
    city: SuggestedCity | null
    status: string | null
  }
  identification: {
    done: boolean
  }
  confirmation: {
    accepted: boolean
  }
}

export type Action =
  | { type: 'INIT' }
  | { type: 'SET_STATE'; payload: Partial<IdentityCheckState> }
  | { type: 'SET_STEP'; payload: IdentityCheckStep }
  | { type: 'SET_CITY'; payload: SuggestedCity | null }
