import { IdentityCheckStep } from 'features/identityCheck/types'
import { SuggestedCity } from 'libs/place'

interface Name {
  firstName: string
  lastName: string
}

export interface IdentityCheckState {
  step: IdentityCheckStep | null
  profile: {
    name: Name | null
    city: SuggestedCity | null
    cityCode: string | null
    postalCode: string | null
    address: string | null
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
  | { type: 'SET_NAME'; payload: Name | null }
  | { type: 'SET_CITY'; payload: SuggestedCity | null }
  | { type: 'SET_CITY_CODE'; payload: string | null }
  | { type: 'SET_POSTAL_CODE'; payload: string | null }
  | { type: 'SET_ADDRESS'; payload: string | null }
