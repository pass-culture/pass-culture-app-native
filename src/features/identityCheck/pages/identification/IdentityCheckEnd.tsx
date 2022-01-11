import { t } from '@lingui/macro'
import React, { useEffect } from 'react'

import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'

export const IdentityCheckEnd = () => {
  const { data: subscription } = useNextSubscriptionStep()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  useEffect(() => {
    const timeout = setTimeout(
      !subscription?.nextSubscriptionStep ? navigateToHome : navigateToNextScreen,
      3000
    )
    return () => clearTimeout(timeout)
  }, [subscription?.nextSubscriptionStep])

  return (
    <GenericInfoPage title={t`Ta pièce d’identité a bien été transmise\u00a0!`} icon={EmailSent} />
  )
}
