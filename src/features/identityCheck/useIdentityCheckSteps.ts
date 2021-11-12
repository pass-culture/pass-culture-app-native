import { t } from '@lingui/macro'

import { StepConfig } from 'features/identityCheck/types'
import { Confirmation } from 'ui/svg/icons/IdentityCheck/Confirmation'
import { IdCard } from 'ui/svg/icons/IdentityCheck/IdCard'
import { Profil } from 'ui/svg/icons/IdentityCheck/Profil'

// hook as it can be dynamic depending on settings
export const useIdentityCheckSteps = (): StepConfig[] => {
  return [
    {
      name: 'profil',
      icon: Profil,
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
