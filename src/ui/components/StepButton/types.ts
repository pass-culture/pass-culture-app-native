import { AccessibleIcon } from 'ui/svg/icons/types'

export type StepDetails = {
  title: string
  subtitle?: string
  icon: Record<StepButtonState, React.FC<AccessibleIcon>>
  stepState: StepButtonState
}

export enum StepButtonState {
  COMPLETED = 'completed',
  CURRENT = 'current',
  DISABLED = 'disabled',
  RETRY = 'retry',
}
