import { t } from '@lingui/macro'
import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/api'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { theme } from 'theme'
import { BicolorConfirmation } from 'ui/svg/icons/BicolorConfirmation'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { Profile } from 'ui/svg/icons/Profile'
import { IconInterface } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useIdentityCheckSteps = (): StepConfig[] => {
  const { profile, identification } = useIdentityCheckContext()
  const hasSchoolTypes = profile.hasSchoolTypes
  const { data: nextSubscriptionStep } = useNextSubscriptionStep()
  const { remainingAttempts } = usePhoneValidationRemainingAttempts()

  const steps: StepConfig[] = [
    {
      name: IdentityCheckStep.PROFILE,
      icon: ProfileIcon,
      label: t`Profil`,
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
      label: t`Identification`,
      screens:
        identification.method === IdentityCheckMethod.educonnect
          ? ['IdentityCheckEduConnect', 'IdentityCheckEduConnectForm', 'IdentityCheckValidation']
          : ['IdentityCheckStart', 'IdentityCheckWebview', 'IdentityCheckEnd'],
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: ConfirmationIcon,
      label: t`Confirmation`,
      screens: ['IdentityCheckHonor', 'BeneficiaryRequestSent'],
    },
  ]
  if (nextSubscriptionStep?.stepperIncludesPhoneValidation) {
    return [
      {
        name: IdentityCheckStep.PHONE_VALIDATION,
        icon: SmartphoneIcon,
        label: t`Numéro de téléphone`,
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
const ProfileIcon: React.FC<IconInterface> = () => <Profile opacity={0.5} />
const IdCardIcon: React.FC<IconInterface> = () => (
  <BicolorIdCard opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
const ConfirmationIcon: React.FC<IconInterface> = () => (
  <BicolorConfirmation opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
