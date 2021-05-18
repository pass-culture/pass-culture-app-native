import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { ValidateEmailResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { isTimestampExpired } from 'libs/dates'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

import { useLoginRoutine } from '../AuthContext'
import { useValidateEmailMutation } from '../mutations'

export function AfterSignupEmailValidationBuffer() {
  const { data: settings } = useAppSettings()
  const { showInfoSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()
  const delayedNavigate: typeof navigate = (...args: Parameters<typeof navigate>) => {
    setTimeout(() => {
      navigate(...args)
    }, 2000)
  }
  const { params } = useRoute<UseRouteType<'AfterSignupEmailValidationBuffer'>>()

  useEffect(beforeEmailValidation, [])

  const loginRoutine = useLoginRoutine()

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
    if (!response.idCheckToken || !settings?.allowIdCheckRegistration) {
      delayedNavigate('AccountCreated')
    } else {
      delayedNavigate('VerifyEligibility', {
        email: params.email,
        licenceToken: response.idCheckToken,
      })
    }
  }

  function onEmailValidationFailure() {
    showInfoSnackBar({
      message: t`Ce lien de validation n'est plus valide`,
    })
    delayedNavigate(homeNavigateConfig.screen, homeNavigateConfig.params)
  }

  return <LoadingPage />
}
