import { SubscriptionStepCompletionState, SubscriptionStepperResponse } from 'api/gen'
import { StepConfig } from 'features/identityCheck/types'
import { StepButtonState, StepDetails } from 'ui/components/StepButton/types'

export const mapStepsDetails = (
  stepToDisplayList: SubscriptionStepperResponse['subscriptionStepsToDisplay'],
  stepConfigList: StepConfig[]
): StepDetails[] => {
  const stepDetailsList = stepToDisplayList.map((step) => {
    const currentStepConfig = stepConfigList.find(
      (stepConfig) => stepConfig.name.valueOf() === step.name.valueOf()
    )
    if (!currentStepConfig) return null
    const stepDetails: StepDetails = {
      title: step.title,
      subtitle: step.subtitle ?? undefined,
      icon: currentStepConfig?.icon,
      stepState: mapCompletionState(step.completionState),
    }
    return stepDetails
  })

  const stepDetailsListWithoutNull = stepDetailsList.filter(
    (step): step is StepDetails => step != null
  )
  return stepDetailsListWithoutNull
}

export const mapCompletionState = (state: SubscriptionStepCompletionState) => {
  switch (state) {
    case SubscriptionStepCompletionState.completed:
      return StepButtonState.COMPLETED
    case SubscriptionStepCompletionState.current:
      return StepButtonState.CURRENT
    case SubscriptionStepCompletionState.disabled:
      return StepButtonState.DISABLED
    case SubscriptionStepCompletionState.retry:
      return StepButtonState.RETRY
  }
}
