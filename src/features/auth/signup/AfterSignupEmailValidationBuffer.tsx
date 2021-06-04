import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { api } from 'api/api'
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

    try {
      const me = await api.getnativev1me()
      const nextStepIsIdCheck = // @ts-ignore TODO: this will prevent a breaking change since api v138 sends redirection info in /me route instead of /validate_email response, remove afterwards (See PC-9026)
        (['id-check', 'phone-validation'].includes(me.nextBeneficiaryValidationStep) ||
          response.idCheckToken) &&
        settings?.allowIdCheckRegistration
      if (!nextStepIsIdCheck) {
        delayedNavigate('AccountCreated')
      } else {
        delayedNavigate('VerifyEligibility', {
          email: params.email,
        })
      }
    } catch {
      delayedNavigate('AccountCreated')
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
