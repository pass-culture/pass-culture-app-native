import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { IconInterface } from 'ui/svg/icons/types'

export enum IdentityCheckStep {
  PHONE_VALIDATION = 'phone_validation',
  PROFILE = 'profile',
  IDENTIFICATION = 'identification',
  CONFIRMATION = 'confirmation',
  END = 'end',
}

export enum IdentityCheckStepNewStepper {
  PHONE_VALIDATION = 'phone-validation',
  PROFILE = 'profile-completion',
  IDENTIFICATION = 'identity-check',
  CONFIRMATION = 'honor-statement',
  END = 'end',
}

export type SubscriptionScreen = keyof SubscriptionRootStackParamList

export interface StepConfig {
  name: IdentityCheckStep
  label: string
  icon: Record<StepButtonState, React.FC<IconInterface>>
  screens: SubscriptionScreen[]
}
export interface StepConfigNewStepper {
  name: IdentityCheckStepNewStepper
  icon: Record<StepButtonState, React.FC<IconInterface>>
  screens: SubscriptionScreen[]
}

export interface StepDetails {
  name: IdentityCheckStepNewStepper
  title: string
  icon: Record<StepButtonState, React.FC<IconInterface>>
  screens: SubscriptionScreen[]
}

export type NextScreenOrStep = { screen: SubscriptionScreen } | { step: IdentityCheckStep } | null

export enum StepButtonState {
  'COMPLETED' = 'completed',
  'CURRENT' = 'current',
  'DISABLED' = 'disabled',
}
