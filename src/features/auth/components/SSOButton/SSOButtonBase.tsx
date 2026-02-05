import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useGoogleLogin } from 'libs/react-native-google-sso/useGoogleLogin'
import { styledButton } from 'ui/components/buttons/styledButton'
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

export const SSOButtonBase = ({ type, onSuccess }: Props) => {
  const googleLogin = useGoogleLogin({
    onSuccess: ({ code, state = '' }) =>
      onSuccess({ authorizationCode: code, oauthStateToken: state }),
  })

  const buttonWording = `${type === 'login' ? 'Se connecter' : 'S’inscrire'} avec Google`

  return (
    <StyledButton
      accessibilityRole={AccessibilityRole.BUTTON}
      wording={buttonWording}
      icon={Google}
      onPress={googleLogin}
      variant="secondary"
      fullWidth
      color="neutral"
    />
  )
}

const StyledButton = styledButton(Button)(({ theme }) => ({
  borderColor: theme.designSystem.color.border.subtle,
}))
