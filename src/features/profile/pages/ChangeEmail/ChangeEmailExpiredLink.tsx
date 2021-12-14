import { t } from '@lingui/macro'
import React from 'react'

import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

export function ChangeEmailExpiredLink() {
  const { isLoggedIn } = useAuthContext()

  let resendEmailNumberOfHits = 0

  const changeEmailExpiredLink = () => {
    resendEmailNumberOfHits++
    analytics.logSendActivationMailAgain(resendEmailNumberOfHits)
    // TODO (PC-11697): try / catch api call like api.postnativev1requestPasswordReset({ email })
  }

  const bodyText =
    t`Ton adresse e-mail n’a pas été modifiée. Le lien que tu reçois par e-mail expire 24h après sa réception.` +
    '\n' +
    '\n' +
    (isLoggedIn
      ? t`Tu peux faire une nouvelle demande de modification dans ton profil.`
      : t`Connecte-toi avec ton ancienne adresse e-mail pour faire une nouvelle demande de modification.`)

  const resendEmailButtonText = isLoggedIn ? t`Faire une nouvelle demande` : t`Se connecter`
  const renderResendEmailButton = () => (
    <ButtonPrimaryWhite title={resendEmailButtonText} onPress={() => changeEmailExpiredLink()} />
  )

  return (
    <LayoutExpiredLink
      renderResendEmailButton={renderResendEmailButton}
      customBodyText={bodyText}
    />
  )
}
