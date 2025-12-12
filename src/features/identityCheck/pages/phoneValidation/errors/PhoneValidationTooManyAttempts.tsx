import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'

export function PhoneValidationTooManyAttempts() {
  return (
    <GenericInfoPage
      illustration={UserBlocked}
      title="Trop de tentatives&nbsp;!"
      subtitle="Tu as dépassé le nombre d’essais autorisés. L’accès à ton crédit pass Culture a été bloqué. Pour le récupérer tu peux contacter le support."
      buttonPrimary={{
        wording: 'Contacter le support',
        externalNav: { url: env.SUPPORT_ACCOUNT_ISSUES_FORM },
        onBeforeNavigate: () =>
          analytics.logHasClickedContactForm('PhoneValidationTooManyAttempts'),
      }}
      buttonTertiary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}
    />
  )
}
