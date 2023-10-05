import { ActivityIdEnum, IdentityCheckMethod, SchoolTypesIdEnum } from 'api/gen'
import { Country } from 'features/identityCheck/components/countryPicker/types'
import { DeprecatedIdentityCheckStep, IdentityCheckStep } from 'features/identityCheck/types'
import { SuggestedCity } from 'libs/place'

interface Name {
  firstName: string
  lastName: string
}

interface PhoneNumber {
  phoneNumber: string
  country: {
    callingCode: Country['callingCode']
    countryCode: Country['id']
  }
}

export interface SubscriptionState {
  step: DeprecatedIdentityCheckStep | IdentityCheckStep | null
  phoneValidation: PhoneNumber | null
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
  | { type: 'SET_STEP'; payload: DeprecatedIdentityCheckStep | IdentityCheckStep }
  | { type: 'SET_PHONE_NUMBER'; payload: PhoneNumber }
  | { type: 'SET_NAME'; payload: Name | null }
  | { type: 'SET_STATUS'; payload: ActivityIdEnum | null }
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
  | {
      type: 'SET_PROFILE_INFO'
      payload: {
        name: Name | null
        city: SuggestedCity | null
        address: string | null
      }
    }
