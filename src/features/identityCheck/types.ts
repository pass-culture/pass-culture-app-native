import { ProfileType } from 'features/identityCheck/pages/profile/types'
import { SubscriptionStackParamList } from 'features/navigation/navigators/SubscriptionStackNavigator/types'
import { StepDetails } from 'ui/components/StepButton/types'

export enum IdentityCheckStep {
  PROFILE = 'profile-completion',
  IDENTIFICATION = 'identity-check',
  CONFIRMATION = 'honor-statement',
  END = 'end',
}

export type SubscriptionScreen = keyof SubscriptionStackParamList

export type StepConfig = Pick<StepDetails, 'icon'> & {
  name: IdentityCheckStep
  firstScreen: SubscriptionScreen
  firstScreenType: ProfileType
  subtitle?: string
}

export type StepExtendedDetails = StepConfig & StepDetails
