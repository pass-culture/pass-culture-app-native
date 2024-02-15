import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { IconInterface } from 'ui/svg/icons/types'

export type SubscriptionScreen = keyof SubscriptionRootStackParamList

export type StepDetails = {
  title: string
  subtitle?: string
  icon: Record<StepButtonState, React.FC<IconInterface>>
  stepState: StepButtonState
}

export enum StepButtonState {
  COMPLETED = 'completed',
  CURRENT = 'current',
  DISABLED = 'disabled',
  RETRY = 'retry',
}
