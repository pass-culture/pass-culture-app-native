import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { IconInterface } from 'ui/svg/icons/types'

export type SubscriptionScreen = keyof SubscriptionRootStackParamList

export type StepConfig<T> = {
  name: T
  icon: Record<StepButtonState, React.FC<IconInterface>>
  firstScreen: SubscriptionScreen
}

export type StepDetails<T> = StepConfig<T> & {
  title: string
  subtitle?: string
  stepState: StepButtonState
}

export enum StepButtonState {
  COMPLETED = 'completed',
  CURRENT = 'current',
  DISABLED = 'disabled',
  RETRY = 'retry',
}
