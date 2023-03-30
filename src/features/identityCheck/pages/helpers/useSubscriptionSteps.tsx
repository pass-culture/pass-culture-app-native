import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IconRetryStep } from 'features/identityCheck/components/IconRetryStep'
import { IconStepDone } from 'features/identityCheck/components/IconStepDone'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { DeprecatedIdentityCheckStep, DeprecatedStepConfig } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { AccessibleIcon } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useSubscriptionSteps = (): DeprecatedStepConfig[] => {
  const { profile, identification } = useSubscriptionContext()
  const hasSchoolTypes = profile.hasSchoolTypes
  const { data: nextSubscriptionStep } = useNextSubscriptionStep()
  const { remainingAttempts } = usePhoneValidationRemainingAttempts()

  const educonnectFlow: (keyof SubscriptionRootStackParamList)[] = [
    'IdentityCheckEduConnect',
    'IdentityCheckEduConnectForm',
    'IdentityCheckValidation',
  ]

  const ubbleFlow: (keyof SubscriptionRootStackParamList)[] = ['SelectIDOrigin']

  const steps: DeprecatedStepConfig[] = [
    {
      name: DeprecatedIdentityCheckStep.PROFILE,
      icon: {
        disabled: DisabledProfileIcon,
        current: BicolorProfile,
        completed: () => <IconStepDone Icon={BicolorProfile} testID="profile-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorProfile} testID="profile-retry-step" />,
      },
      label: 'Profil',
      screens: hasSchoolTypes
        ? [
            'SetName',
            'IdentityCheckCity',
            'IdentityCheckAddress',
            'IdentityCheckStatus',
            'IdentityCheckSchoolType',
          ]
        : ['SetName', 'IdentityCheckCity', 'IdentityCheckAddress', 'IdentityCheckStatus'],
    },
    {
      name: DeprecatedIdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: DisabledIdCardIcon,
        current: BicolorIdCard,
        completed: () => <IconStepDone Icon={BicolorIdCard} testID="identification-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorIdCard} testID="identification-retry-step" />,
      },
      label: 'Identification',
      screens:
        identification.method === IdentityCheckMethod.educonnect ? educonnectFlow : ubbleFlow,
    },
    {
      name: DeprecatedIdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: DisabledConfirmationIcon,
        current: BicolorLegal,
        completed: () => <IconStepDone Icon={BicolorLegal} testID="confirmation-step-done" />,
        retry: () => <IconRetryStep Icon={BicolorLegal} testID="confirmation-retry-step" />,
      },
      label: 'Confirmation',
      screens: ['IdentityCheckHonor', 'BeneficiaryRequestSent'],
    },
  ]

  if (nextSubscriptionStep?.stepperIncludesPhoneValidation) {
    return [
      {
        name: DeprecatedIdentityCheckStep.PHONE_VALIDATION,
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
        label: 'Numéro de téléphone',
        screens:
          remainingAttempts === 0
            ? ['PhoneValidationTooManySMSSent']
            : ['SetPhoneNumber', 'SetPhoneValidationCode'],
      },
      ...steps,
    ]
  }
  return steps
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
