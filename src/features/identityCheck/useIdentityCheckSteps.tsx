import { t } from '@lingui/macro'
import React from 'react'

import { useAppSettings } from 'features/auth/settings'
import { IdentityCheckStep, StepConfig } from 'features/identityCheck/types'
import { useEduconnect } from 'features/identityCheck/utils/useEduConnect'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { IconInterface } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on settings
export const useIdentityCheckSteps = (): StepConfig[] => {
  const { data: settings } = useAppSettings()

  const allowIdCheckRegistration = settings?.allowIdCheckRegistration
  const { shouldUseEduConnect } = useEduconnect()

  return [
    {
      name: IdentityCheckStep.PROFILE,
      icon: ProfileIcon,
      label: t`Profil`,
      screens: ['SetName', 'IdentityCheckCity', 'IdentityCheckAddress', 'IdentityCheckStatus'],
    },
    {
      name: IdentityCheckStep.IDENTIFICATION,
      icon: IdCardIcon,
      label: t`Identification`,
      screens: shouldUseEduConnect
        ? ['IdentityCheckEduConnect', 'IdentityCheckEduConnectForm', 'IdentityCheckValidation']
        : [
            'IdentityCheckStart',
            allowIdCheckRegistration ? 'IdentityCheckWebview' : 'IdentityCheckUnavailable',
            'IdentityCheckEnd',
          ],
    },
    {
      name: IdentityCheckStep.CONFIRMATION,
      icon: ConfirmationIcon,
      label: t`Confirmation`,
      screens: ['IdentityCheckHonor', 'BeneficiaryRequestSent'],
    },
  ]
}

const ProfileIcon: React.FC<IconInterface> = () => <Profile opacity={0.5} />
const IdCardIcon: React.FC<IconInterface> = () => <IdCard opacity={0.5} />
const ConfirmationIcon: React.FC<IconInterface> = () => <Confirmation opacity={0.5} />
