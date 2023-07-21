import React from 'react'

import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { computeIdentificationMethod } from 'features/identityCheck/pages/helpers/computeIdentificationMethod'
import { mapStepsDetails } from 'features/identityCheck/pages/helpers/mapStepsDetails'
import { IdentityCheckStep, StepConfig, StepDetails } from 'features/identityCheck/types'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { AccessibleIcon } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useStepperInfo = (): {
  stepsDetails: StepDetails[]
  title: string
  subtitle?: string | null
  errorMessage?: string | null
} => {
  const { remainingAttempts } = usePhoneValidationRemainingAttempts()
  const { stepToDisplay, title, subtitle, errorMessage, identificationMethods } =
    useGetStepperInfo()

  const stepsConfig: StepConfig[] = [
    {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: DisabledProfileIcon,
        current: BicolorProfile,
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="profile-retry-step" />,
      },
      firstScreen: 'SetName',
    },
    {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: DisabledIdCardIcon,
        current: BicolorIdCard,
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
      },
      firstScreen: computeIdentificationMethod(identificationMethods),
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: DisabledConfirmationIcon,
        current: BicolorLegal,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="confirmation-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorLegal} testID="confirmation-retry-step" />,
      },
      firstScreen: 'IdentityCheckHonor',
    },
    {
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
  ]

  const stepsDetails = mapStepsDetails(stepToDisplay, stepsConfig)

  return { stepsDetails, title, subtitle, errorMessage }
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
