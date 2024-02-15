import { IconInterface } from 'ui/svg/icons/types'

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
