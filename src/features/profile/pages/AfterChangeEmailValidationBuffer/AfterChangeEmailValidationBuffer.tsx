import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ChangeBeneficiaryEmailBody } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useLogoutRoutine } from 'features/auth/logout/useLogoutRoutine'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export function AfterChangeEmailValidationBuffer() {
  const { navigate } = useNavigation<UseNavigationType>()
  const delayedNavigate: typeof navigate = (...args: Parameters<typeof navigate>) => {
    setTimeout(() => {
      navigate(...args)
    }, 2000)
  }
  const { params } = useRoute<UseRouteType<'AfterChangeEmailValidationBuffer'>>()

  const { showSuccessSnackBar } = useSnackBarContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(beforeEmailValidation, [])

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  const { mutate: validateEmail } = useMutation(
    (body: ChangeBeneficiaryEmailBody) => api.putnativev1profilevalidateEmail(body),
    {
      onSuccess: onEmailValidationSuccess,
      onError: onEmailValidationFailure,
    }
  )

  function beforeEmailValidation() {
    if (isTimestampExpired(params.expiration_timestamp)) {
      delayedNavigate('ChangeEmailExpiredLink')
      return
    }
    validateEmail({
      token: params.token,
    })
  }

  async function onEmailValidationSuccess() {
    if (isLoggedIn) {
      await signOut()
    }
    delayedNavigate('Login')
    showSuccessSnackBar({
      message:
        'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  function onEmailValidationFailure() {
    delayedNavigate('ChangeEmailExpiredLink')
  }

  return <LoadingPage />
}
