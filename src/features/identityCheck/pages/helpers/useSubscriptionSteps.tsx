import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { IdCardStepDone } from 'features/identityCheck/components/IdCardStepDone'
import { PhoneStepDone } from 'features/identityCheck/components/PhoneStepDone'
import { ProfileStepDone } from 'features/identityCheck/components/ProfileStepDone'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { theme } from 'theme'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLegal } from 'ui/svg/icons/BicolorLegal'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { AccessibleIcon } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useSubscriptionSteps = (): StepConfig[] => {
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

  const steps: StepConfig[] = [
    {
      name: IdentityCheckStep.PROFILE,
      icon: {
        disabled: DisabledProfileIcon,
        current: BicolorProfile,
        completed: ProfileStepDone,
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
      name: IdentityCheckStep.IDENTIFICATION,
      icon: {
        disabled: DisabledIdCardIcon,
        current: BicolorIdCard,
        completed: IdCardStepDone,
      },
      label: 'Identification',
      screens:
        identification.method === IdentityCheckMethod.educonnect ? educonnectFlow : ubbleFlow,
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: {
        disabled: DisabledConfirmationIcon,
        current: BicolorLegal,
        completed: BicolorLegal,
      },
      label: 'Confirmation',
      screens: ['IdentityCheckHonor', 'BeneficiaryRequestSent'],
    },
  ]

  if (nextSubscriptionStep?.stepperIncludesPhoneValidation) {
    return [
      {
        name: IdentityCheckStep.PHONE_VALIDATION,
        icon: {
          disabled: DisabledSmartphoneIcon,
          current: BicolorSmartphone,
          completed: PhoneStepDone,
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
