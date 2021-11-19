import { t } from '@lingui/macro'
import React from 'react'

import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing } from 'ui/theme'

export const IdentityCheckWebview: React.FC = () => {
  return (
    <GenericInfoPage
      title={t`Cet écran n'est pas accessible depuis le web`}
      icon={Error}
      iconSize={getSpacing(42)}
    />
  )
}
