import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

export function ChangeEmailExpiredLink() {
  const { isLoggedIn } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()

  let resendEmailNumberOfHits = 0

  const changeEmailExpiredLink = () => {
    resendEmailNumberOfHits++
    analytics.logSendActivationMailAgain(resendEmailNumberOfHits)
    isLoggedIn ? navigate('ChangeEmail') : navigate('Login')
  }

  const upperBodyText = t`Ton adresse e-mail n’a pas été modifiée. Le lien que tu reçois par e-mail expire 24h après sa réception.`
  const lowerBodyText = isLoggedIn
    ? t`Tu peux faire une nouvelle demande de modification dans ton profil.`
    : t`Connecte-toi avec ton ancienne adresse e-mail pour faire une nouvelle demande de modification.`
  const customBodyText = upperBodyText + '\n' + '\n' + lowerBodyText

  const resendEmailButtonText = isLoggedIn ? t`Faire une nouvelle demande` : t`Se connecter`
  const renderResendEmailButton = () => (
    <ButtonPrimaryWhite wording={resendEmailButtonText} onPress={changeEmailExpiredLink} />
  )

  return (
    <LayoutExpiredLink
      renderResendEmailButton={renderResendEmailButton}
      customBodyText={customBodyText}
    />
  )
}
