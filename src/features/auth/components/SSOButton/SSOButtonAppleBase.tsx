import React, { FC } from 'react'
import { Platform } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { saveAppleSSOContext } from 'libs/react-native-apple-sso/appleSSOContext'
import { loginToApple } from 'libs/react-native-apple-sso/loginToApple'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'

type Props = {
  type: 'signup' | 'login'
  // Used on native — called with auth result after Apple SDK returns
  onSuccess?: ({
    authorizationCode,
    oauthStateToken,
    provider,
  }: {
    authorizationCode: string
    oauthStateToken: string
    provider: 'apple'
  }) => void
  // Used on web — saved to sessionStorage before redirect to Apple
  params?: RootStackParamList['Login' | 'SignupForm']
}

export const SSOButtonAppleBase: FC<Props> = ({ type, onSuccess, params }) => {
  const { logType } = useLogTypeFromRemoteConfig()

  if (Platform.OS === 'android' || Platform.OS === 'web') return null

  const onError = async (error: unknown) => {
    showErrorSnackBar('Une erreur est survenue, veuillez réessayer.')
    if (logType === LogTypeEnum.INFO) {
      eventMonitoring.captureException(`Can\u2019t login via Apple: ${getErrorMessage(error)}`, {
        level: 'info',
        extra: { error },
      })
    }
  }

  const handleLogin = async () => {
    // oauthStateToken will be set by loginToApple() after fetching it from the backend
    saveAppleSSOContext({ type, params, oauthStateToken: '' })
    return loginToApple({
      onSuccess: ({ code, state }) => {
        onSuccess?.({ authorizationCode: code, oauthStateToken: state, provider: 'apple' })
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
