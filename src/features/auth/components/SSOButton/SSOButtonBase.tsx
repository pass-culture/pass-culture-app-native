import React, { FC } from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { loginToGoogle } from 'libs/react-native-google-sso/loginToGoogle'
import { Button } from 'ui/designSystem/Button/Button'
import { Google } from 'ui/svg/icons/socialNetwork/Google'

type Props = {
  type: 'signup' | 'login'
  onSuccess: ({
    authorizationCode,
    oauthStateToken,
  }: {
    authorizationCode: string
    oauthStateToken: string
  }) => void
}

export const SSOButtonBase: FC<Props> = ({ type, onSuccess }) => {
  const handleLogin = async () =>
    loginToGoogle({
      onSuccess: ({ code, state = '' }) =>
        onSuccess({ authorizationCode: code, oauthStateToken: state }),
    })

  const buttonWording = `${type === 'login' ? 'Se connecter' : 'S’inscrire'} avec Google`

  return (
    <Button
      accessibilityRole={AccessibilityRole.BUTTON}
      wording={buttonWording}
      icon={Google}
      onPress={handleLogin}
      variant="secondary"
      fullWidth
      color="neutral"
    />
  )
}
