import { ActivityIdEnum, IdentityCheckMethod, SchoolTypesIdEnum } from 'api/gen'
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
    status: ActivityIdEnum | null
    hasSchoolTypes: boolean
    schoolType: SchoolTypesIdEnum | null
  }
  identification: {
    done: boolean
    firstName: string | null
    lastName: string | null
    birthDate: string | null
    method: IdentityCheckMethod | null
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
  | { type: 'SET_STATUS'; payload: ActivityIdEnum | null }
  | { type: 'SET_HAS_SCHOOL_TYPES'; payload: boolean }
  | { type: 'SET_SCHOOL_TYPE'; payload: SchoolTypesIdEnum | null }
  | { type: 'SET_CITY'; payload: SuggestedCity | null }
  | { type: 'SET_ADDRESS'; payload: string | null }
  | {
      type: 'SET_IDENTIFICATION'
      payload: {
        firstName: string | null
        lastName: string | null
        birthDate: string | null
      }
    }
  | { type: 'SET_METHOD'; payload: IdentityCheckMethod | null }
