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
  PROFILE = 'profile-completion',
  IDENTIFICATION = 'identity-check',
  CONFIRMATION = 'honor-statement',
  PHONE_VALIDATION = 'phone-validation',
  END = 'end',
}
enum IdentityCheckStepWithPhoneNumber {
  PROFILE = 'profile-completion',
  IDENTIFICATION = 'identity-check',
  CONFIRMATION = 'honor-statement',
  END = 'end',
  PHONE_VALIDATION = 'phone-validation',
}

export type SubscriptionScreen = keyof SubscriptionStackParamList

export type StepConfig = Pick<StepDetails, 'icon'> & {
  name: IdentityCheckStep | IdentityCheckStepWithPhoneNumber
  firstScreen: SubscriptionScreen
  firstScreenType: ProfileType
  subtitle?: string
}

export type StepExtendedDetails = StepConfig & StepDetails
