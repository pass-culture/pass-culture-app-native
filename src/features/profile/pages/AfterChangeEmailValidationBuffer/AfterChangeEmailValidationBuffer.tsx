import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { useValidateEmailChangeMutation } from 'features/profile/mutations'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'

export function AfterChangeEmailValidationBuffer() {
  const { navigate } = useNavigation<UseNavigationType>()
  const delayedNavigate: typeof navigate = (...args: Parameters<typeof navigate>) => {
    setTimeout(() => {
      navigate(...args)
    }, 2000)
  }
  const { params } = useRoute<UseRouteType<'AfterChangeEmailValidationBuffer'>>()

  useEffect(beforeEmailValidation, [])

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  const { mutate: validateEmail } = useValidateEmailChangeMutation({
    onSuccess: onEmailValidationSuccess,
    onError: onEmailValidationFailure,
  })

  function beforeEmailValidation() {
    if (isTimestampExpired(params.expiration_timestamp)) {
      delayedNavigate('ChangeEmailExpiredLink', { email: params.email })
      return
    }
    validateEmail({
      emailChangeValidationToken: params.token,
    })
  }

  async function onEmailValidationSuccess() {
    if (isLoggedIn) {
      await signOut()
    }
    delayedNavigate('Login')
  }

  function onEmailValidationFailure() {
    delayedNavigate('ChangeEmailExpiredLink', { email: params.email })
  }

  return <LoadingPage />
}
