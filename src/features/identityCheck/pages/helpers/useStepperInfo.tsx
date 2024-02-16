import React from 'react'

import { SubscriptionStepCompletionState } from 'api/gen'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { StepExtendedDetails, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { theme } from 'theme'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { AccessibleIcon } from 'ui/svg/icons/types'

type StepperInfo = {
  stepsDetails: StepExtendedDetails[]
  title: string
  subtitle?: string | null
  errorMessage?: string | null
}

type PartialIdentityCheckStep = Exclude<IdentityCheckStep, IdentityCheckStep.END>
type StepsDictionary = Record<PartialIdentityCheckStep, StepConfig>

// hook as it can be dynamic depending on subscription step
export const useStepperInfo = (): StepperInfo => {
  const { remainingAttempts } = usePhoneValidationRemainingAttempts()
  const { stepToDisplay, title, subtitle, errorMessage, identificationMethods } =
    useGetStepperInfo()

  const stepsConfig: StepsDictionary = {
    [IdentityCheckStep.PROFILE]: {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: DisabledProfileIcon,
        current: BicolorProfile,
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="profile-retry-step" />,
      },
      firstScreen: 'SetName',
    },
    [IdentityCheckStep.IDENTIFICATION]: {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: DisabledIdCardIcon,
        current: BicolorIdCard,
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
      },
      firstScreen: computeIdentificationMethod(identificationMethods),
    },
    [IdentityCheckStep.CONFIRMATION]: {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: DisabledConfirmationIcon,
        current: BicolorLegal,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="confirmation-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorLegal} testID="confirmation-retry-step" />,
      },
      firstScreen: 'IdentityCheckHonor',
    },
    [IdentityCheckStep.PHONE_VALIDATION]: {
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: DisabledSmartphoneIcon,
        current: BicolorSmartphone,
        completed: () => (
          <IconStepDone Icon={BicolorSmartphone} testID="phone-validation-step-done" />
        ),
        retry: () => (
          <IconRetryStep Icon={BicolorSmartphone} testID="phone-validation-retry-step" />
        ),
      },
      firstScreen: remainingAttempts === 0 ? 'PhoneValidationTooManySMSSent' : 'SetPhoneNumber',
    },
  }

  const stepDetailsList = stepToDisplay.map((step) => {
    if (!isPartialIdentityCheckStep(step.name, stepsConfig)) return null
    const currentStepConfig: StepConfig = stepsConfig[step.name]
    const stepDetails: StepExtendedDetails = {
      name: currentStepConfig.name,
      title: step.title,
      subtitle: step.subtitle ?? undefined,
      icon: currentStepConfig.icon,
      stepState: mapCompletionState(step.completionState),
      firstScreen: currentStepConfig.firstScreen,
    }
    return stepDetails
  })

  const stepsDetails = stepDetailsList.filter((step): step is StepExtendedDetails => step != null)
  return { stepsDetails, title, subtitle, errorMessage }
}

function isPartialIdentityCheckStep(
  stepName: string,
  stepsConfig: StepsDictionary
): stepName is PartialIdentityCheckStep {
  return stepName in stepsConfig
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

const DisabledSmartphoneIcon: React.FC<AccessibleIcon> = () => (
  <BicolorSmartphone
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledSmartphoneIcon"
  />
)
const DisabledProfileIcon: React.FC<AccessibleIcon> = () => (
  <BicolorProfile
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledProfileIcon"
  />
)
const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <BicolorIdCard
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledIdCardIcon"
  />
)
const DisabledConfirmationIcon: React.FC<AccessibleIcon> = () => (
  <BicolorLegal
    size={24}
    color={theme.colors.greyMedium}
    color2={theme.colors.greyMedium}
    testID="DisabledConfirmationIcon"
  />
)
