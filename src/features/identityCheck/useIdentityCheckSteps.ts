import { t } from '@lingui/macro'

import { StepConfig } from 'features/identityCheck/types'
import { ConfirmationIcon } from 'ui/svg/icons/IdentityCheck/ConfirmationIcon'
import { IdCardIcon } from 'ui/svg/icons/IdentityCheck/IdCardIcon'
import { ProfileIcon } from 'ui/svg/icons/IdentityCheck/ProfileIcon'

// hook as it can be dynamic depending on settings
export const useIdentityCheckSteps = (): StepConfig[] => {
  return [
    {
      name: 'profil',
      icon: ProfileIcon,
      label: t`Ton profil`,
    },
    {
      name: 'identification',
      icon: IdCardIcon,
      label: t`Ton éligibilité`,
    },
    {
      name: 'confirmation',
      icon: ConfirmationIcon,
      label: t`Confirmation`,
    },
  ]
}
