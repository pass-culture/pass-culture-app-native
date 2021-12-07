import { ActivityEnum } from 'api/gen'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { SuggestedCity } from 'libs/place'

interface Name {
  firstName: string
  lastName: string
}

export interface IdentityCheckState {
  step: IdentityCheckStep | null
  profile: {
    address: string | null
    city: SuggestedCity | null
    name: Name | null
    status: ActivityEnum | null
  }
  identification: {
    done: boolean
    firstName: string | null
    lastName: string | null
    birthDate: string | null
    countryCode: string | null
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
  | { type: 'SET_STATUS'; payload: ActivityEnum | null }
  | { type: 'SET_CITY'; payload: SuggestedCity | null }
  | { type: 'SET_ADDRESS'; payload: string | null }
  | {
      type: 'SET_IDENTIFICATION'
      payload: {
        firstName: string | null
        lastName: string | null
        birthDate: string | null
        countryCode: string | null
      }
    }
