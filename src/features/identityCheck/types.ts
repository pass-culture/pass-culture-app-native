import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { StepDetails } from 'ui/components/StepButton/types'

export enum DeprecatedIdentityCheckStep {
  PHONE_VALIDATION = 'phone_validation',
  PROFILE = 'profile',
  IDENTIFICATION = 'identification',
  CONFIRMATION = 'confirmation',
  END = 'end',
}

export enum IdentityCheckStep {
  PHONE_VALIDATION = 'phone-validation',
  PROFILE = 'profile-completion',
  IDENTIFICATION = 'identity-check',
  CONFIRMATION = 'honor-statement',
  END = 'end',
}

export interface RehydrationProfile {
  activity: string
  address: string
  city: string
  firstName: string
  lastName: string
  postalCode: string
  schoolType: string
}

export type SubscriptionScreen = keyof SubscriptionStackParamList

export type StepConfig = Pick<StepDetails, 'icon'> & {
  name: IdentityCheckStep
  firstScreen: SubscriptionScreen
  firstScreenType:
    | ProfileTypes.IDENTITY_CHECK
    | ProfileTypes.BOOKING_FREE_OFFER_15_16
    | ProfileTypes.RECAP_EXISTING_DATA
}

export type StepExtendedDetails = StepConfig & StepDetails
