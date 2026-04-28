import React from 'react'

import { CurrencyEnum, SubscriptionStepCompletionState } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { IconStepCurrent } from 'features/identityCheck/components/IconStepCurrent'
import { IconStepDisabled } from 'features/identityCheck/components/IconStepDisabled'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { IconStepRetry } from 'features/identityCheck/components/IconStepRetry'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { ProfileType } from 'features/identityCheck/pages/profile/types'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { StepExtendedDetails, IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useOverrideCreditActivationAmount } from 'shared/user/useOverrideCreditActivationAmount'
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
  firstScreenType?: ProfileType
}

type PartialIdentityCheckStep = Exclude<IdentityCheckStep, IdentityCheckStep.END>
type PartialIdentityCheckStepWithoutPhoneNumber = Exclude<
  IdentityCheckStep,
  IdentityCheckStep.END | IdentityCheckStep.PHONE_VALIDATION
>

type StepsDictionary = Record<PartialIdentityCheckStep, StepConfig>
type StepsDictionaryWithoutPhoneNumber = Record<
  PartialIdentityCheckStepWithoutPhoneNumber,
  StepConfig
>

// hook as it can be dynamic depending on subscription step
export const useStepperInfo = (): StepperInfo => {
  const phoneNumberInProfileStepper = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_PHONE_NUMBER_IN_PROFILE_STEPPER
  )
  const storedProfileInfos = useStoredProfileInfos()

  const { user } = useAuthContext()
  const isUserRegisteredInPacificFrancRegion = user?.currency === CurrencyEnum.XPF

  const { data } = useGetStepperInfoQuery()
  const { shouldBeOverriden: shouldCreditAmountBeOverriden, amount: overriddenCreditAmount } =
    useOverrideCreditActivationAmount()

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

  const hasUserCompletedInfo =
    !!user?.firstName &&
    !!user?.lastName &&
    !!user?.street &&
    !!user?.postalCode &&
    !!user?.city &&
    !!user?.activityId

  const hasStoredProfileInfo =
    !!storedProfileInfos?.address ||
    !!storedProfileInfos?.name ||
    !!storedProfileInfos?.status ||
    !!storedProfileInfos?.city

  const userAlreadyGaveInfos = hasUserCompletedInfo || hasStoredProfileInfo
  const isFirstStepProfileNotCompleted =
    subscriptionStepsToDisplay[0]?.name === 'profile-completion' &&
    subscriptionStepsToDisplay[0].completionState !== SubscriptionStepCompletionState.completed
  const isSecondStepProfileNotCompleted =
    subscriptionStepsToDisplay[1]?.name === 'profile-completion' &&
    subscriptionStepsToDisplay[1].completionState !== SubscriptionStepCompletionState.completed

  const shouldDisplayValidateYourInformation =
    userAlreadyGaveInfos && (isSecondStepProfileNotCompleted || isFirstStepProfileNotCompleted)

  const getFirstScreenForProfileStep = () => {
    if (phoneNumberInProfileStepper) return 'SetName'
    return hasUserCompletedInfo ? 'ProfileInformationValidationCreate' : 'SetName'
  }

  const getFirstScreenTypeForProfileStep = () => {
    if (phoneNumberInProfileStepper) return ProfileTypes.IDENTITY_CHECK
    return hasUserCompletedInfo ? ProfileTypes.RECAP_EXISTING_DATA : ProfileTypes.IDENTITY_CHECK
  }

  const stepsConfig: StepsDictionaryWithoutPhoneNumber = {
    [IdentityCheckStep.PROFILE]: {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: () => <IconStepDisabled Icon={Profile} testID="profile-step-disabled" />,
        current: () => <IconStepCurrent Icon={Profile} testID="profile-step-current" />,
        completed: () => <IconStepDone Icon={Profile} testID="profile-step-done" />,
        retry: () => <IconStepRetry Icon={Profile} testID="profile-retry-step" />,
      },
      firstScreen: getFirstScreenForProfileStep(),
      firstScreenType: getFirstScreenTypeForProfileStep(),
      subtitle: shouldDisplayValidateYourInformation ? 'Confirme tes informations' : undefined,
    },
    [IdentityCheckStep.IDENTIFICATION]: {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: () => <IconStepDisabled Icon={IdCard} testID="identification-step-disabled" />,
        current: () => <IconStepCurrent Icon={IdCard} testID="identification-step-current" />,
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
      firstScreen: 'CulturalSurveyIntro',
      firstScreenType: ProfileTypes.IDENTITY_CHECK,
    },
  }

  const stepConfigWithPhoneNumber: StepsDictionary = {
    ...stepsConfig,
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
      firstScreen: 'SetPhoneNumberWithoutValidation',
      firstScreenType: ProfileTypes.IDENTITY_CHECK,
    },
  }
  const stepConfigToDisplay = phoneNumberInProfileStepper ? stepsConfig : stepConfigWithPhoneNumber
  const stepDetailsList = subscriptionStepsToDisplay
    ? subscriptionStepsToDisplay.map((step) => {
        if (!isPartialIdentityCheckStep(step.name, stepConfigToDisplay)) return null
        const currentStepConfig: StepConfig = stepConfigToDisplay[step.name]
        const stepDetails: StepExtendedDetails = {
          name: currentStepConfig.name,
          title: step.title,
          subtitle: step.subtitle ?? currentStepConfig.subtitle,
          icon: currentStepConfig.icon,
          stepState: mapCompletionState(step.completionState),
          firstScreen: currentStepConfig.firstScreen,
          firstScreenType: currentStepConfig.firstScreenType,
        }
        return stepDetails
      })
    : []

  const stepsDetails = stepDetailsList.filter((step): step is StepExtendedDetails => step != null)

  let overridenSubtitle = subtitle
  if (shouldCreditAmountBeOverriden) {
    overridenSubtitle = overriddenCreditAmount
      ? `Pour débloquer tes ${overriddenCreditAmount} tu dois suivre les étapes suivantes\u00a0:`
      : 'Pour débloquer ton crédit tu dois suivre les étapes suivantes\u00a0:'
  }

  return {
    stepsDetails,
    title,
    subtitle: overridenSubtitle,
    errorMessage: subscriptionMessage?.messageSummary,
  }
}

function isPartialIdentityCheckStep(
  stepName: string,
  stepsConfig: StepsDictionaryWithoutPhoneNumber | StepsDictionary
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
