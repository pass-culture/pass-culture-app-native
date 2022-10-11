import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { IconInterface } from 'ui/svg/icons/types'

export enum IdentityCheckStep {
  PHONE_VALIDATION = 'phone_validation',
  PROFILE = 'profile',
  IDENTIFICATION = 'identification',
  CONFIRMATION = 'confirmation',
  END = 'end',
}

export type SubscriptionScreen = keyof SubscriptionRootStackParamList

export interface StepConfig {
  name: IdentityCheckStep
  label: string
  icon: React.FC<IconInterface>
  screens: SubscriptionScreen[]
}
