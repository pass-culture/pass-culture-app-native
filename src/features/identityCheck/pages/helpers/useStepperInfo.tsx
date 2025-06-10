import React from 'react'

import { CurrencyEnum, SubscriptionStepCompletionState } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IconStepCurrent } from 'features/identityCheck/components/IconStepCurrent'
import { IconStepDisabled } from 'features/identityCheck/components/IconStepDisabled'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { IconStepRetry } from 'features/identityCheck/components/IconStepRetry'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { StepExtendedDetails, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { Smartphone } from 'ui/svg/icons/Smartphone'

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
        disabled: () => <IconStepDisabled Icon={Profile} testID="profile-step-disabled" />,
        current: () => <IconStepCurrent Icon={Profile} testID="profile-step-current" />,
        completed: () => <IconStepDone Icon={Profile} testID="profile-step-done" />,
        retry: () => <IconStepRetry Icon={Profile} testID="profile-retry-step" />,
      },
      firstScreen: 'SetName',
    },
    [IdentityCheckStep.IDENTIFICATION]: {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: () => <IconStepDisabled Icon={Profile} testID="identification-step-disabled" />,
        current: () => <IconStepCurrent Icon={Profile} testID="identification-step-current" />,
        completed: () => <IconStepDone Icon={IdCard} testID="identification-step-done" />,
        retry: () => <IconStepRetry Icon={IdCard} testID="identification-retry-step" />,
      },
      firstScreen: computeIdentificationMethod(
        isUserRegisteredInPacificFrancRegion,
        allowedIdentityCheckMethods
      ),
    },
    [IdentityCheckStep.CONFIRMATION]: {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: () => (
          <IconStepDisabled Icon={BicolorLegal} testID="confirmation-step-disabled" />
        ),
        current: () => <IconStepCurrent Icon={BicolorLegal} testID="confirmation-step-current" />,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="confirmation-step-done" />,
        retry: () => <IconStepRetry Icon={BicolorLegal} testID="confirmation-retry-step" />,
      },
      firstScreen: getConfirmationFirstScreen(),
    },
    [IdentityCheckStep.PHONE_VALIDATION]: {
      name: IdentityCheckStep.PHONE_VALIDATION,
      icon: {
        disabled: () => (
          <IconStepDisabled Icon={Smartphone} testID="phone-validation-step-disabled" />
        ),
        current: () => <IconStepCurrent Icon={Smartphone} testID="phone-validation-step-current" />,
        completed: () => <IconStepDone Icon={Smartphone} testID="phone-validation-step-done" />,
        retry: () => <IconStepRetry Icon={Smartphone} testID="phone-validation-retry-step" />,
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
