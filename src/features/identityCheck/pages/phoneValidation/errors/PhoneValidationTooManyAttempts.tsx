import React from 'react'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
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
        externalNav: contactSupport.forPhoneNumberConfirmation,
      }}
      buttonTertiary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}
    />
  )
}
