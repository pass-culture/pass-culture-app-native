import React, { FC } from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { loginToGoogle } from 'libs/react-native-google-sso/loginToGoogle'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
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
  const { logType } = useLogTypeFromRemoteConfig()

  const onError = async (error: unknown) => {
    showErrorSnackBar('Une erreur est survenue, veuillez réessayer.')
    if (logType === LogTypeEnum.INFO) {
      const errorMessage = getErrorMessage(error)
      eventMonitoring.captureException(`Can’t login via Google: ${errorMessage}`, {
        level: 'info',
        extra: { error },
      })
    }
  }

  const handleLogin = async () =>
    loginToGoogle({
      onSuccess: ({ code, state = '' }) =>
        onSuccess({ authorizationCode: code, oauthStateToken: state }),
      onError,
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
