import { t } from '@lingui/macro'
import React from 'react'

import { StepConfig } from 'features/identityCheck/types'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { IconInterface } from 'ui/svg/icons/types'

// hook as it can be dynamic depending on settings
export const useIdentityCheckSteps = (): StepConfig[] => {
  return [
    {
      name: 'profil',
      icon: ProfileIcon,
      label: t`Profil`,
    },
    {
      name: 'identification',
      icon: IdCardIcon,
      label: t`Identification`,
    },
    {
      name: 'confirmation',
      icon: ConfirmationIcon,
      label: t`Confirmation`,
    },
  ]
}

const ProfileIcon: React.FC<IconInterface> = () => <Profile opacity={0.5} />
const IdCardIcon: React.FC<IconInterface> = () => <IdCard opacity={0.5} />
const ConfirmationIcon: React.FC<IconInterface> = () => <Confirmation opacity={0.5} />
