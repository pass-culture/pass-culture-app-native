import { t } from '@lingui/macro'
import React from 'react'

import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { getSpacing } from 'ui/theme'

export const IdentityCheckEnd = () => (
  <GenericInfoPage
    title={t`Ta pièce d’identité a bien été transmise !`}
    icon={EmailSent}
    iconSize={getSpacing(42)}
  />
)
