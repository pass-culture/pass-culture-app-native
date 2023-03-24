import { SubscriptionStepCompletionState, SubscriptionStepperResponse } from 'api/gen'
import { StepButtonState, StepConfigNewStepper, StepDetails } from 'features/identityCheck/types'

export const mapStepsDetails = (
  stepToDisplayList: SubscriptionStepperResponse['subscriptionStepsToDisplay'],
  stepConfigList: StepConfigNewStepper[]
): StepDetails[] => {
  const stepDetailsList = stepToDisplayList.map((step) => {
    const currentStepConfig = stepConfigList.find(
      (stepConfig) => stepConfig.name.valueOf() === step.name.valueOf()
    )
    if (!currentStepConfig) return null
    const stepDetails: StepDetails = {
      name: currentStepConfig?.name,
      title: step.title,
      icon: currentStepConfig?.icon,
      screens: currentStepConfig?.screens,
      stepState: mapCompletionState(step.completionState),
    }
    return stepDetails
  })

  const stepDetailsListWithoutNull = stepDetailsList.filter((step) => step != null) as StepDetails[]
  return stepDetailsListWithoutNull
}

const mapCompletionState = (state: SubscriptionStepCompletionState) => {
  if (state === SubscriptionStepCompletionState.completed) return StepButtonState.COMPLETED
  if (state === SubscriptionStepCompletionState.current) return StepButtonState.CURRENT
  if (state === SubscriptionStepCompletionState.disabled) return StepButtonState.DISABLED
  if (state === SubscriptionStepCompletionState.retry) return StepButtonState.CURRENT
  return StepButtonState.DISABLED
}
