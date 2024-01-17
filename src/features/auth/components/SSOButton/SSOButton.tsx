import React from 'react'

import { useGoogleLogin } from 'libs/react-native-google-sso/useGoogleLogin'
import { ButtonSecondaryBlack } from 'ui/components/buttons/ButtonSecondaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
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

export const SSOButton = ({ type, onSuccess }: Props) => {
  const googleLogin = useGoogleLogin({
    onSuccess: ({ code, state = '' }) =>
      onSuccess({ authorizationCode: code, oauthStateToken: state }),
  })

  const buttonWording = `${type === 'login' ? 'Se connecter' : 'S’inscrire'} avec Google`

  return <StyledButton wording={buttonWording} icon={Google} onPress={googleLogin} />
}

const StyledButton = styledButton(ButtonSecondaryBlack)(({ theme }) => ({
  borderColor: theme.colors.greyMedium,
}))
