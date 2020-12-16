import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { ValidateEmailResponse } from 'api/gen'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { isTimestampExpired } from 'libs/dates'
import { _ } from 'libs/i18n'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { loginRoutine } from '../AuthContext'
import { useValidateEmailMutation } from '../mutations'

export function AfterSignupEmailValidationBuffer() {
  const { displayInfosSnackBar } = useSnackBarContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const delayedNavigate: typeof navigate = (...args: Parameters<typeof navigate>) => {
    setTimeout(() => {
      navigate(...args)
    }, 2000)
  }
  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  useEffect(beforeEmailValidation, [])

  const { mutate: validateEmail } = useValidateEmailMutation(
    onEmailValidationSuccess,
    onEmailValidationFailure
  )

  function beforeEmailValidation() {
    if (isTimestampExpired(params.expirationTimestamp)) {
      delayedNavigate('SignupConfirmationExpiredLink', { email: params.email })
      return
    }
    validateEmail({
      emailValidationToken: params.token,
    })
  }

  async function onEmailValidationSuccess(response: ValidateEmailResponse) {
    await loginRoutine(
      { accessToken: response.accessToken, refreshToken: response.refreshToken },
      'fromSignup'
    )
    if (response.idCheckToken === null) {
      delayedNavigate('Home', { shouldDisplayLoginModal: false })
      return
    }
    // TO DO : proceed to IdCheck
  }

  function onEmailValidationFailure() {
    displayInfosSnackBar({
      message: _(t`Ce lien de validation n'est plus valide`),
    })
    delayedNavigate('Home', { shouldDisplayLoginModal: false })
  }

  return <LoadingPage />
}
