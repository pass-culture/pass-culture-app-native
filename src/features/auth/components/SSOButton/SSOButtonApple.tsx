import { useRoute } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'

import { useSignInMutation } from 'features/auth/queries/useSignInMutation'
import { SignInResponseFailure } from 'features/auth/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
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
  onSignInFailure?: (error: SignInResponseFailure) => void
}

export const SSOButtonApple: FC<Props> = ({ type, onSignInFailure }) => {
  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const { logType } = useLogTypeFromRemoteConfig()
  const isSignupButton = type === 'signup'
  const { mutate: signIn } = useSignInMutation({
    params,
    onFailure: (error) => onSignInFailure?.(error),
    analyticsType: isSignupButton ? 'SSO_signup' : 'SSO_login',
    analyticsMethod: isSignupButton ? 'fromSignup' : 'fromLogin',
  })

  if (Platform.OS === 'android') return null

  const onError = async (error: unknown) => {
    showErrorSnackBar('Une erreur est survenue, veuillez réessayer.')
    if (logType === LogTypeEnum.INFO) {
      eventMonitoring.captureException(`Can\u2019t login via Apple: ${getErrorMessage(error)}`, {
        level: 'info',
        extra: { error },
      })
    }
  }

  const handleLogin = async () =>
    loginToApple({
      onSuccess: ({ code, state }) =>
        signIn({ authorizationCode: code, oauthStateToken: state, provider: 'apple' }),
      onError,
    })

  const wording = `${type === 'login' ? 'Se connecter' : 'S\u2019inscrire'} avec Apple`

  return (
    <Button
      accessibilityRole={AccessibilityRole.BUTTON}
      wording={wording}
      icon={Apple}
      onPress={handleLogin}
      variant="secondary"
      fullWidth
      color="neutral"
    />
  )
}
