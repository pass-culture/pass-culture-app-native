import { ProfileType } from 'features/identityCheck/pages/profile/types'
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
  firstScreenType: ProfileType
  subtitle?: string
}

export type StepExtendedDetails = StepConfig & StepDetails
