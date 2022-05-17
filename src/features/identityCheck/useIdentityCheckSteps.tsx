import { t } from '@lingui/macro'
import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { env } from 'libs/environment'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { Smartphone } from 'ui/svg/icons/Smartphone'
import { IconInterface } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useIdentityCheckSteps = (): StepConfig[] => {
  const { profile, identification } = useIdentityCheckContext()
  const hasSchoolTypes = profile.hasSchoolTypes

  /**
   * TODO: (PC-14455) replace this const with result from stepperIncludesPhoneValidation value from useNextSubscriptionStep
   */
  const stepsIncludePhoneValidation = env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING

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
  if (stepsIncludePhoneValidation) {
    return [
      {
        name: IdentityCheckStep.PHONE_VALIDATION,
        icon: SmartphoneIcon,
        label: t`Numéro de téléphone`,
        screens: [],
      },
      ...steps,
    ]
  }
  return steps
}

const SmartphoneIcon: React.FC<IconInterface> = () => <Smartphone opacity={0.5} />
const ProfileIcon: React.FC<IconInterface> = () => <Profile opacity={0.5} />
const IdCardIcon: React.FC<IconInterface> = () => <IdCard opacity={0.5} />
const ConfirmationIcon: React.FC<IconInterface> = () => <Confirmation opacity={0.5} />
