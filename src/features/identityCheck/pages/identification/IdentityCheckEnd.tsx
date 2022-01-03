import { t } from '@lingui/macro'
import React, { useEffect } from 'react'

import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'

export const IdentityCheckEnd = () => {
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  useEffect(() => {
    const timeout = setTimeout(navigateToNextScreen, 3000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <GenericInfoPage title={t`Ta pièce d’identité a bien été transmise\u00a0!`} icon={EmailSent} />
  )
}
