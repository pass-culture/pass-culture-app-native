import React, { FC } from 'react'
import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { loginToApple } from 'libs/react-native-apple-sso/loginToApple'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'

type Props = {
  type: 'signup' | 'login'
  onSuccess: ({
    authorizationCode,
    oauthStateToken,
    provider,
  }: {
    authorizationCode: string
    oauthStateToken: string
    provider: 'apple'
  }) => void
}

export const SSOButtonAppleBase: FC<Props> = ({ type, onSuccess }) => {
  const { logType } = useLogTypeFromRemoteConfig()

  if (Platform.OS === 'android') return null

  const onError = async (error: unknown) => {
    console.log('[AppleSSO:Button] onError called:', error)
    showErrorSnackBar('Une erreur est survenue, veuillez réessayer.')
    if (logType === LogTypeEnum.INFO) {
      eventMonitoring.captureException(`Can\u2019t login via Apple: ${getErrorMessage(error)}`, {
        level: 'info',
        extra: { error },
      })
    }
  }

  const handleLogin = async () => {
    console.log('[AppleSSO:Button] handleLogin pressed, calling loginToApple...')
    return loginToApple({
      onSuccess: ({ code, state }) => {
        console.log('[AppleSSO:Button] loginToApple onSuccess, calling signIn mutation with:', {
          authorizationCode: code.substring(0, 10) + '...',
          oauthStateToken: state.substring(0, 10) + '...',
          provider: 'apple',
        })
        onSuccess({ authorizationCode: code, oauthStateToken: state, provider: 'apple' })
      },
      onError,
    })
  }

  const buttonWording = `${type === 'login' ? 'Se connecter' : 'S\u2019inscrire'} avec Apple`

  return (
    <Button
      accessibilityRole={AccessibilityRole.BUTTON}
      wording={buttonWording}
      icon={Apple}
      onPress={handleLogin}
      variant="primary"
      fullWidth
      color="neutral"
    />
  )
}
