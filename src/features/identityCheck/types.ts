import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { IconInterface } from 'ui/svg/icons/types'

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

export type SubscriptionScreen = keyof SubscriptionRootStackParamList

export interface DeprecatedStepConfig {
  name: DeprecatedIdentityCheckStep
  label: string
  icon: Record<StepButtonState, React.FC<IconInterface>>
  screens: SubscriptionScreen[]
}
export interface StepConfig {
  name: IdentityCheckStep
  icon: Record<StepButtonState, React.FC<IconInterface>>
  screens: SubscriptionScreen[]
}

export interface StepDetails {
  name: IdentityCheckStep
  title: string
  subtitle?: string
  icon: Record<StepButtonState, React.FC<IconInterface>>
  screens: SubscriptionScreen[]
  stepState: StepButtonState
}

export type NextScreenOrStep =
  | { screen: SubscriptionScreen }
  | { step: DeprecatedIdentityCheckStep | IdentityCheckStep }
  | null

export enum StepButtonState {
  'COMPLETED' = 'completed',
  'CURRENT' = 'current',
  'DISABLED' = 'disabled',
  'RETRY' = 'retry',
}
