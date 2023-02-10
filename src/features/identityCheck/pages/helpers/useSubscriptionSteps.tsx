import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { theme } from 'theme'
import { BicolorConfirmation } from 'ui/svg/icons/BicolorConfirmation'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { IconInterface } from 'ui/svg/icons/types'

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
      icon: ProfileIcon,
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
      icon: IdCardIcon,
      label: 'Identification',
      screens:
        identification.method === IdentityCheckMethod.educonnect ? educonnectFlow : ubbleFlow,
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: ConfirmationIcon,
      label: 'Confirmation',
      screens: ['IdentityCheckHonor', 'BeneficiaryRequestSent'],
    },
  ]

  if (nextSubscriptionStep?.stepperIncludesPhoneValidation) {
    return [
      {
        name: IdentityCheckStep.PHONE_VALIDATION,
        icon: SmartphoneIcon,
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

const SmartphoneIcon: React.FC<IconInterface> = () => (
  <BicolorSmartphone opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
const ProfileIcon: React.FC<IconInterface> = () => (
  <BicolorProfile opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
const IdCardIcon: React.FC<IconInterface> = () => (
  <BicolorIdCard opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
const ConfirmationIcon: React.FC<IconInterface> = () => (
  <BicolorConfirmation opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
