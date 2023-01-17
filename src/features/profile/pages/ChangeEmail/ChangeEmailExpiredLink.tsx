import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export function ChangeEmailExpiredLink() {
  const { isLoggedIn } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()

  let resendEmailNumberOfHits = 0

  const changeEmailExpiredLink = () => {
    resendEmailNumberOfHits++
    analytics.logSendActivationMailAgain(resendEmailNumberOfHits)
    isLoggedIn ? navigate('ChangeEmail') : navigate('Login')
  }

  const upperBodyText =
    'Ton adresse e-mail n’a pas été modifiée. Le lien que tu reçois par e-mail expire 24h après sa réception.'
  const lowerBodyText = isLoggedIn
    ? 'Tu peux faire une nouvelle demande de modification dans ton profil.'
    : 'Connecte-toi avec ton ancienne adresse e-mail pour faire une nouvelle demande de modification.'
  const customBodyText = upperBodyText + DOUBLE_LINE_BREAK + lowerBodyText

  const resendEmailButtonText = isLoggedIn ? 'Faire une nouvelle demande' : 'Se connecter'
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
