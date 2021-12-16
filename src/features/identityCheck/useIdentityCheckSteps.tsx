import { t } from '@lingui/macro'
import React from 'react'

import { IdentityCheckMethod } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { useUserProfileInfo } from 'features/home/api'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { IconInterface } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on subscription step
export const useIdentityCheckSteps = (): StepConfig[] => {
  const { data: subscription } = useNextSubscriptionStep()
  const { profile } = useIdentityCheckContext()

  const hasSchoolTypes = profile.hasSchoolTypes
  const { data: userProfileInfo } = useUserProfileInfo()

  const shouldUseEduConnect = subscription?.allowedIdentityCheckMethods.includes(
    IdentityCheckMethod.Educonnect
  )

  return [
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
      screens: shouldUseEduConnect
        ? ['IdentityCheckEduConnect', 'IdentityCheckEduConnectForm', 'IdentityCheckValidation']
        : ['IdentityCheckStart', 'IdentityCheckWebview', 'IdentityCheckEnd'],
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: ConfirmationIcon,
      label: t`Confirmation`,
      screens: [
        'IdentityCheckHonor',
        !userProfileInfo?.domainsCredit?.all?.initial
          ? 'BeneficiaryRequestSent'
          : 'UnderageAccountCreated',
      ],
    },
  ]
}

const ProfileIcon: React.FC<IconInterface> = () => <Profile opacity={0.5} />
const IdCardIcon: React.FC<IconInterface> = () => <IdCard opacity={0.5} />
const ConfirmationIcon: React.FC<IconInterface> = () => <Confirmation opacity={0.5} />
