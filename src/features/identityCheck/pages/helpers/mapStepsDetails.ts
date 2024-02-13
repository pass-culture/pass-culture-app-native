import { SubscriptionStepCompletionState, SubscriptionStepperResponse } from 'api/gen'
import {
  IdentityCheckStep,
  StepButtonState,
  StepConfig,
  StepDetails,
} from 'features/identityCheck/types'

export const mapStepsDetails = (
  stepToDisplayList: SubscriptionStepperResponse['subscriptionStepsToDisplay'],
  stepConfigList: StepConfig<IdentityCheckStep>[]
): StepDetails<IdentityCheckStep>[] => {
  const stepDetailsList = stepToDisplayList.map((step) => {
    const currentStepConfig = stepConfigList.find(
      (stepConfig) => stepConfig.name.valueOf() === step.name.valueOf()
    )
    if (!currentStepConfig) return null
    const stepDetails: StepDetails<IdentityCheckStep> = {
      name: currentStepConfig?.name,
      title: step.title,
      subtitle: step.subtitle ?? undefined,
      icon: currentStepConfig?.icon,
      firstScreen: currentStepConfig?.firstScreen,
      stepState: mapCompletionState(step.completionState),
    }
    return stepDetails
  })

  const stepDetailsListWithoutNull = stepDetailsList.filter(
    (step): step is StepDetails<IdentityCheckStep> => step != null
  )
  return stepDetailsListWithoutNull
}

const mapCompletionState = (state: SubscriptionStepCompletionState) => {
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
