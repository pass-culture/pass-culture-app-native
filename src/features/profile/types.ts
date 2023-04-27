import { StepVariant } from './components/VerticalStepper/types'

export interface ChangeEmailRequest {
  email: string
  password: string
}

export type ResetRecreditAmountToShowMutationOptions = {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export type FirstOrLastProps = {
  isFirst?: boolean
  isLast?: boolean
}

export type StepVariantProps = {
  /**
   * Use this prop to handle correct stepper step.
   *
   * There is 3 variants available:
   * - `VerticalStepperVariant.complete` for completed step
   * - `VerticalStepperVariant.in_progress` for in-progress step
   * - `VerticalStepperVariant.future` for future step
   *
   * Each one has its own styling, and it should always be only one "in-progress" step.
   * It may exist 0 or more completed and future steps.
   */
  variant: StepVariant
}
