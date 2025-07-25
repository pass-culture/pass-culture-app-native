import React from 'react'

import { CurrencyEnum, SubscriptionStepCompletionState } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { IconStepCurrent } from 'features/identityCheck/components/IconStepCurrent'
import { IconStepDisabled } from 'features/identityCheck/components/IconStepDisabled'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { IconStepRetry } from 'features/identityCheck/components/IconStepRetry'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { StepExtendedDetails, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { StepButtonState } from 'ui/components/StepButton/types'
import { IdCard } from 'ui/svg/icons/IdCard'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { Profile } from 'ui/svg/icons/Profile'
import { Smartphone } from 'ui/svg/icons/Smartphone'

type StepperInfo = {
  stepsDetails: StepExtendedDetails[]
  title: string
  subtitle?: string | null
  errorMessage?: string | null
  firstScreenType?:
    | ProfileTypes.IDENTITY_CHECK
    | ProfileTypes.BOOKING_FREE_OFFER_15_16
    | ProfileTypes.RECAP_EXISTING_DATA
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

  const { remainingAttempts } = usePhoneValidationRemainingAttemptsQuery()
  const { data } = useGetStepperInfoQuery()
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

  const hasUserCompletedInfo =
    !!user?.firstName && !!user?.lastName && !!user?.street && !!user?.postalCode && !!user?.city

  const stepsConfig: StepsDictionary = {
    [IdentityCheckStep.PROFILE]: {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: () => <IconStepDisabled Icon={Profile} testID="profile-step-disabled" />,
        current: () => <IconStepCurrent Icon={Profile} testID="profile-step-current" />,
        completed: () => <IconStepDone Icon={Profile} testID="profile-step-done" />,
        retry: () => <IconStepRetry Icon={Profile} testID="profile-retry-step" />,
      },
      firstScreen: hasUserCompletedInfo ? 'ProfileInformationValidationCreate' : 'SetName',
      firstScreenType: hasUserCompletedInfo
        ? ProfileTypes.RECAP_EXISTING_DATA
        : ProfileTypes.IDENTITY_CHECK,
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
      firstScreenType: ProfileTypes.IDENTITY_CHECK,
    },
    [IdentityCheckStep.CONFIRMATION]: {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: () => (
          <IconStepDisabled Icon={LegalNotices} testID="confirmation-step-disabled" />
        ),
        current: () => <IconStepCurrent Icon={LegalNotices} testID="confirmation-step-current" />,
        completed: () => <IconStepDone Icon={LegalNotices} testID="confirmation-step-done" />,
        retry: () => <IconStepRetry Icon={LegalNotices} testID="confirmation-retry-step" />,
      },
      firstScreen: getConfirmationFirstScreen(),
      firstScreenType: ProfileTypes.IDENTITY_CHECK,
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
      firstScreenType: ProfileTypes.IDENTITY_CHECK,
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
          firstScreenType: currentStepConfig.firstScreenType,
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
