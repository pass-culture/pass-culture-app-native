import { SubscriptionStepperResponse } from 'api/gen'
import { StepConfigNewStepper, StepDetails } from 'features/identityCheck/types'

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
    }
    return stepDetails
  })

  const stepDetailsListWithoutNull = stepDetailsList.filter((step) => step != null) as StepDetails[]
  return stepDetailsListWithoutNull
}
