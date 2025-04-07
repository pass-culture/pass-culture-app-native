import React from 'react'

import { CurrencyEnum, SubscriptionStepCompletionState } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { StepExtendedDetails, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
  const enableCulturalSurveyMandatory = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY
  )

  const { user } = useAuthContext()
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF

  const { remainingAttempts } = usePhoneValidationRemainingAttempts()
  const { data } = useGetStepperInfo()
  const { data: settings } = useSettingsContext()

  if (!data) {
    return {
      stepsDetails: [],
      title: '',
    }
  }

  const {
    title,
    subscriptionStepsToDisplay,
    subtitle,
    subscriptionMessage,
    allowedIdentityCheckMethods,
  } = data

  const getPhoneValidationFirstScreen = () => {
    if (settings?.enablePhoneValidation) {
      return remainingAttempts === 0 ? 'PhoneValidationTooManySMSSent' : 'SetPhoneNumber'
    }
    return 'SetPhoneNumberWithoutValidation'
  }

  const getConfirmationFirstScreen = () => {
    if (enableCulturalSurveyMandatory && !!user?.needsToFillCulturalSurvey) {
      return 'CulturalSurveyIntro'
    }
    return 'IdentityCheckHonor'
  }

  const stepsConfig: StepsDictionary = {
    [IdentityCheckStep.PROFILE]: {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: DisabledProfileIcon,
        current: () => (
          <BicolorProfile
            color={theme.designSystem.color.icon.brandPrimary}
            color2={theme.designSystem.color.icon.brandPrimary}
          />
        ),
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="profile-retry-step" />,
      },
      firstScreen: 'SetName',
    },
    [IdentityCheckStep.IDENTIFICATION]: {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: DisabledIdCardIcon,
        current: () => (
          <BicolorIdCard
            color={theme.designSystem.color.icon.brandPrimary}
            color2={theme.designSystem.color.icon.brandPrimary}
          />
        ),
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
      },
      firstScreen: computeIdentificationMethod(
        isUserRegisteredInPacificFrancRegion,
        allowedIdentityCheckMethods
      ),
    },
    [IdentityCheckStep.CONFIRMATION]: {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: DisabledConfirmationIcon,
        current: () => (
          <BicolorLegal
            color={theme.designSystem.color.icon.brandPrimary}
            color2={theme.designSystem.color.icon.brandPrimary}
          />
        ),
        completed: () => <IconStepDone Icon={BicolorLegal} testID="confirmation-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorLegal} testID="confirmation-retry-step" />,
      },
      firstScreen: getConfirmationFirstScreen(),
    },
    [IdentityCheckStep.PHONE_VALIDATION]: {
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: DisabledSmartphoneIcon,
        current: () => (
          <BicolorSmartphone
            color={theme.designSystem.color.icon.brandPrimary}
            color2={theme.designSystem.color.icon.brandPrimary}
          />
        ),
        completed: () => (
          <IconStepDone Icon={BicolorSmartphone} testID="phone-validation-step-done" />
        ),
        retry: () => (
          <IconRetryStep Icon={BicolorSmartphone} testID="phone-validation-retry-step" />
        ),
      },
      firstScreen: getPhoneValidationFirstScreen(),
    },
  }

  const stepDetailsList = subscriptionStepsToDisplay
    ? subscriptionStepsToDisplay.map((step) => {
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
    : []

  const stepsDetails = stepDetailsList.filter((step): step is StepExtendedDetails => step != null)

  return {
    stepsDetails,
    title,
    subtitle,
    errorMessage: subscriptionMessage?.messageSummary,
  }
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
    color={theme.designSystem.color.icon.disabled}
    color2={theme.designSystem.color.icon.disabled}
    testID="DisabledSmartphoneIcon"
  />
)
const DisabledProfileIcon: React.FC<AccessibleIcon> = () => (
  <BicolorProfile
    size={24}
    color={theme.designSystem.color.icon.disabled}
    color2={theme.designSystem.color.icon.disabled}
    testID="DisabledProfileIcon"
  />
)
const DisabledIdCardIcon: React.FC<AccessibleIcon> = () => (
  <BicolorIdCard
    size={24}
    color={theme.designSystem.color.icon.disabled}
    color2={theme.designSystem.color.icon.disabled}
    testID="DisabledIdCardIcon"
  />
)
const DisabledConfirmationIcon: React.FC<AccessibleIcon> = () => (
  <BicolorLegal
    size={24}
    color={theme.designSystem.color.icon.disabled}
    color2={theme.designSystem.color.icon.disabled}
    testID="DisabledConfirmationIcon"
  />
)
