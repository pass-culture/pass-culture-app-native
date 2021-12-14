import { t } from '@lingui/macro'
import React from 'react'

import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

export function ChangeEmailExpiredLink() {
  let resendEmailNumberOfHits = 0

  const changeEmailExpiredLink = () => {
    resendEmailNumberOfHits++
    analytics.logSendActivationMailAgain(resendEmailNumberOfHits)
    // TODO (PC-11697): try / catch api call like api.postnativev1requestPasswordReset({ email })
  }

  const bodyText = !email
    ? t`Tu peux te connecter sur ton profil pour recommencer le parcours de changement d’e-mail.` +
      '\n' +
      '\n' +
      t`Si tu as besoin d’aide, n’hésite pas à contacter le support.`
    : undefined

  const renderResendEmailButton = () => (
    <ButtonPrimaryWhite title={t`Renvoyer l'email`} onPress={() => changeEmailExpiredLink()} />
  )

  return (
    <LayoutExpiredLink
      renderResendEmailButton={renderResendEmailButton}
      customBodyText={bodyText}
    />
  )
}
