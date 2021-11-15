import { t } from '@lingui/macro'

import { StepConfig } from 'features/identityCheck/types'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'

// hook as it can be dynamic depending on settings
export const useIdentityCheckSteps = (): StepConfig[] => {
  return [
    {
      name: 'profil',
      icon: Profile,
      label: t`Profil`,
    },
    {
      name: 'identification',
      icon: IdCard,
      label: t`Identification`,
    },
    {
      name: 'confirmation',
      icon: Confirmation,
      label: t`Confirmation`,
    },
  ]
}
